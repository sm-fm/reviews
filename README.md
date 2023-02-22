# Reviews Microservice

## 💡 Overview
This was an inherited legacy code base with the following instructions: "The current backend system for this E-commerce site cannot withstand the increased traffic it is receiving, replace the API and database for the reviews service. Your other teammates will replace the other services." This was a monorepo, and we were tasked with also restructuring it to a microservices architecture. Below documents the process throughout as well as production optimizations.

The following repo is for the product reviews service alone. K6 was used for stress testing locally and loaderio + New Relic were used for stress testing in production. Nginx was used for load-balancing and caching, however, you won't find the Nginx conf file in this repo because it was created and changed directly in the AWS instance with which is was deployed. The final architecture looks like the following: 

![Reviews Service System Design - Flowchart](https://user-images.githubusercontent.com/98621806/219970292-14376e0e-c883-45c1-ad7f-3796139c4626.jpeg)

## 🎉 Highlights

- Optimized SQL query execution times from 5,717ms to 0.06ms through json aggregation and table indexing 
- Achieved the following metric improvements by horizontally scaling through fine-tuning Nginx's load balancing and caching:
  - Lowered error rate from 66% for 1000 RPS to 0% for 10,000 RPS
  - Lowered response time average from 4389ms fro 1000 RPS to 12ms for 10,000 RPS
  - Improved throughput from 22,667/60k to 599,937/600k for 10,000 RPS
- Leveraged Python/Pandas/NumPy to combine CSVs to improve and simplify the ETL process for over 19 million records
- Converted monorepo to service-oriented architecture and deployed on AWS EC2 instances
- Achieved 91% code coverage through Mocha, Chai, and Supertest

## ⚡️ Production Performance Improvements

### Before load balancing (/dbmeta 1000 RPS)
![dbmeta-before-1000RPS](https://user-images.githubusercontent.com/98621806/219963958-feeac479-82b2-472a-a76f-76dec6603ede.jpg)

### After load balancing (/dbmeta 1000 RPS)
![dbmeta-after-3servers-1000RPS](https://user-images.githubusercontent.com/98621806/219964010-6f7d61b2-198b-4e09-a8d3-01dbedaad2c0.jpg)

### Takeaways
By adding three API servers, the error rate of about 66%, the response time avg of 5,389ms, and the throughput of
20k/60k was improved to around 62%, 4,389ms, and 22,667/60k respectively. The big difference here is the response time average, however,
it was still taking over 4 seconds to get a response on average, and the throughput/error rate were still really bad. Adding a fourth API server helped a little, but still not much. By analyzing New Relic, it was apparent that CPU usage was very high for the Postgres server (up to 99% during 1k RPS),
indicating that was a bottleneck area. This led to the decision to cache with Nginx in order to take work off of the Postgres server.

### Before caching (/dbreviews 1000 RPS)
![dbreviews-before-cache-4servers-1000RPS](https://user-images.githubusercontent.com/98621806/219964475-f5108474-cf8b-48bf-ba1c-6b929c9434fe.jpg)

### After caching (/dbreviews 1000 RPS)
![dbreviews-after-cache-1000](https://user-images.githubusercontent.com/98621806/219964543-a03b6cc0-8e50-4f9f-bb53-9d5f6a687f36.jpg)

### After caching (/dbreviews 10k RPS incrementing over a range of 100k product id's)
![increment-10kRPS-cache](https://user-images.githubusercontent.com/98621806/219964592-2c8772cf-a13d-4b0c-9790-1707721e845f.jpg)

### Takeaways
The hypothesis that the database server was the major bottleneck was correct. Through implementing caching, the error
rate of 44%, response time avg of 1327ms, and throughput of 33966/60k was improved to 0%, 12ms, and 59999/60k respectively. With caching, the architecture was able to handle up to 10k RPS with similar metrics. However, it is important to note that the test was incrementing through a 
list of product id's by 1 over a 100k range. When this was changed to choose a random product id over the same 100k range, the results were much worse than with incrementing. 

### After caching (/dbreviews 1k RPS random product id 100k range load-balanced with 4 servers)
![dbreviews-random_id-cache+load1000RPS](https://user-images.githubusercontent.com/98621806/219965088-a02d3892-08eb-41cf-86c0-90ed15fb8e81.jpg)

### Takeaways
Here we can see the error rate, response time avg, and throughput are much worse than incrementing even at 1K RPS. The Nginx
server CPU usuage was going as high as 99%, indicating that the Nginx server was now the bottleneck. However, if the cache size for Nginx is not
explicity set, it is automatically set to 512mg, and the responses in sum were definitely above that limit. Therefore, the cache size was changed to 3gb. 
The results are below.

### After increasing cache to 3gb (/dbreviews 2500 RPS random product id 100k range load-balanced with 4 servers)
![random-increased_cache2500RPS](https://user-images.githubusercontent.com/98621806/219965575-042b80ca-d5bc-4cf9-9e2e-8e41d1516a67.jpg)


### Takeaways
By increasing the cache size, the metrics significantly improved. The error rate went down to 1%, average response time went to 64ms, and throughput 
was 147933/150k. However, this seemed to be the limit with similar metrics. When tested with 3k RPS, the metrics went back to previous poor performance
acheived before increasing the cache.

However, it became evident that the worker_rlimit_nofile and worker_connections weren't fine tuned for the server. worker_rlimit_nofile sets how many 
files can be open simultaenously with Nginx. After checking the error logs, a common error that kept coming up was "too many files open", indicating that 
the number for the limit was too low. This needed to be raised, but appropriately, because if it was raised too high, it would take up all of the memory 
and actually decrease performance. With this is mind, it was moved up to 40k, which resulted in 0% error rate, 12ms avg response time, and 299,957/300k 
throughput for 5k requests randomized across 50k product ids. 

Worker connections were also set to 40k to get the above improvements. Worker connections is the max number of connections an Nginx worker process can 
handle at the same time. Setting this too high can overwhelm the worker processes if the server specs can't handle that many processes happening 
concurrently. Looking at New Relic, it was evident the Nginx server's CPU and memory usage were reaching up to 88%, so it seemed this was set too high. 

A formula can be used to approximate the number of worker connections should be set at. For 10k RPS, the expected memory usage for each connection
needed to be calculated to ensure the total memory usage of all connections did not exceed the 1gb of RAM the Nginx server had. Memory usage depends
on serveral factors such as the size of the request/response headers, the size of the request body, and any server-side processing that is done for 
each request to name a few.

The following formula was used to find the appropriate worker connections:
mem_per_conn = req_header_size + res_header_size + req_body_size + buffer_size where buffer_size refers to any memory buffers allocated by Nginx to handle the connection. It became apparent that 16kb needed to be allocated as a conservative estimate based on this formula (1kb + 1kb + 10kb + 4kb
respectively). 
Then the following formula could be used to determine the total memory usage:
total_mem_usuage = 10k * 16kb = 160mb
With that in mind, it became apparent the number of worker connections to handle 160mb over a minute would be between 1k-2k. To be conservative, the 
number was set to 2k. The results of doing so were incredible. 

### After setting worker_rlimit_nofile to 40k and worker_connections to 2k (/dbreviews 7k RPS random over 50k product ids)
![random-increased_workerlimit7kRPS](https://user-images.githubusercontent.com/98621806/219966724-343c7c5b-2b9d-4ba0-8cf2-f80089eac303.jpg)

### Takeaways
With all of the above optimizations in place, the architecture was able to handle 7k RPS with an error rate of 0%, response time average of 15ms, and a 
throughput of 419,937/420k. Had more time been alotted to this project, the next step of horizontal scaling would have been to implement Redis caching
for the Postgres database. This way, the last 10% of the data could be cached with Nginx, and another 10%+ (depending on server capacity) could be cached
with Redis. This way, requests that were not cached with Nginx wouldn't necessarily have to query the single database every time beacuse there would
have been another layer of caching to improve error rates, response times, and throughput.


## ☕ Owner
Sean McDaniel

