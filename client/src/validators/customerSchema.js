import { z } from "zod";

export const customerSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters.")
        .max(100),

    lastName: z.string().trim().max(100).optional(),

    phone: z.string().trim().max(20).optional(),

    address: z.string().trim().max(255).optional(),

    remarks: z.string().trim().max(255).optional(),
});
