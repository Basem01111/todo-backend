const { z } = require("zod");

// Login
exports.loginValidate = z.object({
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .trim()
    .toLowerCase()
    .email("البريد الإلكتروني غير صالح"),

  password: z
    .string({ required_error: "كلمة المرور مطلوبة" }),

  remember: z
    .boolean().optional()
});

// Add
exports.createUsersValidate = z.object({
  name: z
    .string({ required_error: "الاسم مطلوب" })
    .trim()
    .min(1, "الاسم مطلوب"),

  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .trim()
    .toLowerCase()
    .email("البريد الإلكتروني غير صالح"),

  phone: z
    .string({ required_error: "رقم الهاتف مطلوب" })
    .trim()
    .min(1, "رقم الهاتف مطلوب"),

  password: z
    .string({ required_error: "كلمة المرور مطلوبة" })
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .regex(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
    .regex(
      /[^a-zA-Z0-9]/,
      "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"
    ),
});

// Update
exports.updateUsersValidate = z.object({
  name: z.string().trim().min(1, "الأسم مطلوب").optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("البريد الإلكتروني غير صالح").optional(),

  phone: z
    .string()
    .trim().min(1, "رقم الهاتف مطلوب").optional(),

  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .regex(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
    .regex(
      /[^a-zA-Z0-9]/,
      "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل"
    )
    .optional(),
});

