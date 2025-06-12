const apiResponse = require("../../utils/apiResponse");

const mergeFieldErrors = (errorsA = {}, errorsB = {}) => {
  const merged = { ...errorsA };
  for (const key in errorsB) {
    if (merged[key]) {
      merged[key] = [...merged[key], ...errorsB[key]];
    } else {
      merged[key] = errorsB[key];
    }
  }
  return merged;
};

const validateMiddleware = (schemaFactory) => async (req, res, next) => {
  try {
    const userIdFromReq = req.params.id || null;
    
    const schema = schemaFactory(userIdFromReq);

    if(req.files && req.files[0]) req.body[req.files[0].fieldname] = req.files;
    const data = await schema.parseAsync(req.body);

    const otherErrors = req.validateErrors || {};

    if (Object.keys(otherErrors).length > 0) {
      return apiResponse(res, 400, "خطأ في البيانات المدخلة", otherErrors);
    }

    req.body = data;

    next();
  } catch (error) {
    if (error.name === "ZodError") {
      const zodErrors = error.flatten().fieldErrors;

      const otherErrors = req.validateErrors || {};

      const mergedErrors = mergeFieldErrors(otherErrors, zodErrors);

      return apiResponse(res, 400, "خطأ في البيانات المدخلة", mergedErrors);
    }

    return next(error);
  }
};

module.exports = validateMiddleware;
