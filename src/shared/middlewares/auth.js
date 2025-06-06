var jwt = require("jsonwebtoken");
const apiResponse = require("../../utils/apiResponse");

require("dotenv").config();


const auth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return apiResponse(res, 401, "Unauthorized");
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return apiResponse(res, 403, "Forbidden");
        next()
    })
};

module.exports = auth;
