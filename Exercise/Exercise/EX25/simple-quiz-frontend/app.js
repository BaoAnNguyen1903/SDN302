const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const axios = require('axios');
const https = require('https');
const methodOverride = require('method-override');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// View engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

// Create HTTPS agent that ignores SSL certificate errors
const agent = new https.Agent({
    rejectUnauthorized: false
});

// API base URL
const API_BASE_URL = 'https://localhost:3443';

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

// Quiz routes
app.get('/quizzes', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/quizzes`, { httpsAgent: agent });
        res.render('quizzes/index', { quizzes: response.data });
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).render('error', { 
            error: {
                message: error.response?.data?.message || 'Failed to fetch quizzes'
            }
        });
    }
});

app.get('/quizzes/new', (req, res) => {
    res.render('quizzes/new');
});

app.post('/quizzes', async (req, res) => {
    try {
        await axios.post(`${API_BASE_URL}/quizzes`, req.body, { httpsAgent: agent });
        res.redirect('/quizzes');
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.render('quizzes/new', { 
            error: {
                message: error.response?.data?.message || 'Failed to create quiz'
            },
            quiz: req.body 
        });
    }
});

// Helper function to get quiz data
async function getQuiz(id) {
    try {
        // Gọi endpoint có populate questions
        const response = await axios.get(`${API_BASE_URL}/quizzes/${id}/populate`, { httpsAgent: agent });
        const quiz = response.data;
        
        // Format questions data để view luôn có trường đúng
        if (quiz.questions) {
            quiz.questions = quiz.questions.map(q => ({
                _id: q._id,
                text: q.text || q.questionText,
                options: q.options || [],
                correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : (q.correctOption || 0)
            }));
        }
        
        return quiz;
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
}

// Get quiz details
app.get('/quizzes/:id', async (req, res) => {
    try {
        const quiz = await getQuiz(req.params.id);
        res.render('quizzes/show', { quiz, error: null });
    } catch (error) {
        console.error('Error in quiz details route:', error);
        res.status(500).render('error', { 
            error: {
                message: error.response?.data?.message || 'Failed to fetch quiz details'
            }
        });
    }
});

// Get edit quiz form
app.get('/quizzes/:id/edit', async (req, res) => {
    try {
        const quiz = await getQuiz(req.params.id);
        res.render('quizzes/edit', { quiz, error: null });
    } catch (error) {
        console.error('Error in edit quiz route:', error);
        res.status(500).render('error', { 
            error: {
                message: error.response?.data?.message || 'Failed to fetch quiz details'
            }
        });
    }
});

// Update quiz
app.put('/quizzes/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        
        // Validate data
        if (!title || !description) {
            const quiz = await getQuiz(req.params.id);
            return res.status(400).render('quizzes/edit', { 
                quiz,
                error: { message: 'Title and description are required' }
            });
        }

        await axios.put(`${API_BASE_URL}/quizzes/${req.params.id}`, { title, description }, { httpsAgent: agent });
        res.redirect('/quizzes');
    } catch (error) {
        console.error('Error updating quiz:', error);
        try {
            const quiz = await getQuiz(req.params.id);
            res.status(500).render('quizzes/edit', { 
                quiz,
                error: { 
                    message: error.response?.data?.message || 'Failed to update quiz'
                }
            });
        } catch (fetchError) {
            res.status(500).render('error', { 
                error: {
                    message: 'Failed to fetch quiz details'
                }
            });
        }
    }
});

app.delete('/quizzes/:id', async (req, res) => {
    try {
        await axios.delete(`${API_BASE_URL}/quizzes/${req.params.id}`, { httpsAgent: agent });
        res.redirect('/quizzes');
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).render('error', { 
            error: {
                message: error.response?.data?.message || 'Failed to delete quiz'
            }
        });
    }
});

// Add question to quiz
app.post('/quizzes/:id/questions', async (req, res) => {
    try {
        const quizId = req.params.id;
        const { questionText, options, correctOption } = req.body;
        
        // Validate data
        if (!questionText || !options || !Array.isArray(options) || options.length < 2) {
            const quiz = await getQuiz(quizId);
            return res.status(400).render('quizzes/show', { 
                quiz,
                error: { message: 'Question must have at least 2 options' }
            });
        }

        // Gửi đúng trường cho backend
        const questionData = {
            text: questionText,
            options: options,
            correctAnswerIndex: parseInt(correctOption)
        };

        await axios.post(`${API_BASE_URL}/quizzes/${quizId}/questions`, questionData, { httpsAgent: agent });
        res.redirect(`/quizzes/${quizId}`);
    } catch (error) {
        console.error('Error adding question:', error);
        try {
            const quiz = await getQuiz(req.params.id);
            res.status(500).render('quizzes/show', { 
                quiz,
                error: { 
                    message: error.response?.data?.message || 'Failed to add question'
                }
            });
        } catch (fetchError) {
            res.status(500).render('error', { 
                error: {
                    message: 'Failed to fetch quiz details'
                }
            });
        }
    }
});

// Delete question from quiz
app.delete('/quizzes/:quizId/questions/:questionId', async (req, res) => {
    try {
        await axios.delete(`${API_BASE_URL}/quizzes/${req.params.quizId}/questions/${req.params.questionId}`, { httpsAgent: agent });
        res.redirect(`/quizzes/${req.params.quizId}`);
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).render('error', { 
            error: {
                message: error.response?.data?.message || 'Failed to delete question'
            }
        });
    }
});

// Question routes
app.get('/questions', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/questions`, { httpsAgent: agent });
        res.render('questions/index', { questions: response.data });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.render('questions/index', { questions: [] });
    }
});

app.get('/questions/new', (req, res) => {
    res.render('questions/new');
});

app.post('/questions', async (req, res) => {
    try {
        const { questionText, options, correctOption } = req.body;
        // Validate
        if (!questionText || !options || !Array.isArray(options) || options.length < 2) {
            return res.render('questions/new', {
                error: 'Question must have at least 2 options',
                question: req.body
            });
        }
        // Map đúng trường cho backend
        const questionData = {
            text: questionText,
            options: options,
            correctAnswerIndex: parseInt(correctOption)
        };
        await axios.post(`${API_BASE_URL}/questions`, questionData, { httpsAgent: agent });
        res.redirect('/questions');
    } catch (error) {
        console.error('Error creating question:', error);
        res.render('questions/new', {
            error: error.response?.data?.message || 'Failed to create question',
            question: req.body
        });
    }
});

// Helper function to get question data
async function getQuestion(id) {
    try {
        const response = await axios.get(`${API_BASE_URL}/questions/${id}`, { httpsAgent: agent });
        const question = response.data;
        return {
            _id: question._id,
            text: question.text || question.questionText,
            options: question.options || [],
            correctOption: question.correctOption || 0
        };
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
}

app.get('/questions/:id', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/questions/${req.params.id}`, { httpsAgent: agent });
        res.render('questions/show', { question: response.data });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(404).render('error', { 
            error: {
                message: error.response?.data?.message || 'Question not found'
            }
        });
    }
});

// Get edit question form
app.get('/questions/:id/edit', async (req, res) => {
    try {
        const question = await getQuestion(req.params.id);
        res.render('questions/edit', { question, error: null });
    } catch (error) {
        console.error('Error in edit question route:', error);
        res.status(500).render('error', { 
            error: {
                message: error.response?.data?.message || 'Failed to fetch question details'
            }
        });
    }
});

// Update question
app.put('/questions/:id', async (req, res) => {
    try {
        const { questionText, options, correctOption } = req.body;
        
        // Validate data
        if (!questionText || !options || !Array.isArray(options) || options.length < 2) {
            const question = await getQuestion(req.params.id);
            return res.status(400).render('questions/edit', { 
                question,
                error: { message: 'Question must have at least 2 options' }
            });
        }

        // Map đúng trường cho backend
        const questionData = {
            text: questionText,
            options: options,
            correctAnswerIndex: parseInt(correctOption)
        };

        await axios.put(`${API_BASE_URL}/questions/${req.params.id}`, questionData, { httpsAgent: agent });
        res.redirect('/questions');
    } catch (error) {
        console.error('Error updating question:', error);
        try {
            const question = await getQuestion(req.params.id);
            res.status(500).render('questions/edit', { 
                question,
                error: { 
                    message: error.response?.data?.message || 'Failed to update question'
                }
            });
        } catch (fetchError) {
            res.status(500).render('error', { 
                error: {
                    message: 'Failed to fetch question details'
                }
            });
        }
    }
});

app.delete('/questions/:id', async (req, res) => {
    try {
        await axios.delete(`${API_BASE_URL}/questions/${req.params.id}`, { httpsAgent: agent });
        res.redirect('/questions');
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).render('error', { 
            error: {
                message: error.response?.data?.message || 'Failed to delete question'
            }
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).render('error', { 
        error: {
            message: err.message || 'An unexpected error occurred'
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Frontend server is running on port ${PORT}`);
}); 