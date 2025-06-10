const apiResponse = require("../../../utils/apiResponse");
const usersModel = require("../../../shared/models/users.model");
const { getPathFile, moveFile } = require("../../../utils/files");
bcrypt = require("bcrypt");

// Get All
exports.getusers = async (req, res, next) => {
  try {
    //     users = await usersModel.aggregate([{
    //   $lookup:{
    //     from: "tasks",
    //     localField: "_id",
    //     foreignField: "userId",
    //     as: "tasks"
    //   }
    // }]).sort({ createdAt: -1 });
    const users = await usersModel.find({}).sort({ createdAt: -1 });

    if (!users.length) return apiResponse(res, 404, "لا يوجد مستخدمين");

    apiResponse(res, 200, "تم جلب المستخدمين", users);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Add user
exports.addusers = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    // Hash password
    req.body.password = await bcrypt.hash(password, 10);

    // Set Path Avatar
    if (req.file) {
      req.body.avatar = getPathFile(req.file.filename, "users");
    }

    // Create new user
    const user = new usersModel(req.body);
    await user.save();

    // Move Avatar From Temp
    if (req.file) {
      await moveFile(req.file.filename, "users");
    }

    return apiResponse(res, 200, "تم الاضافة", user);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Update user
exports.updateusers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, phone, password } = req.body;

    // Get User
    const existingUser = await usersModel.findById(id);
    if (!existingUser) {
      return apiResponse(res, 404, "المستخدم غير موجود");
    }

    // Hash password
    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    // Set Path Avatar
    if (req.file) {
      req.body.avatar = getPathFile(req.file.filename, "users");
    }

    //  Update user
    const user = await usersModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!user) {
      return apiResponse(res, 404, "المستخدم غير موجود");
    }

    // Move Avatar From Temp
    if (req.file) {
      await moveFile(req.file.filename, "users", existingUser.avatar);
    }

    return apiResponse(res, 200, "تم التحديث", user);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Delete user
exports.deleteusers = async (req, res, next) => {
  try {
    const { id } = req.params;

    await usersModel.findByIdAndDelete(id);
    return apiResponse(res, 200, "تم الحذف");
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};
