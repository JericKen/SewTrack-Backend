import {
    Package,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatCurrency } from "@/utils/currency";

const TYPE_LABELS = {
    RESALE: "Resale",
    MANUFACTURED: "Manufactured",
    MATERIAL: "Material",
};

function StockBadge({ quantity, minimumStock }) {
    const isLow = quantity <= minimumStock;
    const isEmpty = quantity === 0;

    if (isEmpty) {
        return (
            <Badge variant="destructive">
                Out of Stock
            </Badge>
        );
    }

    if (isLow) {
        return (
            <Badge variant="destructive">
                Low Stock
            </Badge>
        );
    }

    return (
        <Badge variant="secondary">
            In Stock
        </Badge>
    );
}

function ProductTableSkeleton() {
    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <TableHead key={index}>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: 7 }).map((__, cellIndex) => (
                                <TableCell key={cellIndex}>
                                    <Skeleton className="h-4 w-full max-w-[120px]" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default function ProductTable({
    products,
    loading = false,
    onEdit,
    onDelete,
    onAdd,
}) {
    if (loading) {
        return <ProductTableSkeleton />;
    }

    if (products.length === 0) {
        return (
            <div className="rounded-xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Package className="h-6 w-6 text-foreground/60" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    No products found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/75">
                    {onAdd
                        ? "Get started by adding your first product to track inventory and sales."
                        : "Try adjusting your search to find what you are looking for."}
                </p>

                {onAdd && (
                    <Button
                        className="mt-6"
                        onClick={onAdd}
                    >
                        Add Product
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">
                            Price
                        </TableHead>
                        <TableHead className="text-center">
                            Stock
                        </TableHead>
                        <TableHead className="text-center">
                            Status
                        </TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {products.map((product) => (
                        <TableRow
                            key={product.id}
                            className="group"
                        >
                            <TableCell>
                                <div className="font-medium">
                                    {product.name}
                                </div>

                                {product.unit && (
                                    <div className="text-xs text-foreground/70">
                                        per {product.unit.toLowerCase()}
                                    </div>
                                )}
                            </TableCell>

                            <TableCell className="font-mono text-xs text-foreground/75">
                                {product.sku}
                            </TableCell>

                            <TableCell className="text-foreground/90">
                                {product.category?.name ?? "—"}
                            </TableCell>

                            <TableCell>
                                <Badge variant="outline">
                                    {TYPE_LABELS[product.type] ?? product.type}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-right tabular-nums">
                                {formatCurrency(Number(product.sellingPrice))}
                            </TableCell>

                            <TableCell className="text-center tabular-nums">
                                <span
                                    className={
                                        product.stockQuantity <= product.minimumStock
                                            ? "font-medium text-destructive"
                                            : undefined
                                    }
                                >
                                    {product.stockQuantity}
                                </span>
                            </TableCell>

                            <TableCell className="text-center">
                                <StockBadge
                                    quantity={product.stockQuantity}
                                    minimumStock={product.minimumStock}
                                />
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onEdit(product)}
                                                />
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Edit product
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onDelete(product)}
                                                />
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Delete product
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
