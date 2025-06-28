const { z } = require('zod');
const { fileUploadValidator, validateValuesExistInDB } = require('../../../utils/zodCustoms');
const { formatedTypes } = require('../../../utils/global');
const tasksModel = require("./tasks.model");

// Add
exports.createTasksValidate = (req)=> z.object({
  title: z.string({ required_error: req.__("task_title_required") })
    .trim()
    .min(1, req.__("task_title_required"))
    .max(100, req.__("task_title_max")),
    
  description: z.string().trim().max(1000, req.__("task_description_max")).optional(),
  completed: z.boolean().optional(),

  files: fileUploadValidator({
        req,
        types: process.env.ACCEPTED_FILE_TYPES,
        messages: {
          type: req.__("invalid_type",{ types: formatedTypes(
            process.env.ACCEPTED_FILE_TYPES
          ) }),
        },
      }),
});

// Update
exports.updateTasksValidate = (req)=> z.object({
  title: z.string().trim().max(100, req.__("task_title_max")).optional(),
  description: z.string().trim().max(1000, req.__("task_description_max")).optional(),
  completed: z.boolean().optional(),
  removeFiles: z.array(z.string()).superRefine(validateValuesExistInDB(tasksModel, 'files',req.__("invalid_files_to_remove"),req)).optional(),

    files: fileUploadValidator({
        req,
        model: tasksModel,
        maxCount: process.env.MAX_FILE_COUNT,
        types: process.env.ACCEPTED_FILE_TYPES,
        messages: {
          type: req.__("invalid_type",{ types: formatedTypes(
            process.env.ACCEPTED_FILE_TYPES
          ) }),
        },
      }),
});
