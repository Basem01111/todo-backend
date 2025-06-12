var express = require("express");
var router = express.Router();
const validateMiddleware = require("../../../shared/middlewares/validate.middleware.js");
const createUploader = require("../../../shared/middlewares/upload.middleware.js");

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

require("dotenv").config();

// Upload Avatar
const uploadAvatar = createUploader({
  folder: "tasks",
  maxSize: process.env.MAX_FILE_SIZE,
  fieldName: "files",
  maxCount: 4,
});

router
  .get("/", getTasks)
  .post("/add", uploadAvatar, validateMiddleware(createTasksValidate), addTasks)
  .put(
    "/update/:id",
    uploadAvatar,
    validateMiddleware(updateTasksValidate),
    updateTasks
  )
  .delete("/delete/:id", deleteTasks);

// Export the router
module.exports = router;
