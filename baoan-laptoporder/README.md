# FPT Tech Shop laptop order

## Features

- User registration, login (JWT authentication)
- Laptop Managerment
- Ordering System
- Order Search
- User Management

## Project Structure (MCR)

```
/models
/controllers
/routes
/app.js
```

## Setup Instructions

1. **Clone or download the project**
2. **Install dependencies:**
   ```
   npm install
   ```
3. **Configure environment variables:**
   - Edit `.env` for `PORT`, `MONGO_URI`, `JWT_SECRET`
4. **Start MongoDB** (local or Atlas)
5. **Run the app:**
   ```
   npm start
   ```

## API Endpoints

### Auth

- `POST http://localhost:3000/auth/register` — Register new user
  - Body: `{ "username": "user", "password": "pass" }`
    {
    "username": "testusername",
    "password": "123456"
    }
- `POST http://localhost:3000/auth/login` — Login, returns JWT
  - Body: `{ "username": "user", "password": "pass" }`
    {
    "username": "testusername",
    "password": "123456"
    }

### Users (JWT required)

- `GET http://localhost:3000/users` — List all users
- `DELETE http://localhost:3000/users/:userId` — Delete user (if no appointments)

### Laptops (JWT required)

- `GET http://localhost:3000/laptops` — List all laptops
- `POST http://localhost:3000/laptops` — Add new laptop
  {
  "name": "assus",
  "brand": "lenovo",
  "price": "100",
  "stockQuantity": "10"
  }
- `DELETE http://localhost:3000/laptops/:laptopId` — Delete laptop

### Orders (JWT required)

- `POST http://localhost:3000/orders` — Order laptop
{
    "laptopId": "688437dce04c8a19bb5ee76a",
    "quantity": 2
}

- `GET http://localhost:3000/orders` — List all appointments
- `GET http://localhost:3000/orders/ordersByDate?start=YYYY-MM-DD&end=YYYY-MM-DD` — Search by date

## Testing with Postman

1. **Login** to get JWT token
2. **Set Authorization header:**
   - `Authorization: Bearer <token>`
3. **Call protected endpoints**

---

**Good luck!**
