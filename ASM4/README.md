# MediCare - Medical Appointment Booking System

## Mô tả
Hệ thống đặt lịch khám bệnh trực tuyến cho phép bệnh nhân đăng ký, đăng nhập, xem danh sách bác sĩ và đặt lịch hẹn. Quản trị viên có thể quản lý người dùng và theo dõi lịch hẹn.

## Cài đặt
1. Clone project hoặc copy mã nguồn vào máy.
2. Cài đặt Node.js và MongoDB.
3. Cài đặt package:
   ```bash
   npm install
   ```
4. Tạo file `.env` với nội dung mẫu:
   ```env
   MONGO_URI=mongodb://localhost:27017/medicare_medibook
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
5. Khởi động MongoDB (nếu dùng local):
   ```bash
   mongod
   ```
6. Chạy project:
   ```bash
   npm run dev
   ```
   hoặc
   ```bash
   npm start
   ```

## Cấu trúc thư mục
- `/models`: Định nghĩa các schema/model
- `/controllers`: Xử lý logic cho các API
- `/routes`: Định nghĩa các endpoint
- `app.js`: Khởi tạo app và kết nối các route

## Hướng dẫn test API (Postman)
1. **Đăng nhập**
   - `POST /auth/login`
   - Body: `{ "username": "<tên>", "password": "<mật khẩu>" }`
   - Nhận về JWT token, dùng cho các API bảo mật
2. **Quản lý người dùng**
   - `GET /users` (cần Bearer Token)
   - `DELETE /users/:userId` (cần Bearer Token)
3. **Quản lý bác sĩ**
   - `POST /doctors` (cần Bearer Token)
   - `GET /doctors` (cần Bearer Token)
4. **Đặt lịch khám**
   - `POST /appointments` (cần Bearer Token)
     - Body: `{ "doctorId": "...", "timeSlot": "..." }`
   - `GET /appointments` (cần Bearer Token)
   - `GET /appointments/byDate?start=YYYY-MM-DD&end=YYYY-MM-DD` (cần Bearer Token)

**Lưu ý:**
- Tất cả các API (trừ /auth/login) đều cần gửi header: `Authorization: Bearer <token>`
- Có thể dùng Postman để test các API trên. 