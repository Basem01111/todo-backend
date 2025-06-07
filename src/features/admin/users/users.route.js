// Imports
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

router
  .get('/', getusers)
  .post('/add', validateMiddleware(createUsersValidate), addusers)
  .put('/update/:id', validateMiddleware(updateUsersValidate), updateusers)
  .delete('/delete/:id', deleteusers);

// Export the router
module.exports = router;
