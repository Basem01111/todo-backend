// Imports
require("dotenv").config();

var express = require("express");
var router = express.Router();
const {
  getusers,
  addUser,
  updateUsers,
  deleteUsers,
} = require("./users.controller.js");
const {
  createUsersValidate,
  updateUsersValidate
} = require("../../../shared/validates/users.validate.js");
const validateMiddleware = require("../../../shared/middlewares/validate.middleware.js");
const createUploader = require("../../../shared/middlewares/upload.middleware.js");

// Upload Avatar
const uploadAvatar = createUploader({
  folder: 'users',
  maxCount: 1,
  maxSize: process.env.MAX_IMAGE_SIZE,
  fieldName: 'avatar',
});

router
  .get('/', getusers)
  .post('/add', uploadAvatar, validateMiddleware(createUsersValidate), addUser)
  .put('/update/:id', uploadAvatar, validateMiddleware(updateUsersValidate), updateUsers)
  .delete('/delete/:id', deleteUsers);

// Export the router
module.exports = router;
