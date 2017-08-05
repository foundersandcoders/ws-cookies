'use strict';

const { parse } = require('url');
const { readFile } = require('fs');

const notFoundPage = '<p style="font-size: 10vh; text-align: center;">404!</p>';

module.exports = (req, res) => {
  const parsedUrl = parse(req.url);

  if (req.method === 'GET' && req.url === '/') {
    return readFile(
      './index.html',
      (err, data) => {
        res.writeHead(
          200,
          {
            'Content-Type': 'text/html',
            'Content-Length': data.length
          }
        );
        return res.end(data);
      }
    );
  } else {
    res.writeHead(
      404,
      {
        'Content-Type': 'text/html',
        'Content-Length': notFoundPage.length
      }
    );
    return res.end(notFoundPage);
  }
}
