const fs = require('fs');

// Đọc nội dung từ file data.json
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Lỗi khi đọc file:', err);
        return;
    }
    console.log('Dữ liệu hiện tại:', data);
});
