POST /auth/register
{ "email": "user@gmail.com", "password": "1234567", "role":"customer" }
{ "email": "admin@gmail.com", "password": "1234567", "role":"admin" }

POST /orders
{"items":[{"foodId":"6883c64d0adcbd0e1d461680", "quantity":3},{"foodId":"6883c65c0adcbd0e1d461682", "quantity":3}], "deliveryAddress":"Hue"}
