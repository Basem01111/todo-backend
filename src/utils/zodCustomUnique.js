const { z } = require("zod");

/**
 * Zod Custom uniquene
 * @param {MongooseModel} model - Model Mongoose
 * @param {string} errorMsg - Message Error
 * @param {string} id - If you don't want it to be equal to the same ID when comparing
 */
const customUnique = (model, errorMsg, id) => {
  return async (value, ctx) => {
    const fieldName = ctx.path[0];
    if (value === undefined || value === null) return;
    const query = { [fieldName]: value };
    if (id) {
      query._id = { $ne: id };
    }
    const exists = await model.findOne(query);
    if (exists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMsg,
      });
    }
  };
};

module.exports = customUnique;
