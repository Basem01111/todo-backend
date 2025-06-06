const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('Tasks', tasksSchema); // 'tasks' is the collection name