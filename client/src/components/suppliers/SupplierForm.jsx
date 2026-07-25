import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { supplierSchema } from "../../validators/supplierSchema";

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

function buildDefaultValues(supplier) {
    if (!supplier) {
        return {
            name: "",
            contactPerson: "",
            phone: "",
            email: "",
            address: "",
            remarks: "",
        };
    }

    return {
        name: supplier.name,
        contactPerson: supplier.contactPerson ?? "",
        phone: supplier.phone ?? "",
        email: supplier.email ?? "",
        address: supplier.address ?? "",
        remarks: supplier.remarks ?? "",
    };
}

export default function SupplierForm({
    supplier,
    onSubmit,
    loading,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(supplierSchema),
        defaultValues: buildDefaultValues(supplier),
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                    label="Supplier Name"
                    error={errors.name?.message}
                    className="space-y-1 sm:col-span-2"
                >
                    <Input
                        {...register("name")}
                        placeholder="e.g. Manila Textile Supply"
                    />
                </FormField>

                <FormField
                    label="Contact Person"
                    error={errors.contactPerson?.message}
                >
                    <Input
                        {...register("contactPerson")}
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
                    label="Email"
                    error={errors.email?.message}
                >
                    <Input
                        type="email"
                        {...register("email")}
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
                        placeholder="Payment terms, delivery notes, etc."
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
                        : supplier
                            ? "Update Supplier"
                            : "Create Supplier"}
                </Button>
            </div>
        </form>
    );
}
