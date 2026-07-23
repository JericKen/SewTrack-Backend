import {
    Eye,
    Package,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatCurrency } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";

function PurchaseTableSkeleton() {
    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <TableHead key={index}>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: 6 }).map((__, cellIndex) => (
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

export default function PurchaseTable({
    purchases,
    loading = false,
    onView,
    onAdd,
}) {
    if (loading) {
        return <PurchaseTableSkeleton />;
    }

    if (purchases.length === 0) {
        return (
            <div className="rounded-xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Package className="h-6 w-6 text-muted-foreground" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    No purchases found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    {onAdd
                        ? "Record your first purchase to restock inventory."
                        : "Try adjusting your search."}
                </p>

                {onAdd && (
                    <Button
                        className="mt-6"
                        onClick={onAdd}
                    >
                        New Purchase
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
                        <TableHead>Reference</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead className="text-center">
                            Items
                        </TableHead>
                        <TableHead className="text-right">
                            Total
                        </TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {purchases.map((purchase) => (
                        <TableRow
                            key={purchase.id}
                            className="group"
                        >
                            <TableCell className="font-mono text-xs">
                                {purchase.referenceNo ?? `#${purchase.id}`}
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                                {formatDateTime(purchase.purchasedAt)}
                            </TableCell>

                            <TableCell>
                                {purchase.supplier?.name ?? (
                                    <span className="text-muted-foreground">
                                        No supplier
                                    </span>
                                )}
                            </TableCell>

                            <TableCell className="text-center tabular-nums">
                                {purchase.items?.length ?? 0}
                            </TableCell>

                            <TableCell className="text-right tabular-nums font-medium">
                                {formatCurrency(Number(purchase.totalAmount))}
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onView(purchase)}
                                                />
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            View details
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
