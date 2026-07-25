import { z } from "zod";

export const EXPENSE_CATEGORIES = [
    { value: "ALL", label: "All categories" },
    { value: "BUSINESS", label: "Business" },
    { value: "HOUSEHOLD", label: "Household" },
    { value: "CAPITAL", label: "Capital" },
    { value: "UTILITIES", label: "Utilities" },
    { value: "TRANSPORTATION", label: "Transportation" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "OTHER", label: "Other" },
];

export const EXPENSE_CATEGORY_OPTIONS = EXPENSE_CATEGORIES.filter(
    (item) => item.value !== "ALL"
);

export const EXPENSE_CATEGORY_LABELS = Object.fromEntries(
    EXPENSE_CATEGORY_OPTIONS.map((item) => [item.value, item.label])
);

export const PAYMENT_METHODS = [
    { value: "ALL", label: "All methods" },
    { value: "CASH", label: "Cash" },
    { value: "GCASH", label: "GCash" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
];

export const PAYMENT_METHOD_OPTIONS = PAYMENT_METHODS.filter(
    (item) => item.value !== "ALL"
);

export const PAYMENT_METHOD_LABELS = Object.fromEntries(
    PAYMENT_METHOD_OPTIONS.map((item) => [item.value, item.label])
);

export const expenseSchema = z.object({
    category: z.enum([
        "BUSINESS",
        "HOUSEHOLD",
        "CAPITAL",
        "UTILITIES",
        "TRANSPORTATION",
        "MAINTENANCE",
        "OTHER",
    ], {
        required_error: "Category is required.",
    }),

    amount: z.coerce.number()
        .positive("Amount must be greater than 0."),

    paymentMethod: z.enum([
        "CASH",
        "GCASH",
        "BANK_TRANSFER",
    ], {
        required_error: "Payment method is required.",
    }),

    description: z.string()
        .trim()
        .min(2, "Description must be at least 2 characters.")
        .max(255, "Description must be at most 255 characters."),

    expenseDate: z.string()
        .min(1, "Expense date is required."),

    remarks: z.string()
        .trim()
        .max(255, "Remarks must be at most 255 characters.")
        .optional()
        .or(z.literal("")),
});
