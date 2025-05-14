var http = require("http");
const path = require('path');
const {readFile } = require('./file');
const hostname = "localhost";
const port = 8082;
http.createServer(function (request, response) {
  // Send the HTTP header
  console.log(request.headers);
  // Send the response body of file
  if (request.method == 'GET') {
    var fileUrl;
    if (request.url == '/') fileUrl = '/index.html';
    else fileUrl = request.url;
    var filePath = path.resolve('./public' + fileUrl);
    const fileExt = path.extname(filePath);
    if (fileExt == '.html') {

      readFile(filePath)
      .then((data) => {
        response.setHeader('Content-Type', 'text/html');
        response.statusCode = 200;
        console.log('file: ' + data);
        response.end(data);
      })
      .catch((err) => {
        console.error('Error reading file:', err);
        response.statusCode = 500;
        response.end('Internal Server Error');
      });
    }
  }
  else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/html');
    response.end('<html><body><h1>Error 404: ' + request.method + ' not supported</h1></body></html>');
  }
}).listen(port);
// Console will print the message
console.log(`Server running at http://${hostname}:${port}/`);
