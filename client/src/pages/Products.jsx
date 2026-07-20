import { useEffect, useMemo, useState } from "react";

import {
    AlertTriangle,
    Boxes,
    Package,
} from "lucide-react";

import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import ProductToolbar from "../components/products/ProductToolbar";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService";

import { formatCurrency } from "../utils/currency";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    TooltipProvider,
} from "@/components/ui/tooltip";

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}) {
    return (
        <Card size="sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-0">
                <div className="space-y-1">
                    <CardDescription>{title}</CardDescription>
                    <CardTitle className="text-2xl tabular-nums">
                        {value}
                    </CardTitle>
                    {description && (
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
        </Card>
    );
}

export default function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    async function loadProducts() {
        try {
            setLoading(true);

            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return products;
        }

        return products.filter((product) =>
            product.name.toLowerCase().includes(query)
            || product.sku.toLowerCase().includes(query)
            || product.category?.name?.toLowerCase().includes(query)
        );
    }, [products, search]);

    const stats = useMemo(() => {
        const lowStockCount = products.filter(
            (product) => product.stockQuantity <= product.minimumStock
        ).length;

        const totalUnits = products.reduce(
            (sum, product) => sum + product.stockQuantity,
            0
        );

        const inventoryValue = products.reduce(
            (sum, product) =>
                sum + (Number(product.sellingPrice) * product.stockQuantity),
            0
        );

        return {
            total: products.length,
            lowStockCount,
            totalUnits,
            inventoryValue,
        };
    }, [products]);

    function handleOpenCreate() {
        setEditingProduct(null);
        setSubmitError(null);
        setOpen(true);
    }

    function handleOpenEdit(product) {
        setEditingProduct(product);
        setSubmitError(null);
        setOpen(true);
    }

    function handleDialogChange(isOpen) {
        setOpen(isOpen);

        if (!isOpen) {
            setEditingProduct(null);
            setSubmitError(null);
        }
    }

    async function handleSubmitProduct(data) {
        try {
            setSaving(true);
            setSubmitError(null);

            if (editingProduct) {
                await updateProduct(editingProduct.id, data);
            } else {
                await createProduct(data);
            }

            setOpen(false);
            setEditingProduct(null);
            await loadProducts();
        } catch (error) {
            console.error(error);

            setSubmitError(
                error.response?.data?.message
                    ?? "Failed to save product. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteProduct() {
        if (!deleteTarget) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError(null);

            await deleteProduct(deleteTarget.id);

            setDeleteTarget(null);
            await loadProducts();
        } catch (error) {
            console.error(error);

            setDeleteError(
                error.response?.data?.message
                    ?? "Failed to delete product. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    }

    const showEmptyCreateState = !loading
        && products.length === 0
        && !search.trim();

    const showFilteredEmptyState = !loading
        && products.length > 0
        && filteredProducts.length === 0;

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div>
                    <p className="mt-1 text-muted-foreground">
                        Manage your catalog, pricing, and stock levels.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Products"
                        value={stats.total}
                        description="Active items in catalog"
                        icon={Package}
                    />

                    <StatCard
                        title="Low Stock"
                        value={stats.lowStockCount}
                        description="At or below minimum level"
                        icon={AlertTriangle}
                    />

                    <StatCard
                        title="Total Units"
                        value={stats.totalUnits.toLocaleString()}
                        description="Combined stock on hand"
                        icon={Boxes}
                    />

                    <StatCard
                        title="Inventory Value"
                        value={formatCurrency(stats.inventoryValue)}
                        description="Based on selling price"
                        icon={Package}
                    />
                </div>

                <ProductToolbar
                    search={search}
                    setSearch={setSearch}
                    onAdd={handleOpenCreate}
                    resultCount={filteredProducts.length}
                    totalCount={products.length}
                />

                {showFilteredEmptyState ? (
                    <div className="rounded-xl border border-dashed py-16 text-center">
                        <h3 className="text-lg font-semibold">
                            No matching products
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                            No products match &ldquo;{search}&rdquo;. Try a
                            different search term.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => setSearch("")}
                        >
                            Clear search
                        </Button>
                    </div>
                ) : (
                    <ProductTable
                        products={filteredProducts}
                        loading={loading}
                        onEdit={handleOpenEdit}
                        onDelete={(product) => {
                            setDeleteError(null);
                            setDeleteTarget(product);
                        }}
                        onAdd={showEmptyCreateState ? handleOpenCreate : undefined}
                    />
                )}

                <Dialog
                    open={open}
                    onOpenChange={handleDialogChange}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProduct
                                    ? "Edit Product"
                                    : "Add Product"}
                            </DialogTitle>

                            <DialogDescription>
                                {editingProduct
                                    ? "Update product details and inventory settings."
                                    : "Add a new product to your catalog."}
                            </DialogDescription>
                        </DialogHeader>

                        {submitError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {submitError}
                            </div>
                        )}

                        <ProductForm
                            key={editingProduct?.id ?? "new"}
                            product={editingProduct}
                            loading={saving}
                            onSubmit={handleSubmitProduct}
                        />
                    </DialogContent>
                </Dialog>

                <AlertDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setDeleteTarget(null);
                            setDeleteError(null);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete product?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will permanently remove{" "}
                                <span className="font-medium text-foreground">
                                    {deleteTarget?.name}
                                </span>{" "}
                                ({deleteTarget?.sku}) from your catalog. This
                                action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {deleteError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {deleteError}
                            </div>
                        )}

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleting}>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                variant="destructive"
                                disabled={deleting}
                                onClick={handleDeleteProduct}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </TooltipProvider>
    );
}
