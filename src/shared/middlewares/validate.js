const apiResponse = require("../../utils/apiResponse");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return apiResponse(
      res,
      400,
      "خطاء في البيانات المدخلة",
      result.error.flatten().fieldErrors
    );
  }
  req.body = result.data;
  next();
};

module.exports = validate;
