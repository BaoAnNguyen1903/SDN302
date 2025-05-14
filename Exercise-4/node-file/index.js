const http = require('http');
const fs = require('fs');

const PORT = 3000;
const FILE_PATH = './data.json';

const server = http.createServer((req, res) => {
    if (req.url === '/users' && req.method === 'GET') {
        // Đọc dữ liệu từ file JSON
        fs.readFile(FILE_PATH, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Lỗi đọc file' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }

    else if (req.url === '/users' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Convert buffer to string
        });

        req.on('end', () => {
            const newUser = JSON.parse(body);

            fs.readFile(FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Lỗi đọc file' }));
                    return;
                }

                const users = JSON.parse(data);
                users.push(newUser);

                fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Lỗi ghi file' }));
                        return;
                    }

                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newUser));
                });
            });
        });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Không tìm thấy' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
