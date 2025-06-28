const apiResponse = require("../../../utils/apiResponse");
const { deleteFiles } = require("../../../utils/files");
const paginate = require("../../../utils/paginate");
const tasksModel = require("./tasks.model");

// Get All
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await paginate({
      req,
      model: tasksModel,
      filter: { userId: req.userId },
    });

    if (!tasks.data.length) return apiResponse(res, 404, res.__('no_tasks_found'));

    apiResponse(res, 200, res.__('tasks_fetched'), tasks.data, tasks.pagination);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Add Task
exports.addTasks = async (req, res, next) => {
  try {
    // If files Add To Body
    if (req.filesPaths?.length) {
      req.body.files = req.filesPaths;
    }

    // Add User Id To Body
    req.body.userId = req.userId;

    // Save
    const task = new tasksModel(req.body);
    await task.save();

    return apiResponse(res, 200, res.__('done_added'), task);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Update Task
exports.updateTasks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removeFiles = req.body.removeFiles || [];

    // Get Existing Task
    const task = await tasksModel.findOne({ _id: id, userId: req.userId });

    if (!task)
      return apiResponse(res, 404, res.__('task_not_found_or_unauthorized_update'));

    // Start with current files
    let updatedFiles = task.files || [];

    // Remove selected files
    if (Array.isArray(removeFiles) && removeFiles.length) {
      // Delete from Server
      if (updatedFiles && updatedFiles.length) await deleteFiles(removeFiles);
      removeFiles.forEach((filename) => {
        // Remove from updatedFiles array
        updatedFiles = updatedFiles.filter((f) => {
          return f !== (filename)
        });
      });
    }

    // Add New Files
    if (req.filesPaths?.length) {
      updatedFiles = [...updatedFiles, ...req.filesPaths];
    }
    const updateData = {
      ...req.body,
      files: updatedFiles,
    };
    delete updateData.removeFiles;

    // Update the task
    const updatedTask = await tasksModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updateData,
      { new: true }
    );

    return apiResponse(res, 200, res.__('done_updated'), updatedTask);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Delete Task
exports.deleteTasks = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await tasksModel.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!task)
      return apiResponse(res, 404, res.__('task_not_found_or_unauthorized_delete'));

    return apiResponse(res, 200, res.__('done_remove'));
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};
