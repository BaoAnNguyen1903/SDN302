const Question = require('../model/question');

exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllQuestion = async (req, res) => {
  const q = await Question.find({});
  res.json(q);
};

// GET /question/:id
exports.getQuestion = async (req, res) => {
  const q = await Question.findById(req.params.id);
  res.json(q);
};

// PUT /question/:id
exports.updateQuestion = async (req, res) => {
  const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// DELETE /question/:id
exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Don't match ID" });
    }

    res.status(200).json({ message: "Delete Sucessfully!" });
  } catch (error) {
    res.status(500).json({ message: "Sever Error", error: error.message });
  }
};
