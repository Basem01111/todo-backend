const apiResponse = require("../../../utils/apiResponse");
const tasksModel = require("./tasks.model");

// Get All
exports.getTasks = async (req, res, next) => {
  try {
    tasks = await tasksModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });

      if(!tasks.length) return apiResponse(res, 404, "لا يوجد مهمات");
      
    apiResponse(res, 200, "تم جلب المهمات", tasks);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Add Task
exports.addTasks = async (req, res, next) => {
  try {
    const task = new tasksModel(req.body);
    task.userId = req.userId;
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

    const task = await tasksModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!task)
      return apiResponse(
        res,
        404,
        "التاسك غير موجود أو غير مصرح لك بتحديثه"
      );

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
      return apiResponse(
        res,
        404,
        "التاسك غير موجود أو غير مصرح لك بحذفه"
      );

    return apiResponse(res, 200, "تم الحذف");
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};
