const { z } = require("zod");
const customUnique = require("../../utils/zodCustomUnique");
const usersModel = require("../models/users.model");

// Login
exports.loginValidate = () =>
  z.object({
    email: z
      .string({ required_error: "البريد الإلكتروني مطلوب" })
      .trim()
      .toLowerCase()
      .email("البريد الإلكتروني غير صالح"),

    password: z.string({ required_error: "كلمة المرور مطلوبة" }),

    remember: z.boolean().optional(),
  });

// Register
exports.registerValidate = () =>
  z.object({
    name: z
      .string({ required_error: "الاسم مطلوب" })
      .trim()
      .min(1, "الاسم مطلوب"),

    email: z
      .string({ required_error: "البريد الإلكتروني مطلوب" })
      .trim()
      .toLowerCase()
      .email("البريد الإلكتروني غير صالح")
      .superRefine(customUnique(usersModel, "هذا البريد مستخدم من قبل")),

    phone: z
      .string({ required_error: "رقم الهاتف مطلوب" })
      .trim()
      .min(1, "رقم الهاتف مطلوب")
      .superRefine(customUnique(usersModel, "هذا الرقم مستخدم من قبل")),

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
// Add
exports.createUsersValidate = () =>
  z.object({
    name: z
      .string({ required_error: "الاسم مطلوب" })
      .trim()
      .min(1, "الاسم مطلوب"),

    email: z
      .string({ required_error: "البريد الإلكتروني مطلوب" })
      .trim()
      .toLowerCase()
      .email("البريد الإلكتروني غير صالح")
      .superRefine(customUnique(usersModel, "هذا البريد مستخدم من قبل")),

    phone: z
      .string({ required_error: "رقم الهاتف مطلوب" })
      .trim()
      .min(1, "رقم الهاتف مطلوب")
      .superRefine(customUnique(usersModel, "هذا الرقم مستخدم من قبل")),

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

    role: z
      .string({ required_error: "نوع المستخدم مطلوب" })
      .length(24, "دور المستخدم غير صحيح"),
  });

// Update
exports.updateUsersValidate = (userId) =>
  z.object({
    name: z.string().trim().min(1, "الأسم غير صحيح").optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("البريد الإلكتروني غير صالح")
      .superRefine(customUnique(usersModel, "هذا البريد مستخدم من قبل", userId))
      .optional(),

    phone: z
      .string()
      .trim()
      .min(1, "رقم الهاتف غير صحيح")
      .superRefine(customUnique(usersModel, "هذا الرقم مستخدم من قبل", userId))
      .optional(),

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

    role: z.string().optional(),
  });
