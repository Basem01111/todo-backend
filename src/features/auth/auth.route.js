// Imports
require("dotenv").config();
var express = require("express");
var router = express.Router();
const validateMiddleware = require("../../shared/middlewares/validate.middleware.js");
const createUploader = require("../../shared/middlewares/upload.middleware.js");
const { register, login, logout, refreshToken} = require("./auth.controller.js");
const {
  registerValidate,
  loginValidate,
} = require("../../shared/validates/users.validate.js");

// Upload Avatar
const uploadAvatar = createUploader({
    folder: 'users',
  types: process.env.ACCEPTED_IMAGE_TYPES.slice(','),
  maxSize: process.env.MAX_IMAGE_SIZE,
  fieldName: 'avatar',
});

router
  .post("/register", uploadAvatar, validateMiddleware(registerValidate), register)
  .post("/login", validateMiddleware(loginValidate), login)
  .post("/logout", logout)
  .get("/refresh_token", refreshToken);

// Export the router
module.exports = router;
