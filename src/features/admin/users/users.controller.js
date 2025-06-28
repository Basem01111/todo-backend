const apiResponse = require("../../../utils/apiResponse");
const usersModel = require("../../../shared/models/users.model");
const { deleteFiles } = require("../../../utils/files");
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

    if (!users.length) return apiResponse(res, 404, res.__("users_not_found"));

    apiResponse(res, 200, res.__("users_fetched"), users);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};


// Add user
exports.addUser = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    // Hash password
    req.body.password = await bcrypt.hash(password, 10);

    // Set Path Avatar
    if (req.filesPaths[0]) {
      req.body.avatar = req.filesPaths[0];
    }

    // Create new user
    const user = new usersModel(req.body);
    await user.save();

    return apiResponse(res, 200, res.__("done_added"), user);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Update user
exports.updateUsers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, phone, password } = req.body;

    // Get User
    const existingUser = await usersModel.findById(id);
    if (!existingUser) {
      return apiResponse(res, 404, res.__("user_not_found"));
    }

    // Hash password
    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    // Set Path Avatar
    if (req.filesPaths[0]) {
      req.body.avatar = req.filesPaths[0];
    }

    //  Update user
    const user = await usersModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!user) {
      return apiResponse(res, 404, res.__("user_not_found"));
    }

    // Remove Old Avatar
    if (req.filesPaths && existingUser.avatar) {
      await deleteFiles(existingUser.avatar);
    }

    return apiResponse(res, 200, res.__("done_updated"), user);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Delete user
exports.deleteUsers = async (req, res, next) => {
  try {
    const { id } = req.params;

    await usersModel.findByIdAndDelete(id);
    return apiResponse(res, 200, res.__("done_remove"));
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};
