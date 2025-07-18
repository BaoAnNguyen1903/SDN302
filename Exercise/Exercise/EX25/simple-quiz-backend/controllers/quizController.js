const Quizz = require('../models/quizzModel');
const Question = require('../models/questionModel');
const mongoose = require('mongoose');

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quizz.find().populate('questions');
        res.json(quizzes);
    } catch (err) {
        console.error('Error in getAllQuizzes:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quizz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (err) {
        console.error('Error in getQuizById:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get quiz with populated questions
exports.getQuizWithCapitalQuestions = async (req, res) => {
    try {
        const quiz = await Quizz.findById(req.params.id).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (err) {
        console.error('Error in getQuizWithCapitalQuestions:', err);
        res.status(500).json({ error: err.message });
    }
};

// Create new quiz
exports.createQuiz = async (req, res) => {
    try {
        const quiz = new Quizz(req.body);
        await quiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        console.error('Error in createQuiz:', err);
        res.status(400).json({ error: err.message });
    }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quizz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (err) {
        console.error('Error in updateQuiz:', err);
        res.status(400).json({ 
            error: err.message 
        });
    }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quizz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json({ message: 'Quiz deleted successfully' });
    } catch (err) {
        console.error('Error in deleteQuiz:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get available questions for a quiz
exports.getAvailableQuestions = async (req, res) => {
    try {
        console.log('Getting available questions for quiz:', req.params.quizId);
        
        // Get all questions from database
        const allQuestions = await Question.find({});
        console.log('Total questions in database:', allQuestions.length);

        // Get current quiz
        const quiz = await Quizz.findById(req.params.quizId);
        if (!quiz) {
            console.log('Quiz not found');
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Filter out questions that are already in the quiz
        const availableQuestions = allQuestions.filter(question => 
            !quiz.questions.includes(question._id)
        );

        console.log('Available questions:', availableQuestions.length);
        res.json(availableQuestions);
    } catch (err) {
        console.error('Error in getAvailableQuestions:', err);
        res.status(500).json({ 
            message: 'Error fetching available questions',
            error: err.message 
        });
    }
};

// Add question to quiz
exports.addExistingQuestionToQuiz = async (req, res) => {
    try {
        const { quizId, questionId } = req.params;
        console.log('Adding question', questionId, 'to quiz', quizId);
        
        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(quizId) || !mongoose.Types.ObjectId.isValid(questionId)) {
            return res.status(400).json({ message: 'Invalid quiz ID or question ID' });
        }

        // Find quiz and question
        const [quiz, question] = await Promise.all([
            Quizz.findById(quizId),
            Question.findById(questionId)
        ]);

        if (!quiz) {
            console.log('Quiz not found');
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (!question) {
            console.log('Question not found');
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if question already exists in quiz
        if (quiz.questions.includes(questionId)) {
            console.log('Question already exists in quiz');
            return res.status(400).json({ message: 'Question already exists in this quiz' });
        }

        // Add question to quiz
        quiz.questions.push(questionId);
        await quiz.save();
        console.log('Question added to quiz successfully');

        // Get updated quiz with populated questions
        const updatedQuiz = await Quizz.findById(quizId).populate('questions');
        console.log('Updated quiz:', updatedQuiz);
        
        res.json(updatedQuiz);
    } catch (err) {
        console.error('Error in addExistingQuestionToQuiz:', err);
        res.status(500).json({ 
            message: 'Error adding question to quiz',
            error: err.message 
        });
    }
};

// Remove question from quiz
exports.removeQuestionFromQuiz = async (req, res) => {
    try {
        const { quizId, questionId } = req.params;
        
        const quiz = await Quizz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Remove question from quiz
        quiz.questions = quiz.questions.filter(q => q.toString() !== questionId);
        await quiz.save();

        // Get updated quiz with populated questions
        const updatedQuiz = await Quizz.findById(quizId).populate('questions');
        res.json(updatedQuiz);
    } catch (err) {
        console.error('Error in removeQuestionFromQuiz:', err);
        res.status(500).json({ message: err.message });
    }
};

// Add new question to quiz
exports.addNewQuestionToQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ message: 'Invalid quiz ID' });
        }
        const quiz = await Quizz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let questionData = { ...req.body };
        
        // Handle options if they're sent as a comma-separated string
        if (typeof questionData.options === 'string') {
            questionData.options = questionData.options.split(',').map(opt => opt.trim());
        }
        
        // Handle keywords if they're sent as a comma-separated string
        if (questionData.keywords && typeof questionData.keywords === 'string') {
            questionData.keywords = questionData.keywords.split(',').map(k => k.trim());
        }

        // Validate required fields
        if (!questionData.text || !Array.isArray(questionData.options) || typeof questionData.correctAnswerIndex !== 'number') {
            console.error('Invalid question data:', questionData);
            return res.status(400).json({ message: 'Invalid question data' });
        }

        const question = new Question(questionData);
        await question.save();
        quiz.questions.push(question._id);
        await quiz.save();
        
        const updatedQuiz = await Quizz.findById(quizId).populate('questions');
        res.json(updatedQuiz);
    } catch (err) {
        console.error('Error in addNewQuestionToQuiz:', err, req.body);
        res.status(500).json({
            message: 'Error adding new question to quiz',
            error: err.message
        });
    }
};

// UI Controller Functions
exports.getNewQuizForm = async (req, res) => {
    try {
        res.render('quizzes/new');
    } catch (err) {
        console.error('Error in getNewQuizForm:', err);
        res.status(500).render('error', { error: err.message });
    }
};

exports.getEditQuizForm = async (req, res) => {
    try {
        const quiz = await Quizz.findById(req.params.id).populate('questions');
        if (!quiz) {
            return res.status(404).render('error', { error: 'Quiz not found' });
        }
        res.render('quizzes/edit', { quiz });
    } catch (err) {
        console.error('Error in getEditQuizForm:', err);
        res.status(500).render('error', { error: err.message });
    }
};
