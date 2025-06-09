// Imports
require("dotenv").config();

var express = require("express");
var router = express.Router();
const {
  getusers,
  addusers,
  updateusers,
  deleteusers,
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
  types: process.env.ACCEPTED_IMAGE_TYPES.slice(','),
  maxSize: process.env.MAX_IMAGE_SIZE,
  fieldName: 'avatar',
});

router
  .get('/', getusers)
  .post('/add', uploadAvatar, validateMiddleware(createUsersValidate), addusers)
  .put('/update/:id', uploadAvatar, validateMiddleware(updateUsersValidate), updateusers)
  .delete('/delete/:id', deleteusers);

// Export the router
module.exports = router;
