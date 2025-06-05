const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Cấu hình Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Route cơ bản
app.get('/', (req, res) => {
  res.render('home', { title: 'Welcome', message: 'Hello, World!' });
});

const hbs = exphbs.create({
//   helpers: { formatDate: ... },
  partialsDir: './views/partials'
});
app.engine('handlebars', hbs.engine);

// Khởi chạy server
app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
