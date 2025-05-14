const http = require('http');
const fs = require('fs');
const PORT = 3000;
const DATA_FILE = 'data.json';

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users') {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to read data' }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else if (req.method === 'POST' && req.url === '/users') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const newUser = JSON.parse(body);
      fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Failed to read data' }));
        }

        const users = JSON.parse(data);
        users.push(newUser);
        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Failed to save data' }));
          }
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User added successfully' }));
        });
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
