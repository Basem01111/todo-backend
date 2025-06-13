const mongoose = require("mongoose");
require("dotenv").config();

const tasksSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  files: {
    type: [String],
    validate: {
      validator: function (value) {
        return value.length <= process.env.MAX_FILE_COUNT;
      },
      message: `Max Files ${process.env.MAX_FILE_COUNT}`,
    },
  },
});

module.exports = mongoose.model("Tasks", tasksSchema); // 'tasks' is the collection name
