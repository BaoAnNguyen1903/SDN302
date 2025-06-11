const Quiz = require("../model/quiz");

const getHomepage = async (req, res) => {
    let results = await Quiz.find({});
    return res.render('layout/home.ejs', {
        listQuiz: results,
    });
};


module.exports = {
    getHomepage
}