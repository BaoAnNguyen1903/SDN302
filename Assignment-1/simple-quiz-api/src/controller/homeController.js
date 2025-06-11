const Question = require("../model/question");

const getHomepage = async (req, res) => {
    let results = await Question.find({});
    return res.render('layout/home.ejs',{listQustions: results});
}

module.exports = {
    getHomepage,
}