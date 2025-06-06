const apiResponse = require('../../utils/apiResponse');
const tasksModel = require('./tasks.model');

// Get All
exports.getTasks = async (req, res, next) => {
  try {
    tasks = await tasksModel.find({}).sort({ createdAt: -1 });
    apiResponse(res, 200, 'تم جلب المهمات', tasks);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
}

// Add Task
exports.addTasks = async (req, res, next) => {
  try {    
    const task = new tasksModel(req.body);
    await task.save();
    return apiResponse(res, 200, 'تم الاضافة', task);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
}

// Update Task
exports.updateTasks = async (req, res, next) => {
  try {
    const {id} = req.params;
    
    const task = await tasksModel.findByIdAndUpdate(id, req.body, { new: true });
    return apiResponse(res, 200, 'تم التحديث', task);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
}

// Delete Task
exports.deleteTasks = async (req, res, next) => {
  try {
    const {id} = req.params;
    
    await tasksModel.findByIdAndDelete(id);
    return apiResponse(res, 200, 'تم الحذف');
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
}

