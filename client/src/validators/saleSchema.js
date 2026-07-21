import { z } from "zod";

export const saleSchema = z.object({
    customerName: z.string().optional(),
    paymentMethod: z.enum(["CASH", "GCASH", "BANK_TRANSFER"], {
        required_error: "Payment method is required",
    }),
    remarks: z.string().optional(),
});

export const saleItemSchema = z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive("Quantity must be at least 1"),
});
