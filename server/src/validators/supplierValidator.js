const { z } = require("zod");

const createSupplierSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Supplier name must be at least 2 characters.")
        .max(100),

    contactPerson: z.string().trim().optional(),

    phone: z.string().trim().optional(),

    email: z.string().email().optional().or(z.literal("")),

    address: z.string().trim().optional(),

    remarks: z.string().trim().optional(),
});

const updateSupplierSchema = createSupplierSchema;

const supplierIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

module.exports = {
    createSupplierSchema,
    updateSupplierSchema,
    supplierIdSchema,
};
