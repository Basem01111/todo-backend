const apiResponse = require("../../utils/apiResponse");
const usersModel = require("../../shared/models/users.model");
const { isUnique } = require("../../utils/db");
bcrypt = require("bcrypt");

// Get All
exports.getusers = async (req, res, next) => {
  try {
    users = await usersModel.find({}).sort({ createdAt: -1 });
    apiResponse(res, 200, "تم جلب المستخدمين", users);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Add user
exports.addusers = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    // Check Email
    if (!(await isUnique(usersModel, "email", email))) {
      return apiResponse(
        res,
        400,
        "البريد الالكتروني مستخدم بالفعل من قبل مستخدم آخر"
      );
    }

    // Check Phone
    if (!(await isUnique(usersModel, "phone", phone))) {
      return apiResponse(
        res,
        400,
        "رقم الهاتف مستخدم بالفعل من قبل مستخدم آخر"
      );
    }

    // Hash password
    req.body.password = await bcrypt.hash(password, 10);

    // Create new user
    const user = new usersModel(req.body);
    await user.save();
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

    // Check Email
    if (!(await isUnique(usersModel, "email", email, id))) {
      return apiResponse(
        res,
        400,
        "البريد الالكتروني مستخدم بالفعل من قبل مستخدم آخر"
      );
    }

    // Check Phone
    if (!(await isUnique(usersModel, "phone", phone, id))) {
      return apiResponse(
        res,
        400,
        "رقم الهاتف مستخدم بالفعل من قبل مستخدم آخر"
      );
    }

    // Hash password
    if(password) {
      req.body.password = await bcrypt.hash(password, 10);
    }
    
    //  Update user
    const user = await usersModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
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
