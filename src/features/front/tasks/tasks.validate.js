const { z } = require('zod');
const { imageUploadValidator, validateValuesExistInDB } = require('../../../utils/zodCustoms');
const { formatedTypes } = require('../../../utils/global');
const tasksModel = require("./tasks.model");

// Add
exports.createTasksValidate = (req)=> z.object({
  title: z.string({ required_error: "الرجاء إدخال عنوان المهمة" })
    .trim()
    .min(1, "الرجاء إدخال عنوان المهمة")
    .max(100, "العنوان يجب أن يكون أقل من 100 حرف"),
    
  description: z.string().trim().max(1000, "المهمة يجب أن تكون أقل من 1000 حرف").optional(),
  completed: z.boolean().optional(),

  files: imageUploadValidator({
        types: process.env.ACCEPTED_FILE_TYPES,
        messages: {
          type: `أنواع الملفات المسموح بها: ${formatedTypes(
            process.env.ACCEPTED_FILE_TYPES
          )} فقط`,
        },
      }),
});

// Update
exports.updateTasksValidate = (req)=> z.object({
  title: z.string().trim().max(100, "العنوان يجب أن يكون أقل من 100 حرف").optional(),
  description: z.string().trim().max(1000, "المهمة يجب أن تكون أقل من 1000 حرف").optional(),
  completed: z.boolean().optional(),
  removeFiles: z.array(z.string()).superRefine(validateValuesExistInDB(tasksModel, 'files',"تأكد ان الصور التي تريد حذفها صحيحة",req)).optional(),

    files: imageUploadValidator({
        req,
        model: tasksModel,
        maxCount: process.env.MAX_FILE_COUNT,
        types: process.env.ACCEPTED_FILE_TYPES,
        messages: {
          type: `أنواع الملفات المسموح بها: ${formatedTypes(
            process.env.ACCEPTED_FILE_TYPES
          )} فقط`,
        },
      }),
});
