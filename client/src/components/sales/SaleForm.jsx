import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash2 } from "lucide-react";

import { saleSchema } from "../../validators/saleSchema";
import { getProducts } from "../../services/productService";

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

export default function SaleForm({
    onSubmit,
    loading,
}) {
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [cartError, setCartError] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            customerName: "",
            paymentMethod: "CASH",
            remarks: "",
        },
    });

    const paymentMethod = watch("paymentMethod");

    useEffect(() => {
        async function loadProducts() {
            try {
                setProductsLoading(true);
                const response = await getProducts();
                const available = (response.data ?? []).filter(
                    (product) => product.isActive && product.stockQuantity > 0
                );
                setProducts(available);
            } catch (error) {
                console.error(error);
            } finally {
                setProductsLoading(false);
            }
        }

        loadProducts();
    }, []);

    const selectedProduct = useMemo(
        () => products.find(
            (product) => product.id === Number(selectedProductId)
        ),
        [products, selectedProductId]
    );

    const cartTotal = useMemo(
        () => cartItems.reduce(
            (sum, item) => sum + (item.unitPrice * item.quantity),
            0
        ),
        [cartItems]
    );

    function handleAddItem() {
        setCartError(null);

        if (!selectedProduct) {
            setCartError("Select a product to add.");
            return;
        }

        if (quantity < 1) {
            setCartError("Quantity must be at least 1.");
            return;
        }

        const existingItem = cartItems.find(
            (item) => item.productId === selectedProduct.id
        );
        const currentQuantity = existingItem?.quantity ?? 0;
        const newQuantity = currentQuantity + quantity;

        if (newQuantity > selectedProduct.stockQuantity) {
            setCartError(
                `Only ${selectedProduct.stockQuantity} ${selectedProduct.unit.toLowerCase()} available for ${selectedProduct.name}.`
            );
            return;
        }

        if (existingItem) {
            setCartItems((items) => items.map((item) =>
                item.productId === selectedProduct.id
                    ? { ...item, quantity: newQuantity }
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
                    unitPrice: Number(selectedProduct.sellingPrice),
                    maxStock: selectedProduct.stockQuantity,
                    quantity,
                },
            ]);
        }

        setSelectedProductId("");
        setQuantity(1);
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

                if (newQuantity > item.maxStock) {
                    setCartError(
                        `Cannot exceed available stock of ${item.maxStock}.`
                    );
                    return item;
                }

                return { ...item, quantity: newQuantity };
            })
            .filter(Boolean));
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
            setCartError("Add at least one product to the sale.");
            return;
        }

        await onSubmit({
            customerName: data.customerName?.trim() || undefined,
            paymentMethod: data.paymentMethod,
            remarks: data.remarks?.trim() || undefined,
            items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        });
    }

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6"
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Customer Name"
                    hint="Optional. Leave blank for walk-in customers."
                    error={errors.customerName?.message}
                >
                    <Input
                        {...register("customerName")}
                        placeholder="e.g. Maria Santos"
                    />
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
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="GCASH">GCash</SelectItem>
                            <SelectItem value="BANK_TRANSFER">
                                Bank Transfer
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
            </div>

            <Separator />

            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium">
                        Add Products
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Select products with available stock to add to this sale.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-2">
                        <Label>Product</Label>
                        <Select
                            value={selectedProductId}
                            onValueChange={setSelectedProductId}
                            disabled={productsLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={
                                        productsLoading
                                            ? "Loading products..."
                                            : products.length === 0
                                                ? "No products in stock"
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
                                        {product.name} — {formatCurrency(Number(product.sellingPrice))} ({product.stockQuantity} in stock)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <FormField label="Qty">
                        <Input
                            type="number"
                            min="1"
                            className="w-full sm:w-24"
                            value={quantity}
                            onChange={(event) =>
                                setQuantity(Number(event.target.value) || 1)
                            }
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
                        {selectedProduct.sku} · {formatCurrency(Number(selectedProduct.sellingPrice))} per {selectedProduct.unit.toLowerCase()} · {selectedProduct.stockQuantity} available
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
                                <TableHead className="text-right">
                                    Price
                                </TableHead>
                                <TableHead className="text-center">
                                    Qty
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

                                    <TableCell className="text-right tabular-nums">
                                        {formatCurrency(item.unitPrice)}
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

                                    <TableCell className="text-right tabular-nums font-medium">
                                        {formatCurrency(item.unitPrice * item.quantity)}
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
                    placeholder="Optional notes about this sale..."
                    {...register("remarks")}
                />
            </FormField>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="submit"
                    disabled={loading || cartItems.length === 0}
                >
                    {loading ? "Processing..." : "Complete Sale"}
                </Button>
            </div>
        </form>
    );
}
