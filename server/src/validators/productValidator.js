const { z } = require("zod");

const createProductSchema = z.object({

    categoryId: z.coerce.number({
        required_error: "Category is required."
    }),

    type: z.enum([
        "RESALE",
        "MANUFACTURED",
        "MATERIAL"
    ], {
        required_error: "Product type is required."
    }),

    name: z.string()
        .trim()
        .min(1, "Product name is required.")
        .max(100),

    description: z.string().trim().optional(),

    barcode: z.string().trim().optional(),

    costPrice: z.coerce.number().positive("Cost price must be greater than 0."),

    sellingPrice: z.coerce.number().positive("Selling price must be greater than 0."),

    minimumStock: z.coerce.number().int().min(0),

    stockQuantity: z.coerce.number().int().min(0).optional(),

    unit: z.enum([
        "PCS",
        "METER",
        "PACK",
        "PAIR",
        "ROLL",
        "BUNDLE"
    ])

});

const updateProductSchema = createProductSchema;

const productIdSchema = z.object({
    id: z.coerce.number().int().positive()
});

module.exports = {
    createProductSchema,
    updateProductSchema,
    productIdSchema
};