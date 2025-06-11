const apiResponse = require("../../../utils/apiResponse");
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
    if (req.filePaths) {
      req.body.files = req.filePaths;
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

    // Set Path File
    if (req.filePaths) {
      req.body.files = req.filePaths;
    }

    const task = await tasksModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!task)
      return apiResponse(res, 404, "التاسك غير موجود أو غير مصرح لك بتحديثه");

    return apiResponse(res, 200, "تم التحديث", task);
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
