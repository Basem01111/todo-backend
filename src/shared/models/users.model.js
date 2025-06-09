const mongoose = require('mongoose');
const { getPathFile } = require('../../utils/files');

const usersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    avatar: {
        type: String,
        default: getPathFile('avatar.webp','users'),
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles', 
        required: true,
    },
},
{timestamps: true} // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Users', usersSchema); // 'tasks' is the collection name