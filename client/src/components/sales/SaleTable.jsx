import {
    Eye,
    ShoppingCart,
    Ban,
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
import { formatDateTime } from "@/utils/date";

const PAYMENT_LABELS = {
    CASH: "Cash",
    GCASH: "GCash",
    BANK_TRANSFER: "Bank Transfer",
};

function StatusBadge({ status }) {
    if (status === "VOIDED") {
        return (
            <Badge variant="destructive">
                Voided
            </Badge>
        );
    }

    return (
        <Badge variant="secondary">
            Completed
        </Badge>
    );
}

function SaleTableSkeleton() {
    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <TableHead key={index}>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: 8 }).map((__, cellIndex) => (
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

export default function SaleTable({
    sales,
    loading = false,
    onView,
    onVoid,
    onAdd,
}) {
    if (loading) {
        return <SaleTableSkeleton />;
    }

    if (sales.length === 0) {
        return (
            <div className="rounded-xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    No sales found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    {onAdd
                        ? "Record your first sale to start tracking revenue."
                        : "Try adjusting your search or filters."}
                </p>

                {onAdd && (
                    <Button
                        className="mt-6"
                        onClick={onAdd}
                    >
                        New Sale
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
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-center">
                            Items
                        </TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">
                            Total
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
                    {sales.map((sale) => (
                        <TableRow
                            key={sale.id}
                            className="group"
                        >
                            <TableCell className="font-mono text-xs">
                                {sale.invoiceNo}
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                                {formatDateTime(sale.createdAt)}
                            </TableCell>

                            <TableCell>
                                {sale.customerName || (
                                    <span className="text-muted-foreground">
                                        Walk-in
                                    </span>
                                )}
                            </TableCell>

                            <TableCell className="text-center tabular-nums">
                                {sale.items?.length ?? 0}
                            </TableCell>

                            <TableCell>
                                <Badge variant="outline">
                                    {PAYMENT_LABELS[sale.paymentMethod]
                                        ?? sale.paymentMethod}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-right tabular-nums font-medium">
                                {formatCurrency(Number(sale.totalAmount))}
                            </TableCell>

                            <TableCell className="text-center">
                                <StatusBadge status={sale.status} />
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onView(sale)}
                                                />
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            View details
                                        </TooltipContent>
                                    </Tooltip>

                                    {sale.status === "COMPLETED" && (
                                        <Tooltip>
                                            <TooltipTrigger
                                                render={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => onVoid(sale)}
                                                    />
                                                }
                                            >
                                                <Ban className="h-4 w-4 text-destructive" />
                                            </TooltipTrigger>

                                            <TooltipContent>
                                                Void sale
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
