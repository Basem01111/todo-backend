// Imports
var express = require("express");
var router = express.Router();
const { register, login, logout, refreshToken} = require("./auth.controller.js");
const {
  createUsersValidate,
  loginValidate,
} = require("../../shared/validates/users.validate.js");
const validateMiddleware = require("../../shared/middlewares/validate.middleware.js");

router
  .post("/register", validateMiddleware(createUsersValidate), register)
  .post("/login", validateMiddleware(loginValidate), login)
  .post("/logout", logout)
  .get("/refresh_token", refreshToken);

// Export the router
module.exports = router;
