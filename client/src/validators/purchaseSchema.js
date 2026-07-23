import { z } from "zod";

export const purchaseSchema = z.object({
    supplierId: z.string().optional(),
    remarks: z.string().optional(),
});
