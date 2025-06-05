const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

const articles = [
  { id: 1, title: 'Tech Advances', author: 'Alice', date: '2025-06-01' },
  { id: 2, title: 'Economy Trends', author: 'Bob', date: '2025-06-02' },
];

// Helper định dạng ngày
app.engine('handlebars', exphbs.engine({
  helpers: {
    formatDate: function (date) {
      return new Date(date).toLocaleDateString('en-GB');
    }
  }
}));

// Route homepage hiển thị bài viết
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Homepage',
    articles
  });
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});

