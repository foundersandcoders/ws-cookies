'use strict';

const http = require('http');

const router = require('./router.js');

const server = http.createServer();

server
.on(
  'listening',
  () =>
    console.log(`Server is listening on port: 4000`)
)
.on('request', router);

server
.listen(4000);
