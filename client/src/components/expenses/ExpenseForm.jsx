import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    EXPENSE_CATEGORY_OPTIONS,
    PAYMENT_METHOD_OPTIONS,
    expenseSchema,
} from "../../validators/expenseSchema";

import { getTodayISO } from "@/utils/date";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

function toDateInputValue(value) {
    if (!value) {
        return getTodayISO();
    }

    return new Date(value).toISOString().slice(0, 10);
}

function buildDefaultValues(expense) {
    if (!expense) {
        return {
            category: "",
            amount: "",
            paymentMethod: "",
            description: "",
            expenseDate: getTodayISO(),
            remarks: "",
        };
    }

    return {
        category: expense.category,
        amount: Number(expense.amount).toString(),
        paymentMethod: expense.paymentMethod,
        description: expense.description,
        expenseDate: toDateInputValue(expense.expenseDate),
        remarks: expense.remarks ?? "",
    };
}

export default function ExpenseForm({
    expense,
    onSubmit,
    loading,
}) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(expenseSchema),
        defaultValues: buildDefaultValues(expense),
    });

    const category = watch("category");
    const paymentMethod = watch("paymentMethod");

    async function handleFormSubmit(data) {
        await onSubmit({
            category: data.category,
            amount: Number(data.amount),
            paymentMethod: data.paymentMethod,
            description: data.description.trim(),
            expenseDate: data.expenseDate,
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
                    label="Category"
                    error={errors.category?.message}
                >
                    <Select
                        value={category}
                        onValueChange={(value) =>
                            setValue("category", value, {
                                shouldValidate: true,
                            })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>

                        <SelectContent>
                            {EXPENSE_CATEGORY_OPTIONS.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>

                <FormField
                    label="Payment Method"
                    error={errors.paymentMethod?.message}
                >
                    <Select
                        value={paymentMethod}
                        onValueChange={(value) =>
                            setValue("paymentMethod", value, {
                                shouldValidate: true,
                            })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>

                        <SelectContent>
                            {PAYMENT_METHOD_OPTIONS.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Amount"
                    error={errors.amount?.message}
                >
                    <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        {...register("amount")}
                    />
                </FormField>

                <FormField
                    label="Expense Date"
                    error={errors.expenseDate?.message}
                >
                    <Input
                        type="date"
                        {...register("expenseDate")}
                    />
                </FormField>
            </div>

            <FormField
                label="Description"
                error={errors.description?.message}
            >
                <Input
                    placeholder="What was this expense for?"
                    {...register("description")}
                />
            </FormField>

            <FormField
                label="Remarks"
                hint="Optional internal notes"
                error={errors.remarks?.message}
            >
                <Textarea
                    rows={2}
                    placeholder="Optional notes..."
                    {...register("remarks")}
                />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : expense
                            ? "Save Changes"
                            : "Record Expense"}
                </Button>
            </div>
        </form>
    );
}
