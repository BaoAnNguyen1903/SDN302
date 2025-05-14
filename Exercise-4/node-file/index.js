var http = require("http");
const fs = require('fs');
const {readFile } = require('./file');
const hostname = "localhost";
const port = 8082;
http.createServer(function (request, response) {
  // Send the HTTP header
  console.log(request.headers);
  // Send the response body of file
  const filename = 'index.html';
  readFile(filename)
  .then((data) => {
    response.setHeader('Content-Type', 'text/html');
    response.statusCode = 200;
    //response.end(data);
    fs.createReadStream(filename).pipe(response);
  })
  .catch((err) => {
    console.error('Error reading file:', err);
    response.statusCode = 500;
    response.end('Internal Server Error');
  });
}).listen(port);

// Console will print the message
console.log(`Server running at http://${hostname}:${port}/`);
