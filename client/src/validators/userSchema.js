import { z } from "zod";

export const ROLE_OPTIONS = [
    { value: "ADMIN", label: "Administrator" },
    { value: "STAFF", label: "Staff" },
];

export const createUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required.")
        .max(100, "Name cannot exceed 100 characters."),

    email: z
        .string()
        .trim()
        .email("Enter a valid email address."),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),

    role: z.enum(["ADMIN", "STAFF"], {
        required_error: "Role is required.",
    }),
});

export const updateUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required.")
        .max(100, "Name cannot exceed 100 characters."),

    email: z
        .string()
        .trim()
        .email("Enter a valid email address."),

    role: z.enum(["ADMIN", "STAFF"]),
});

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters."),

        confirmPassword: z
            .string()
            .min(8, "Confirm your password."),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });
