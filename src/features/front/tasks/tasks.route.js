var express = require("express");
var router = express.Router();
const validateMiddleware = require("../../../shared/middlewares/validate.middleware.js");

const {
  getTasks,
  addTasks,
  updateTasks,
  deleteTasks,
} = require("./tasks.controller.js");
const {
  createTasksValidate,
  updateTasksValidate,
} = require("./tasks.validate.js");

router
  .get("/", getTasks)
  .post("/add", validateMiddleware(createTasksValidate), addTasks)
  .put("/update/:id", validateMiddleware(updateTasksValidate), updateTasks)
  .delete("/delete/:id", deleteTasks);

// Export the router
module.exports = router;
