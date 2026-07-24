import { z } from "zod";

export const REPAIR_STATUSES = [
    { value: "ALL", label: "All statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "READY_FOR_PICKUP", label: "Ready for Pickup" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
];

export const REPAIR_STATUS_LABELS = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    READY_FOR_PICKUP: "Ready for Pickup",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

export const repairOrderSchema = z.object({
    customerName: z.string()
        .trim()
        .min(2, "Customer name must be at least 2 characters.")
        .max(100, "Customer name must be at most 100 characters."),

    phone: z.string()
        .trim()
        .max(20, "Phone must be at most 20 characters.")
        .optional()
        .or(z.literal("")),

    itemType: z.string()
        .trim()
        .min(2, "Item type must be at least 2 characters.")
        .max(100, "Item type must be at most 100 characters."),

    description: z.string()
        .trim()
        .min(5, "Description must be at least 5 characters.")
        .max(500, "Description must be at most 500 characters."),

    repairCost: z.coerce.number()
        .nonnegative("Repair cost must be zero or greater."),

    dueDate: z.string().optional().or(z.literal("")),

    remarks: z.string()
        .trim()
        .max(255, "Remarks must be at most 255 characters.")
        .optional()
        .or(z.literal("")),
});
