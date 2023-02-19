# Reviews Microservice

## 💡 Overview
I inherited this legacy code base with the following instructions: "The current backend system for this E-commerce site cannot withstand the increased traffic it is receiving, replace the API and database for the reviews service. Your other teammates will replace the other services." This was a monorepo, and we were tasked with also restructuring it to a microservices architecture. Below I will document my process as well as how I optimized it in production.

The following repo is my service alone. I used k6 for stress testing locally and loaderio + New Relic for stress testing in production. I used NGINX for load-balancing and caching, however, you won't find the NGINX conf file in this repo because it was created and changed directly in my AWS instance. My final architecture looks like the following: 

![Reviews Service System Design - Flowchart](https://user-images.githubusercontent.com/98621806/219970292-14376e0e-c883-45c1-ad7f-3796139c4626.jpeg)

## 🎉 Highlights

- Optimized SQL query execution times from 5,717ms to 0.06ms through json aggregation and table indexing 
- Achieved the following metric improvements by horizontally scaling through fine-tuning NGINX's load balancing and caching:
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
By adding three API servers, I was able to take my error rate of about 66%, response time avg of 5389ms, and throughput of
20k/60k to around 62%, 4389ms, and 22667/60k respectively. The big difference here is the response time average, however,
it still was taking over 4 seconds to get a response on average, and the throughput/error rate were still really bad. I ended
up adding a fourth API server, and it helped a little, but still not much. Through New Relic, I could tell I was taking up 
a lot of my Postgres server's CPU usage, indicating that was a bottleneck area. I decided to implement caching, with the
results below.

### Before caching (/dbreviews 1000 RPS)
![dbreviews-before-cache-4servers-1000RPS](https://user-images.githubusercontent.com/98621806/219964475-f5108474-cf8b-48bf-ba1c-6b929c9434fe.jpg)

### After caching (/dbreviews 1000 RPS)
![dbreviews-after-cache-1000](https://user-images.githubusercontent.com/98621806/219964543-a03b6cc0-8e50-4f9f-bb53-9d5f6a687f36.jpg)

### After caching (/dbreviews 10k RPS incrementing over a range of 100k product id's)
![increment-10kRPS-cache](https://user-images.githubusercontent.com/98621806/219964592-2c8772cf-a13d-4b0c-9790-1707721e845f.jpg)

### Takeaways
My hypothesis was correct that my database server was the major bottleneck. Through implementing caching, I brough my error
rate of 44%, response time avg of 1327ms, and throughput of 33966/60k to 0%, 12ms, and 59999/60k respectively. I was even 
able to go up to 10k RPS with similar metrics. However, it is important to note that the test was incrementing through a 
list of product id's by 1 over a 100k range. When I changed this to choose a random product id over the same 100k range,
the results were much worse than with incrementing. 

### After caching (/dbreviews 1k RPS random product id 100k range load-balanced with 4 servers)
![dbreviews-random_id-cache+load1000RPS](https://user-images.githubusercontent.com/98621806/219965088-a02d3892-08eb-41cf-86c0-90ed15fb8e81.jpg)

### Takeaways
Here we can see the error rate, response time avg, and throughput are much worse than incrementing even at 1K RPS. My NGINX
server CPU usuage was going as high as 99%, indicating that my NGINX server was my bottleneck. After doing some research,
I realized the cache size for NGINX is automatically set to 512mg if not specified, and my responses in sum were definitely
above that limit. Therefore, I changed my cache size to 3gb. The results are below.

### After increasing cache to 3gb (/dbreviews 2500 RPS random product id 100k range load-balanced with 4 servers)
![random-increased_cache2500RPS](https://user-images.githubusercontent.com/98621806/219965575-042b80ca-d5bc-4cf9-9e2e-8e41d1516a67.jpg)


### Takeaways
By increasing the cache size, I was able to significantly improve my metrics. My error rate went down to 1%, average 
response time went to 64ms, and throughput was 147933/150k. However, this seemed to be my limit with good metrics. If I went
to 3k RPS, my metrics went back to what it looked like before I increased my cache.

After doing more research, I realized my worker_rlimit_nofile and worker_connections weren't fine tuned for my server.
worker_rlimit_nofile sets how many files can be open simultaenously with NGINX. After checking my error logs, I was seeing
the error "too many files open", indicating that my number for the limit was too low. I needed to raise this, but I knew
if I raised it too high, it would take up all of my memory and actually decrease performance. So I needed to find the sweet
spot for my server specs. I ended up moving it up to 40k, which resulted in 0% error rate, 12ms avg response time, and
299,957/300k throughput for 5k requests randomized across 50k product ids. 

I also set my worker connections to 40k to get the above improvements. Worker connections is the max number of connections
an NGINX worker process can handle at the same time. Setting this too high can overwhelm the worker processes if the server
specs can't handle that many processes happening concurrently. Looking at New Relic, I could see my CPU and memory usage
with reaching up to 88%, so I hypothesized that I set this too high. 

Through some reseach, I realized I could actually use a formula to find an approximate number I should set my worker 
connections at. If I wanted to handle 10k RPS, I needed to calculate the expected memory usuage for each connection and 
ensure that my total memory usage of all my connections did not exceed my 1gb of RAM. I found out my memory usage of each 
connection depended on serveral factors, a few being the size of the request/response headers, the size of the request
body, and any server-side processing that is done for each request. 

I found a guideline formula to use:
mem_per_conn = req_header_size + res_header_size + req_body_size + buffer_size
where buffer_size refers to any memory buffers allocated by NGINX to handle the connection. Through this I was able to 
calculate I needed about 16kb allocated as a conservative estimate. I could then run the formula:
total_mem_usuage = 10k * 16kb = 160mb
With that in mind, I looked up how many worker connections I should set if I needed 160mg over a minute, which was between
1k-2k. I set it to 2k and the results of doing so were incredible. 

### After setting worker_rlimit_nofile to 40k and worker_connections to 2k (/dbreviews 7k RPS random over 50k product ids)
![random-increased_workerlimit7kRPS](https://user-images.githubusercontent.com/98621806/219966724-343c7c5b-2b9d-4ba0-8cf2-f80089eac303.jpg)

### Takeaways
As you can see I was able to get up to 7k RPS with an error rate of 0%, response time average of 15ms, and a throughput of
419937/420k.


## ☕ Owner
Sean McDaniel

