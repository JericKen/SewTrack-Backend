import { z } from "zod";

export const supplierSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Supplier name must be at least 2 characters.")
        .max(100),

    contactPerson: z.string().trim().optional(),

    phone: z.string().trim().optional(),

    email: z
        .string()
        .trim()
        .email("Enter a valid email address.")
        .optional()
        .or(z.literal("")),

    address: z.string().trim().optional(),

    remarks: z.string().trim().optional(),
});
