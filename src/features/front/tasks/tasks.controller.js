const apiResponse = require("../../../utils/apiResponse");
const { deleteFiles, normalizePath } = require("../../../utils/files");
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

    if (!tasks.data.length) return apiResponse(res, 404, "لا يوجد مهمات");

    apiResponse(res, 200, "تم جلب المهمات", tasks.data, tasks.pagination);
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

    return apiResponse(res, 200, "تم الاضافة", task);
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
      return apiResponse(res, 404, "التاسك غير موجود أو غير مصرح لك بتحديثه");

    // Start with current files
    let updatedFiles = task.files || [];
    console.log(updatedFiles[0])

    // Remove selected files
    if (Array.isArray(removeFiles) && removeFiles.length) {
      // Delete from Server
      if (updatedFiles && updatedFiles.length) await deleteFiles(removeFiles);
console.log(updatedFiles[0])
          console.log("++++++++++++++++++++++")
          console.log(removeFiles[0])
      removeFiles.forEach((filename) => {
        // Remove from updatedFiles array
        updatedFiles = updatedFiles.filter((f) => {
          console.log(normalizePath(f) ," | ", normalizePath(filename))
          return normalizePath(f) !== normalizePath(filename)
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

    return apiResponse(res, 200, "تم التحديث", updatedTask);
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
      return apiResponse(res, 404, "التاسك غير موجود أو غير مصرح لك بحذفه");

    return apiResponse(res, 200, "تم الحذف");
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};
