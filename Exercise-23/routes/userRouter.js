const jwt = require('jsonwebtoken');

userRouter.route('/login').post(async (req, res) => {
  try {
    const { username, password } = req.body;

    // Giả sử đây là một hàm async trả về user từ database
    const user = await userController.findByUsername(username);

    if (user) {
      // Tạo payload chứa thông tin user
      const payload = { sub: user._id };

      // Ký JWT token, hết hạn sau 1 giờ
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({ token });
    } else {
      res.status(401).send('Login unsuccessfully');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post('/signup', async (req, res) => {
  try {
    // 🛡️ Validate the input
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    // 🔍 Check if user already exists
    let user = await userController.findByUsername(username);
    if (user) {
      return res.status(400).send('User already exists');
    }

    // ✅ Create and save the user
    user = await userController.create(username, password);

    // 🔐 Generate a JWT for the new user
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    res.status(201).send(`User created successfully: ${user._id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

