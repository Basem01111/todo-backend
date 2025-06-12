const { z } = require("zod");
const { mbToBytes, formatedTypes } = require("./global");

/**
 * Returns a Zod schema to validate image uploads with dynamic options.
 *
 * @param {Object} options
 * @param {boolean} options.required - Whether the image(s) are required.
 * @param {number} options.maxFiles - Maximum number of allowed files.
 * @param {string|number} options.maxSize - Max size per image in MB.
 * @param {string} options.types - Allowed MIME types (comma-separated).
 * @param {Object} options.messages - Custom error messages.
 * @returns {ZodType} - Zod schema.
 */
exports.imageUploadValidator = ({
  required = false,
  types,
  messages = {},
}) =>{
  const typesArray = types.split(",");

  return z
    .any()
    .refine(
      (file) => {
        if (required) return file && file.length > 0;
        return true;
      },
      messages.required || "Image is required"
    )
    .refine(
      (file) =>
        file ? file.every((f) => typesArray.includes(f?.mimetype)) : true,
      messages.type ||
        `Only the following image types are allowed: ${formatedTypes(types)}`
    );
}



/**
 * Zod Custom uniquene
 * @param {MongooseModel} model - Model Mongoose
 * @param {string} errorMsg - Message Error
 * @param {string} id - If you don't want it to be equal to the same ID when comparing
 */
exports.customUnique = (model, errorMsg, id) => {
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
