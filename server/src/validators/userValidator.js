const { z } = require("zod");

const createUserSchema = z.object({

    name: z
        .string()
        .trim()
        .min(1, "Name is required.")
        .max(100, "Name cannot exceed 100 characters."),

    email: z
        .email("Invalid email address."),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),

    role: z.enum([
        "ADMIN",
        "STAFF"
    ])

});

const updateUserSchema = z.object({

    name: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

    email: z
        .email()
        .optional(),

    role: z.enum([
        "ADMIN",
        "STAFF"
    ]).optional()

});

const resetPasswordSchema = z.object({

    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")

});

module.exports = {

    createUserSchema,
    updateUserSchema,
    resetPasswordSchema

};