var jwt = require("jsonwebtoken");

exports.genrateAccessToken = (user) => {
  return jwt.sign(
    {
      userInfo: {
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
};

exports.genrateRefreshToken = (user, remember = false) => {
  return jwt.sign(
    {
      userInfo: {
        id: user._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: remember ? "60d" : "1d" }
  );
};
