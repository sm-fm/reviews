const http = require('k6/http');
const { sleep, check } = require('k6');

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  vus: 1000,
  duration: '1m'
};

export default () => {
  http.get('http://localhost:8080/dbmeta?product_id=2000003');
  sleep(1);
}