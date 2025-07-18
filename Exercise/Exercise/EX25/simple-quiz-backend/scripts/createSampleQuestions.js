const mongoose = require('mongoose');
const Question = require('../models/questionModel');

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/quiz_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sampleQuestions = [
    {
        text: "What is the capital of France?",
        options: [
            { text: "London", isCorrect: false },
            { text: "Paris", isCorrect: true },
            { text: "Berlin", isCorrect: false },
            { text: "Madrid", isCorrect: false }
        ],
        type: "multiple-choice",
        difficulty: "easy",
        points: 1
    },
    {
        text: "Which planet is known as the Red Planet?",
        options: [
            { text: "Venus", isCorrect: false },
            { text: "Mars", isCorrect: true },
            { text: "Jupiter", isCorrect: false },
            { text: "Saturn", isCorrect: false }
        ],
        type: "multiple-choice",
        difficulty: "easy",
        points: 1
    },
    {
        text: "What is the largest mammal in the world?",
        options: [
            { text: "African Elephant", isCorrect: false },
            { text: "Blue Whale", isCorrect: true },
            { text: "Giraffe", isCorrect: false },
            { text: "Hippopotamus", isCorrect: false }
        ],
        type: "multiple-choice",
        difficulty: "medium",
        points: 2
    }
];

async function createSampleQuestions() {
    try {
        // Xóa tất cả câu hỏi cũ
        await Question.deleteMany({});
        console.log('Deleted all existing questions');

        // Thêm câu hỏi mới
        const questions = await Question.insertMany(sampleQuestions);
        console.log('Added sample questions:', questions);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

createSampleQuestions(); 