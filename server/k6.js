const http = require('k6/http');
const { sleep, check } = require('k6');

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  vus: 10000,
  duration: '1m'
};

export default () => {
  http.get('http://localhost:8080/dbmeta?product_id=1000000');
  sleep(1);
}