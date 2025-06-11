require('dotenv').config();
const express = require('express');
const connection = require('./config/database');
const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;
const apiRoutes = require('./route/api');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./route/web');
  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);
app.use(express.static('public'));

app.use('/', webRoutes);
app.use('/v1/api', apiRoutes);

(async () => {
  try {
    await connection();
    app.listen(port, hostname, () => {
      console.log(`Server listening on http://${hostname}:${port}`);
    });
  } catch (error) {
    console.log("DB connection error: ", error);
  }
})();
