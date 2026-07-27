import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { customerSchema } from "../../validators/customerSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function FormField({
    label,
    error,
    className,
    children,
}) {
    return (
        <div className={className ?? "space-y-1"}>
            {label && <Label className="text-xs">{label}</Label>}
            {children}
            {error && (
                <p className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}

function buildDefaultValues(customer) {
    if (!customer) {
        return {
            firstName: "",
            lastName: "",
            phone: "",
            address: "",
            remarks: "",
        };
    }

    return {
        firstName: customer.firstName,
        lastName: customer.lastName ?? "",
        phone: customer.phone ?? "",
        address: customer.address ?? "",
        remarks: customer.remarks ?? "",
    };
}

export default function CustomerForm({
    customer,
    onSubmit,
    loading,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(customerSchema),
        defaultValues: buildDefaultValues(customer),
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                    label="First Name"
                    error={errors.firstName?.message}
                >
                    <Input
                        {...register("firstName")}
                        placeholder="e.g. Maria"
                    />
                </FormField>

                <FormField
                    label="Last Name"
                    error={errors.lastName?.message}
                >
                    <Input
                        {...register("lastName")}
                        placeholder="Optional"
                    />
                </FormField>

                <FormField
                    label="Phone"
                    error={errors.phone?.message}
                >
                    <Input
                        {...register("phone")}
                        placeholder="Optional"
                    />
                </FormField>

                <FormField
                    label="Address"
                    error={errors.address?.message}
                >
                    <Input
                        {...register("address")}
                        placeholder="Optional"
                    />
                </FormField>

                <FormField
                    label="Remarks"
                    error={errors.remarks?.message}
                    className="space-y-1 sm:col-span-2"
                >
                    <Textarea
                        rows={3}
                        placeholder="Preferences, sizing notes, etc."
                        {...register("remarks")}
                    />
                </FormField>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : customer
                            ? "Update Customer"
                            : "Create Customer"}
                </Button>
            </div>
        </form>
    );
}
