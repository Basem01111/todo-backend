const apiResponse = require("../../utils/apiResponse");
const usersModel = require("../../shared/models/users.model");
const { isUnique } = require("../../utils/db");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

require("dotenv").config();

exports.register = async (req, res, next) => {
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

    return apiResponse(res, 200, "تم التسجيل");
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;

    // Find user by email
    const user = await usersModel.findOne({ email });
    if (!user)
      return apiResponse(res, 400, "البريد الالكتروني غير مسجل", {
        email: ["البريد الالكتروني غير مسجل"],
      });

    // Match password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return apiResponse(res, 400, "كلمة المرور غير صحيحة", {
        password: ["كلمة المرور غير صحيحة"],
      });

    // Create JWT access token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    // Create JWT Refresh token

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: remember ? "60d" : "1d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      ...(remember && { maxAge: 30 * 24 * 60 * 60 * 1000 }),
    });

    // Response
    return apiResponse(res, 200, "تم تسجيل الدخول", { user, accessToken });
  } catch (error) {
    apiResponse(res, 500, error.message);
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies.refreshToken;
    if (!refreshToken) return apiResponse(res, 204, "No Content");

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return apiResponse(res, 200, "تم تسجيل الخروج بنجاح");
  } catch (err) {
    return apiResponse(res, 500, "حدث خطأ أثناء تسجيل الخروج");
  }
};

// Refresh Token
exports.refreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return apiResponse(res, 401, "Unauthorized");

    const refreshToken = cookies.refreshToken;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await usersModel.findById(decoded.UserInfo.id);
    if (!user) return apiResponse(res, 401, "Unauthorized");

    const accessToken = jwt.sign(
      { UserInfo: { id: user._id } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    return res.json({ user, accessToken });
  } catch (err) {
    return apiResponse(res, 403, "Invalid or expired token");
  }
};
