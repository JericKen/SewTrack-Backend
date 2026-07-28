import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { categorySchema } from "../../validators/categorySchema";

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

function buildDefaultValues(category) {
    if (!category) {
        return {
            code: "",
            name: "",
            description: "",
        };
    }

    return {
        code: category.code ?? "",
        name: category.name ?? "",
        description: category.description ?? "",
    };
}

export default function CategoryForm({
    category,
    onSubmit,
    loading,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: buildDefaultValues(category),
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                    label="Category Code"
                    error={errors.code?.message}
                >
                    <Input
                        {...register("code")}
                        placeholder="e.g. BED"
                        className="uppercase"
                        maxLength={5}
                    />
                </FormField>

                <FormField
                    label="Category Name"
                    error={errors.name?.message}
                >
                    <Input
                        {...register("name")}
                        placeholder="e.g. Bedsheets"
                    />
                </FormField>

                <FormField
                    label="Description"
                    error={errors.description?.message}
                    className="space-y-1 sm:col-span-2"
                >
                    <Textarea
                        rows={3}
                        placeholder="Optional notes about this category"
                        {...register("description")}
                    />
                </FormField>
            </div>

            <p className="text-xs text-foreground/70">
                Codes are used as SKU prefixes when adding products.
            </p>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : category
                            ? "Update Category"
                            : "Create Category"}
                </Button>
            </div>
        </form>
    );
}
