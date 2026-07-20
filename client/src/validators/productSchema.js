import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  categoryId: z
    .number({
      required_error: "Category is required",
    })
    .int(),

  type: z.enum(["RESALE", "MANUFACTURED"], {
    required_error: "Product type is required",
  }),

  unit: z.enum([
    "PCS",
    "PAIR",
    "PACK",
    "ROLL",
    "METER",
  ], {
    required_error: "Unit is required",
  }),

  costPrice: z
    .number({
      required_error: "Cost price is required",
      invalid_type_error: "Cost price is required",
    })
    .positive("Cost price must be greater than 0"),

  sellingPrice: z
    .number({
      required_error: "Selling price is required",
      invalid_type_error: "Selling price is required",
    })
    .positive("Selling price must be greater than 0"),

  stockQuantity: z
    .number()
    .int()
    .min(0),

  minimumStock: z
    .number()
    .int()
    .min(0),

  description: z.string().optional(),
});