const { z } = require('zod');

// Add
exports.createTasksValidate = z.object({
  title: z.string({ required_error: "الرجاء إدخال عنوان المهمة" })
    .trim()
    .min(1, "الرجاء إدخال عنوان المهمة")
    .max(100, "العنوان يجب أن يكون أقل من 100 حرف"),
    
  description: z.string().trim().max(1000, "المهمة يجب أن تكون أقل من 1000 حرف").optional(),
  completed: z.boolean().optional(),
});

// Update
exports.updateTasksValidate = z.object({
  title: z.string().trim().max(100, "العنوان يجب أن يكون أقل من 100 حرف").optional(),
  description: z.string().trim().max(1000, "المهمة يجب أن تكون أقل من 1000 حرف").optional(),
  completed: z.boolean().optional(),
});
