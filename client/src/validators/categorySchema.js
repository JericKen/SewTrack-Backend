import { z } from "zod";

export const categorySchema = z.object({
    code: z
        .string()
        .trim()
        .min(2, "Category code must be at least 2 characters.")
        .max(5, "Category code cannot exceed 5 characters.")
        .transform((value) => value.toUpperCase()),

    name: z
        .string()
        .trim()
        .min(1, "Category name is required.")
        .max(50, "Category name cannot exceed 50 characters."),

    description: z
        .string()
        .trim()
        .max(255, "Description cannot exceed 255 characters.")
        .optional()
        .or(z.literal("")),
});
