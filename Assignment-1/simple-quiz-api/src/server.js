require('dotenv').config();
const express = require('express');
const connection = require('./config/database');
const app = express(); // app express
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;
const apiRoutes = require('./route/api');
const authMiddleware = require('./middleware/authMiddleware');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./route/web');

// config req.body
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data

//route
app.use('/', webRoutes);
app.use('/v1/api/', apiRoutes);
configViewEngine(app);

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

// Đăng ký người dùng
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
});

// Đăng nhập và tạo token
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Route được bảo vệ
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Access granted', userId: req.user.id });
});

