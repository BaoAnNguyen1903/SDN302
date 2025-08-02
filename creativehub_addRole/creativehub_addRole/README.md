# MediCare Medical Appointment Booking System

## Features

- User registration, login (JWT authentication)
- View all doctors
- Book appointments
- View and search appointments
- Admin: Manage users, doctors, appointments

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
   npm run dev
   ```
   or
   ```
   npm start
   ```

## API Endpoints

### Auth

- `POST /auth/register` — Register new user
  - Body: `{ "username": "user", "password": "pass" }`
- `POST /auth/login` — Login, returns JWT
  - Body: `{ "username": "user", "password": "pass" }`

### Users (JWT required)

- `GET /users` — List all users
- `DELETE /users/:userId` — Delete user (if no appointments)

### Doctors (JWT required)

- `GET /doctors` — List all doctors
- `POST /doctors` — Add new doctor (body: `{ "name": "...", "specialization": "...", "availableTimeSlots": ["09:00", "10:00"] }`)
- `DELETE /doctors/:doctorId` — Delete doctor

### Appointments (JWT required)

- `POST /appointments` — Book appointment
  - Body: `{ "doctorId": "...", "timeSlot": "..." }`
  - If the requested time slot is not available, the response will be:
    ```json
    { "message": "Time slot not available" }
    ```
- `GET /appointments` — List all appointments
- `GET /appointments/byDate?start=YYYY-MM-DD&end=YYYY-MM-DD` — Search by date

## Testing with Postman

1. **Login** to get JWT token
2. **Set Authorization header:**
   - `Authorization: Bearer <token>`
3. **Call protected endpoints**

---

**Good luck!**
