// Imports
var express = require("express");
var router = express.Router();
const { register, login, logout, refreshToken} = require("./auth.controller.js");
const {
  createUsersValidate,
  loginValidate,
} = require("../../shared/validates/users.validate.js");
const validate = require("../../shared/middlewares/validate.js");

router
  .post("/register", validate(createUsersValidate), register)
  .post("/login", validate(loginValidate), login)
  .post("/logout", logout)
  .get("/refresh_token", refreshToken);

// Export the router
module.exports = router;
