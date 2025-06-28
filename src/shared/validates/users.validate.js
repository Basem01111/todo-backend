const { z } = require("zod");
const { customUnique, fileUploadValidator, customExistInDB } = require("../../utils/zodCustoms");
const usersModel = require("../models/users.model");
const { formatedTypes } = require("../../utils/global");
require("dotenv").config();

// Login
exports.loginValidate = (req) =>
  z.object({
    email: z
      .string({ required_error: req.__("email_required") })
      .trim()
      .toLowerCase()
      .email(req.__("email_invalid"))
      .superRefine(customExistInDB(usersModel, req.__("email_not_found"))),

    password: z.string({ required_error: req.__("password_required") }),

    remember: z.boolean().optional(),
  });

// Register
exports.registerValidate = (req) =>
  z.object({
    name: z
      .string({ required_error: req.__("name_required") })
      .trim()
      .min(1, req.__("name_required")),

    email: z
      .string({ required_error: req.__("email_required") })
      .trim()
      .toLowerCase()
      .email(req.__("email_invalid"))
      .superRefine(customUnique(usersModel, req.__("email_taken"))),

    phone: z
      .string({ required_error: req.__("phone_required") })
      .trim()
      .min(1, req.__("phone_required"))
      .superRefine(customUnique(usersModel, req.__("phone_taken"))),

    password: z
      .string({ required_error: req.__("password_required") })
      .min(6, req.__("password_min"))
      .regex(/[a-z]/, req.__("password_lowercase"))
      .regex(/[A-Z]/, req.__("password_uppercase"))
      .regex(/[0-9]/, req.__("password_number"))
      .regex(
        /[^a-zA-Z0-9]/,
        req.__("password_special")
      ),

    avatar: fileUploadValidator({
      req,
      types: process.env.ACCEPTED_IMAGE_TYPES,
      messages: {
        type: req.__("invalid_type_images", {
          types: formatedTypes(process.env.ACCEPTED_FILE_TYPES),
        }),
      },
    }),
  });

// Add
exports.createUsersValidate = (req) =>
  z.object({
    name: z
      .string({ required_error: req.__("name_required") })
      .trim()
      .min(1, req.__("name_required")),

    email: z
      .string({ required_error: req.__("email_required") })
      .trim()
      .toLowerCase()
      .email(req.__("email_invalid"))
      .superRefine(customUnique(usersModel, req.__("email_taken"))),

    phone: z
      .string({ required_error: req.__("phone_required") })
      .trim()
      .min(1, req.__("phone_required"))
      .superRefine(customUnique(usersModel, req.__("phone_taken"))),

    password: z
      .string({ required_error: req.__("password_required") })
      .min(6, req.__("password_min"))
      .regex(/[a-z]/, req.__("password_lowercase"))
      .regex(/[A-Z]/, req.__("password_uppercase"))
      .regex(/[0-9]/, req.__("password_number"))
      .regex(
        /[^a-zA-Z0-9]/,
        req.__("password_special")
      ),

    avatar: fileUploadValidator({
      req,
      types: process.env.ACCEPTED_IMAGE_TYPES,
      messages: {
        type: req.__("invalid_type_images", {
          types: formatedTypes(process.env.ACCEPTED_FILE_TYPES),
        }),
      },
    }),

    role: z
      .string({ required_error: req.__("role_required") })
      .length(24, req.__("role_invalid")),
  });

// Update
exports.updateUsersValidate = (req) =>
  z.object({
    name: z.string().trim().min(1, req.__("name_invalid")).optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email(req.__("email_invalid"))
      .superRefine(
        customUnique(usersModel, req.__("email_taken"), req.params.id)
      )
      .optional(),

    phone: z
      .string()
      .trim()
      .min(1, req.__("phone_invalid"))
      .superRefine(
        customUnique(usersModel, req.__("phone_taken"), req.params.id)
      )
      .optional(),

    password: z
      .string()
      .min(6, req.__("password_min"))
      .regex(/[a-z]/, req.__("password_lowercase"))
      .regex(/[A-Z]/, req.__("password_uppercase"))
      .regex(/[0-9]/, req.__("password_number"))
      .regex(
        /[^a-zA-Z0-9]/,
        req.__("password_special")
      )
      .optional(),

    avatar: fileUploadValidator({
      req,
      types: process.env.ACCEPTED_IMAGE_TYPES,
      messages: {
        type: req.__("invalid_type_images", {
          types: formatedTypes(process.env.ACCEPTED_FILE_TYPES),
        }),
      },
    }),

    role: z.string().optional(),
  });
