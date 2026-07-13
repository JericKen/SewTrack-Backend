const { z } = require("zod");

const loginSchema = z.object({

    email: z
        .email("Invalid email address."),

    password: z
        .string()
        .min(1, "Password is required.")

});

const changePasswordSchema = z.object({

    currentPassword: z
        .string()
        .min(1, "Current password is required."),

    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters.")

});

module.exports = {
    loginSchema,
    changePasswordSchema
};