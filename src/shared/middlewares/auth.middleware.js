var jwt = require("jsonwebtoken");
const apiResponse = require("../../utils/apiResponse");
const usersModel = require("../models/users.model");

require("dotenv").config();

exports.authMiddlewareFront = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return apiResponse(res, 401, "Unauthorized");
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return apiResponse(res, 403, "Forbidden");
        const user = await usersModel.findById(decoded.userInfo.id).select('_id');
        if (!user) return apiResponse(res, 401, "Unauthorized");
        req.userId = user._id;
        next()
    })
};

exports.authMiddlewareAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return apiResponse(res, 401, "Unauthorized");
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return apiResponse(res, 403, "Forbidden");
        const user = await usersModel.findById(decoded.userInfo.id).select('_id role').populate('role');
        if (!user || user?.role?.name !== 'admin') return apiResponse(res, 401, "Unauthorized");
        req.userId = user._id;
        next()
    })
};
