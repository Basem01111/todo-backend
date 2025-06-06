// Imports
var express = require("express");
var router = express.Router();
const {
  getusers,
  addusers,
  updateusers,
  deleteusers,
} = require("./users.controller");
const {
  createUsersValidate,
  updateUsersValidate
} = require("../../shared/validates/users.validate.js");
const validate = require("../../shared/middlewares/validate.js");
const auth = require("../../shared/middlewares/auth.js");

router
  .use(auth)
  .get('/', getusers)
  .post('/add', validate(createUsersValidate), addusers)
  .put('/update/:id', validate(updateUsersValidate), updateusers)
  .delete('/delete/:id', deleteusers);

// Export the router
module.exports = router;
