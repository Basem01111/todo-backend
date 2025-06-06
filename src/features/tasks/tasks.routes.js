var express = require("express");
var router = express.Router();
const validate = require("../../shared/middlewares/validate.js");

const {
  getTasks,
  addTasks,
  updateTasks,
  deleteTasks,
} = require("./tasks.controller");
const {
  createTasksValidate,
  updateTasksValidate,
} = require("./tasks.validate.js");

router
  .get("/", getTasks)
  .post("/add", validate(createTasksValidate), addTasks)
  .put("/update/:id", validate(updateTasksValidate), updateTasks)
  .delete("/delete/:id", deleteTasks);

// Export the router
module.exports = router;
