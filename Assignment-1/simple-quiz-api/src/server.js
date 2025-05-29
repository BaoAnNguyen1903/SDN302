require('dotenv').config();
const express = require('express');
const connection = require('./config/database');
const app = express(); // app express
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;
const apiRoutes = require('./route/api');   

// config req.body
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data

//route
app.use('/v1/api/', apiRoutes);

(async() => {
  try {
    await connection();
    app.listen(port, hostname, () => {
    console.log(`backend app listening on port ${port}`)
  });
  } catch (error) {
    console.log(">>> Err connect to db: ", error);
  }
})()

