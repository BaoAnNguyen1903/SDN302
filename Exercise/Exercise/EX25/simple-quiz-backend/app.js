const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const app = express();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require('cors');

// SSL/TLS configuration
const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt'))
};

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API Routes
const quizRouter = require('./routes/quizRouter');
const questionRouter = require('./routes/questionRouter');

app.use('/quizzes', quizRouter);
app.use('/questions', questionRouter);

// Start HTTPS server
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(`Backend HTTPS Server running on port ${HTTPS_PORT}`);
});
