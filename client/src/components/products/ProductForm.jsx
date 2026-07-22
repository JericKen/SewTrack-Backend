import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productSchema } from "../../validators/productSchema";
import { getCategories } from "../../services/categoryService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

export default function ProductForm({
    product,
    onSubmit,
    loading,
}) {
    const [categories, setCategories] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: product
            ? {
                name: product.name,
                categoryId: product.categoryId,
                type: product.type,
                unit: product.unit,
                costPrice: Number(product.costPrice),
                sellingPrice: Number(product.sellingPrice),
                stockQuantity: product.stockQuantity,
                minimumStock: product.minimumStock,
                description: product.description ?? "",
            }
            : {
                name: "",
                categoryId: undefined,
                type: "",
                unit: "",
                costPrice: undefined,
                sellingPrice: undefined,
                stockQuantity: 0,
                minimumStock: 5,
                description: "",
            },
    });

    const categoryId = watch("categoryId");
    const type = watch("type");
    const unit = watch("unit");

    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await getCategories();
                setCategories(response.data ?? []);
            } catch (error) {
                console.error(error);
            }
        }

        loadCategories();
    }, []);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <div className="grid gap-3 sm:grid-cols-3">
                <FormField
                    label="Product Name"
                    error={errors.name?.message}
                    className="space-y-1 sm:col-span-2"
                >
                    <Input
                        {...register("name")}
                        placeholder="e.g. Denim Jacket"
                    />
                </FormField>

                {product?.sku && (
                    <FormField label="SKU">
                        <Input
                            value={product.sku}
                            disabled
                            className="font-mono text-foreground/75"
                        />
                    </FormField>
                )}

                <FormField
                    label="Category"
                    error={errors.categoryId?.message}
                >
                    <Select
                        value={categoryId != null ? String(categoryId) : ""}
                        onValueChange={(value) =>
                            setValue("categoryId", Number(value), {
                                shouldValidate: true,
                            })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>

                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>

                <FormField
                    label="Type"
                    error={errors.type?.message}
                >
                    <Select
                        value={type ?? ""}
                        onValueChange={(value) =>
                            setValue("type", value, { shouldValidate: true })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="RESALE">Resale</SelectItem>
                            <SelectItem value="MANUFACTURED">
                                Manufactured
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>

                <FormField
                    label="Unit"
                    error={errors.unit?.message}
                >
                    <Select
                        value={unit ?? ""}
                        onValueChange={(value) =>
                            setValue("unit", value, { shouldValidate: true })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="PCS">Pieces (PCS)</SelectItem>
                            <SelectItem value="PAIR">Pair</SelectItem>
                            <SelectItem value="PACK">Pack</SelectItem>
                            <SelectItem value="ROLL">Roll</SelectItem>
                            <SelectItem value="METER">Meter</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>

                <FormField
                    label="Cost Price"
                    error={errors.costPrice?.message}
                >
                    <div className="relative">
                        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-foreground/60">
                            ₱
                        </span>
                        <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            {...register("costPrice", {
                                valueAsNumber: true,
                            })}
                        />
                    </div>
                </FormField>

                <FormField
                    label="Selling Price"
                    error={errors.sellingPrice?.message}
                >
                    <div className="relative">
                        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-foreground/60">
                            ₱
                        </span>
                        <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            {...register("sellingPrice", {
                                valueAsNumber: true,
                            })}
                        />
                    </div>
                </FormField>

                <FormField
                    label={product ? "Stock" : "Initial Stock"}
                    error={errors.stockQuantity?.message}
                >
                    <Input
                        type="number"
                        min="0"
                        {...register("stockQuantity", {
                            valueAsNumber: true,
                        })}
                    />
                </FormField>

                <FormField
                    label="Min Stock"
                    error={errors.minimumStock?.message}
                >
                    <Input
                        type="number"
                        min="0"
                        {...register("minimumStock", {
                            valueAsNumber: true,
                        })}
                    />
                </FormField>

                <FormField
                    label="Description"
                    error={errors.description?.message}
                    className="space-y-1 sm:col-span-3"
                >
                    <Input
                        placeholder="Optional notes..."
                        {...register("description")}
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
                        : product
                            ? "Update Product"
                            : "Create Product"}
                </Button>
            </div>
        </form>
    );
}
