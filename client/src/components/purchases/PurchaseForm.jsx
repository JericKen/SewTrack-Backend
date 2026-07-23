import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash2 } from "lucide-react";

import { purchaseSchema } from "../../validators/purchaseSchema";
import { getProducts } from "../../services/productService";
import { getSuppliers } from "../../services/supplierService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatCurrency } from "@/utils/currency";

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

export default function PurchaseForm({
    onSubmit,
    loading,
}) {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [suppliersLoading, setSuppliersLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [unitCost, setUnitCost] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [cartError, setCartError] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(purchaseSchema),
        defaultValues: {
            supplierId: "",
            remarks: "",
        },
    });

    const supplierId = watch("supplierId");

    useEffect(() => {
        async function loadProducts() {
            try {
                setProductsLoading(true);
                const response = await getProducts();
                const available = (response.data ?? []).filter(
                    (product) => product.isActive
                );
                setProducts(available);
            } catch (error) {
                console.error(error);
            } finally {
                setProductsLoading(false);
            }
        }

        async function loadSuppliers() {
            try {
                setSuppliersLoading(true);
                const response = await getSuppliers();
                setSuppliers(response.data ?? []);
            } catch (error) {
                console.error(error);
            } finally {
                setSuppliersLoading(false);
            }
        }

        loadProducts();
        loadSuppliers();
    }, []);

    const selectedProduct = useMemo(
        () => products.find(
            (product) => product.id === Number(selectedProductId)
        ),
        [products, selectedProductId]
    );

    const cartTotal = useMemo(
        () => cartItems.reduce(
            (sum, item) => sum + (item.unitCost * item.quantity),
            0
        ),
        [cartItems]
    );

    function handleProductChange(productId) {
        setSelectedProductId(productId);

        const product = products.find(
            (item) => item.id === Number(productId)
        );

        if (product) {
            setUnitCost(Number(product.costPrice).toString());
        } else {
            setUnitCost("");
        }
    }

    function handleAddItem() {
        setCartError(null);

        if (!selectedProduct) {
            setCartError("Select a product to add.");
            return;
        }

        const parsedQuantity = Number(quantity);
        const parsedUnitCost = Number(unitCost);

        if (parsedQuantity < 1) {
            setCartError("Quantity must be at least 1.");
            return;
        }

        if (!parsedUnitCost || parsedUnitCost <= 0) {
            setCartError("Unit cost must be greater than 0.");
            return;
        }

        const existingItem = cartItems.find(
            (item) => item.productId === selectedProduct.id
        );

        if (existingItem) {
            setCartItems((items) => items.map((item) =>
                item.productId === selectedProduct.id
                    ? {
                        ...item,
                        quantity: item.quantity + parsedQuantity,
                        unitCost: parsedUnitCost,
                    }
                    : item
            ));
        } else {
            setCartItems((items) => [
                ...items,
                {
                    productId: selectedProduct.id,
                    name: selectedProduct.name,
                    sku: selectedProduct.sku,
                    unit: selectedProduct.unit,
                    unitCost: parsedUnitCost,
                    quantity: parsedQuantity,
                },
            ]);
        }

        setSelectedProductId("");
        setQuantity(1);
        setUnitCost("");
    }

    function handleUpdateQuantity(productId, delta) {
        setCartError(null);

        setCartItems((items) => items
            .map((item) => {
                if (item.productId !== productId) {
                    return item;
                }

                const newQuantity = item.quantity + delta;

                if (newQuantity <= 0) {
                    return null;
                }

                return { ...item, quantity: newQuantity };
            })
            .filter(Boolean));
    }

    function handleUpdateUnitCost(productId, value) {
        setCartError(null);

        setCartItems((items) => items.map((item) =>
            item.productId === productId
                ? { ...item, unitCost: Number(value) || 0 }
                : item
        ));
    }

    function handleRemoveItem(productId) {
        setCartError(null);
        setCartItems((items) => items.filter(
            (item) => item.productId !== productId
        ));
    }

    async function handleFormSubmit(data) {
        setCartError(null);

        if (cartItems.length === 0) {
            setCartError("Add at least one product to the purchase.");
            return;
        }

        const invalidItem = cartItems.find(
            (item) => !item.unitCost || item.unitCost <= 0
        );

        if (invalidItem) {
            setCartError("Each item must have a unit cost greater than 0.");
            return;
        }

        await onSubmit({
            supplierId: data.supplierId
                ? Number(data.supplierId)
                : undefined,
            remarks: data.remarks?.trim() || undefined,
            items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitCost: item.unitCost,
            })),
        });
    }

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6"
        >
            <FormField
                label="Supplier"
                hint="Optional. Link this purchase to a supplier."
                error={errors.supplierId?.message}
            >
                <Select
                    value={supplierId}
                    onValueChange={(value) =>
                        setValue("supplierId", value, {
                            shouldValidate: true,
                        })
                    }
                    disabled={suppliersLoading}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue
                            placeholder={
                                suppliersLoading
                                    ? "Loading suppliers..."
                                    : suppliers.length === 0
                                        ? "No suppliers available"
                                        : "Select supplier (optional)"
                            }
                        />
                    </SelectTrigger>

                    <SelectContent>
                        {suppliers.map((supplier) => (
                            <SelectItem
                                key={supplier.id}
                                value={supplier.id.toString()}
                            >
                                {supplier.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <Separator />

            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium">
                        Add Products
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Select products and enter the quantity and unit cost.
                    </p>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                    <div className="flex-1 space-y-2">
                        <Label>Product</Label>
                        <Select
                            value={selectedProductId}
                            onValueChange={handleProductChange}
                            disabled={productsLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={
                                        productsLoading
                                            ? "Loading products..."
                                            : products.length === 0
                                                ? "No products available"
                                                : "Select product"
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem
                                        key={product.id}
                                        value={product.id.toString()}
                                    >
                                        {product.name} — {formatCurrency(Number(product.costPrice))} cost
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <FormField label="Qty">
                        <Input
                            type="number"
                            min="1"
                            className="w-full lg:w-24"
                            value={quantity}
                            onChange={(event) =>
                                setQuantity(Number(event.target.value) || 1)
                            }
                        />
                    </FormField>

                    <FormField label="Unit Cost">
                        <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            className="w-full lg:w-32"
                            value={unitCost}
                            onChange={(event) => setUnitCost(event.target.value)}
                            placeholder="0.00"
                        />
                    </FormField>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleAddItem}
                        disabled={!selectedProductId}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                    </Button>
                </div>

                {selectedProduct && (
                    <p className="text-xs text-muted-foreground">
                        {selectedProduct.sku} · Default cost {formatCurrency(Number(selectedProduct.costPrice))} per {selectedProduct.unit.toLowerCase()}
                    </p>
                )}
            </div>

            {cartError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {cartError}
                </div>
            )}

            {cartItems.length > 0 && (
                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">
                                    Qty
                                </TableHead>
                                <TableHead className="text-right">
                                    Unit Cost
                                </TableHead>
                                <TableHead className="text-right">
                                    Subtotal
                                </TableHead>
                                <TableHead className="w-12" />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {cartItems.map((item) => (
                                <TableRow key={item.productId}>
                                    <TableCell>
                                        <div className="font-medium">
                                            {item.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {item.sku}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon-sm"
                                                onClick={() =>
                                                    handleUpdateQuantity(item.productId, -1)
                                                }
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>

                                            <span className="w-8 text-center tabular-nums">
                                                {item.quantity}
                                            </span>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon-sm"
                                                onClick={() =>
                                                    handleUpdateQuantity(item.productId, 1)
                                                }
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            className="ml-auto w-28 text-right tabular-nums"
                                            value={item.unitCost}
                                            onChange={(event) =>
                                                handleUpdateUnitCost(
                                                    item.productId,
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </TableCell>

                                    <TableCell className="text-right tabular-nums font-medium">
                                        {formatCurrency(item.unitCost * item.quantity)}
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() =>
                                                handleRemoveItem(item.productId)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={3}
                                    className="text-right font-medium"
                                >
                                    Total
                                </TableCell>
                                <TableCell className="text-right text-base font-semibold tabular-nums">
                                    {formatCurrency(cartTotal)}
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            )}

            <FormField
                label="Remarks"
                error={errors.remarks?.message}
            >
                <Textarea
                    rows={2}
                    placeholder="Optional notes about this purchase..."
                    {...register("remarks")}
                />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="submit"
                    disabled={loading || cartItems.length === 0}
                >
                    {loading ? "Saving..." : "Record Purchase"}
                </Button>
            </div>
        </form>
    );
}
