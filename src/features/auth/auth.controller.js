const apiResponse = require("../../utils/apiResponse");
const usersModel = require("../../shared/models/users.model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { genrateAccessToken, genrateRefreshToken } = require("../../utils/token");
const rolesModel = require("../admin/roles/roles.model");

require("dotenv").config();

exports.register = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    // Hash password
    req.body.password = await bcrypt.hash(password, 10);
    
    // Add Role
    const role = await rolesModel.findOne({name:'user'});
    if(role) {
      req.body.role = role._id;
    } else {
      return apiResponse(res, 404, res.__("role_not_found"));
    }
    
    // Set Path Avatar
    if(req.filesPaths[0]) {
      req.body.avatar = req.filesPaths[0];
    }
    
    // Create new user
    const user = new usersModel(req.body);
    await user.save();
    
    return apiResponse(res, 200, res.__("register_success"),user);
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;
    
    // Find user by email
    const user = await usersModel.findOne({ email });
    // if (!user)
    //   return apiResponse(res, 400, res.__("email_not_found"), {
    //     email: [res.__("email_not_found")],
    //   });

    // Match password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return apiResponse(res, 400, res.__("invalid_password"), {
        password: [res.__("invalid_password")],
      });

    // Create JWT access token
    const accessToken = genrateAccessToken(user);

    // Create JWT Refresh token
    const refreshToken = genrateRefreshToken(user, remember);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      ...(remember && { maxAge: 30 * 24 * 60 * 60 * 1000 }),
    });

    // Response
    return apiResponse(res, 200, res.__("login_success"), { user, accessToken });
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies.refreshToken;
    if (!refreshToken) return apiResponse(res, 204, res.__("invalid_or_expired_token"));

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return apiResponse(res, 200, res.__("logout_success"));
  } catch (err) {
    return apiResponse(res, 500,  res.__("logout_error"));
  }
};

// Refresh Token
exports.refreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return apiResponse(res, 401, res.__("unauthorized"));

    const refreshToken = cookies.refreshToken;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await usersModel.findById(decoded.userInfo.id);
    if (!user) return apiResponse(res, 401, res.__("unauthorized"));

    const accessToken = genrateAccessToken(user);

    return res.json({ user, accessToken });
  } catch (err) {
    return apiResponse(res, 403,  res.__("invalid_or_expired_token"));
  }
};
