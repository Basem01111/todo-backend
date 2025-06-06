const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    // slug: {
    //     type: String,
    //     lowercase: true
    // },
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
    // profileImage: String,
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    // role: {
    //     type: String,
    //     enum: ['user', 'admin'],
    //     default: 'user'
    // },
},
{timestamps: true} // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Users', usersSchema); // 'tasks' is the collection name