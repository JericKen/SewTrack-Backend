import { z } from "zod";

export const productSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Product name is required."),

    categoryId: z
        .number({
            required_error: "Category is required.",
        }),

    type: z.enum([
        "RESALE",
        "MANUFACTURED",
    ]),

    unit: z.enum([
        "PCS",
        "METER",
        "PACK",
        "PAIR",
        "ROLL",
        "BUNDLE",
    ]),

    costPrice: z
        .coerce
        .number()
        .min(0, "Cost price cannot be negative."),

    sellingPrice: z
        .coerce
        .number()
        .min(0, "Selling price cannot be negative."),

    stockQuantity: z
        .coerce
        .number()
        .min(0, "Stock cannot be negative."),

    minimumStock: z
        .coerce
        .number()
        .min(0, "Minimum stock cannot be negative."),

    description: z
        .string()
        .optional(),
});