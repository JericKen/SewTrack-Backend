import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { repairOrderSchema } from "../../validators/repairOrderSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function FormField({
    label,
    hint,
    error,
    children,
}) {
    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            {children}
            {hint && !error && (
                <p className="text-xs text-muted-foreground">
                    {hint}
                </p>
            )}
            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function RepairForm({
    onSubmit,
    loading,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(repairOrderSchema),
        defaultValues: {
            customerName: "",
            phone: "",
            itemType: "",
            description: "",
            repairCost: "",
            dueDate: "",
            remarks: "",
        },
    });

    async function handleFormSubmit(data) {
        await onSubmit({
            customerName: data.customerName.trim(),
            phone: data.phone?.trim() || undefined,
            itemType: data.itemType.trim(),
            description: data.description.trim(),
            repairCost: Number(data.repairCost),
            dueDate: data.dueDate || undefined,
            remarks: data.remarks?.trim() || undefined,
        });
    }

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4"
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Customer Name"
                    error={errors.customerName?.message}
                >
                    <Input
                        placeholder="Customer full name"
                        {...register("customerName")}
                    />
                </FormField>

                <FormField
                    label="Phone"
                    hint="Optional contact number"
                    error={errors.phone?.message}
                >
                    <Input
                        placeholder="09XX XXX XXXX"
                        {...register("phone")}
                    />
                </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Item Type"
                    hint="e.g. Sewing machine, dress, bag"
                    error={errors.itemType?.message}
                >
                    <Input
                        placeholder="What is being repaired?"
                        {...register("itemType")}
                    />
                </FormField>

                <FormField
                    label="Repair Cost"
                    error={errors.repairCost?.message}
                >
                    <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...register("repairCost")}
                    />
                </FormField>
            </div>

            <FormField
                label="Issue Description"
                error={errors.description?.message}
            >
                <Textarea
                    rows={3}
                    placeholder="Describe the damage or repair needed..."
                    {...register("description")}
                />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Due Date"
                    hint="Optional expected completion date"
                    error={errors.dueDate?.message}
                >
                    <Input
                        type="date"
                        {...register("dueDate")}
                    />
                </FormField>

                <FormField
                    label="Remarks"
                    error={errors.remarks?.message}
                >
                    <Input
                        placeholder="Optional internal notes..."
                        {...register("remarks")}
                    />
                </FormField>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Create Repair Order"}
                </Button>
            </div>
        </form>
    );
}
