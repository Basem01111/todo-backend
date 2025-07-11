const { z } = require("zod");
const { formatedTypes } = require("./global");

/**
 * Returns a Zod schema to validate file uploads with flexible options
 *
 * @param {Object} options - Validation options.
 * @param {Object} [options.req=null] - Express request object, used to access user data and route params.
 * @param {Model} [options.model=null] - Mongoose model to fetch the existing record from the database.
 * @param {number} options.maxCount - Maximum number of files allowed after upload.
 * @param {boolean} [options.required=false] - Whether file upload is mandatory.
 * @param {string} options.types - Allowed file MIME types, comma-separated (e.g., "file/png,file/jpeg").
 * @param {Object} [options.messages={}] - Custom error messages.
 * @returns {ZodType} - A Zod schema for validating file uploads.
 */
exports.fileUploadValidator = ({
  req,
  model = null,
  maxCount,
  required = false,
  types,
  messages = {},
}) => {
  const typesArray = types.split(",");

  return z
    .any()

    .refine((file) => {
      if (required) return file && file.length > 0;
      return true;
    }, messages.required || req.__("required"))

    .refine(
      (file) =>
        file ? file.every((f) => typesArray.includes(f?.mimetype)) : true,
      messages.type || req.__("invalid_type",{ types: formatedTypes(types) })
    )

    .superRefine(async (file, ctx) => {
      if (req && model && maxCount && file) {
        const fieldName = ctx.path[0];

        const task = await model
          .findOne({
            _id: req.params.id,
            userId: req.userId,
          })
          .select(`${fieldName} -_id`)
          .lean();

        const currentFilesCount = task?.[fieldName]?.length || 0;
        const incomingFilesCount = Array.isArray(file) ? file.length : 1;

        // Check Remove Files
        const removeFiles = Array.isArray(req.body.removeFiles)
          ? req.body.removeFiles
          : [];
        const validRemoveCount = removeFiles.filter((f) =>
          task?.[fieldName]?.some(
            (existingFile) => existingFile === f
          )
        ).length;

        const totalAfterUpload =
          currentFilesCount + incomingFilesCount - validRemoveCount;

        if (totalAfterUpload > maxCount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: req.__("max_count",{ maxCount }),
          });
        }
      }
    });
};

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
    const exists = await model.findOne(query).lean();
    if (exists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMsg,
      });
    }
  };
};

/**
 * Ensures that the provided values exist in the database.
 *
 * @param {MongooseModel} model - The Mongoose model to query.
 * @param {string} errorMsg - The error message to return if any values are missing.
 * @returns {(value: any, ctx: RefinementCtx) => Promise<void>} - A Zod superRefine function.
 */
exports.customExistInDB = (model, errorMsg) => {
  return async (value, ctx) => {
    const fieldName = ctx.path[0];

    const values = Array.isArray(value) ? value : [value];

    const found = await model.find({ [fieldName]: { $in: values } }).select(fieldName).lean();

    const foundValues = found.map((doc) => doc[fieldName]);

    const missing = values.filter((val) => !foundValues.includes(val));

    if (missing.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMsg,
      });
    }
  };
};


/**
 * Adds a Zod superRefine validation to check if given values (string or array)
 * exist within a specific field of the same document in the database.
 *
 * This is useful for verifying, for example, if the files the user wants to remove
 * actually exist in the "files" array of the same task/document.
 *
 * @param {Model} model - The Mongoose model used to fetch the current document.
 * @param {string} errorMsg - The error message to display if validation fails.
 * @returns {(value: any, ctx: RefinementCtx) => Promise<void>} - A Zod superRefine function.
 */
exports.validateValuesExistInDB = (model, fieldInDB, errorMsg, req) => {
  return async (value, ctx) => {
    const values = Array.isArray(value) ? value : [value];

    const document = await model
      .findOne({
        _id: req.params.id,
        userId: req.userId,
      })
      .select(fieldInDB)
      .lean();

    if (!document || !Array.isArray(document[fieldInDB])) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: req.__("invalid_document_or_field"),
      });
      return;
    }


    const invalids = values.filter(
      (val) => !document[fieldInDB].includes(val)
    );

    if (invalids.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMsg,
      });
    }
  };
};
