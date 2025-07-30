const Task = require("../models/taskModel");

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ message: "Missing taskId" });
    }

    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing userId" });
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!deletedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or user not authorized" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error("Get all tasks error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllTasksByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }
    const tasks = await Task.find({ user: userId });
    res.json(tasks);
  } catch (err) {
    console.error("Get all tasks error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update provided" });
    }

    const { taskId } = req.params;
    const userId = req.user.userId;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or user not authorized" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// exports.updateTask = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const userId = req.user.userId;
//     const { title, description, priority, status } = req.body;

//     const task = await Task.findOne({ _id: taskId, user: userId });

//     if (!task) {
//       return res
//         .status(404)
//         .json({ message: "Task not found or user not authorized" });
//     }

//     if (req.body.hasOwnProperty("title")) {
//       task.title = title;
//     }
//     if (req.body.hasOwnProperty("description")) {
//       task.description = description;
//     }
//     if (req.body.hasOwnProperty("priority")) {
//       task.priority = priority;
//     }
//     if (req.body.hasOwnProperty("status")) {
//       task.status = status;
//     }

//     const savedTask = await task.save();

//     res.json(savedTask);
//   } catch (err) {
//     console.error("Update task error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

exports.addTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const userId = req.user.userId;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Missing required fields: title and description" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      user: userId,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Add task error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
