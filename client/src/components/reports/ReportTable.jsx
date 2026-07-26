import {
    BarChart3,
    Package,
    Receipt,
    ShoppingCart,
    Wrench,
} from "lucide-react";

import {
    EXPENSE_CATEGORY_LABELS,
    PAYMENT_METHOD_LABELS,
} from "../../validators/expenseSchema";
import { REPAIR_STATUS_LABELS } from "../../validators/repairOrderSchema";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { formatCurrency } from "@/utils/currency";
import { formatDate, formatDateTime } from "@/utils/date";

const PAYMENT_LABELS = PAYMENT_METHOD_LABELS;

function InventoryStatusBadge({ status }) {
    if (status === "OUT_OF_STOCK") {
        return <Badge variant="destructive">Out of stock</Badge>;
    }

    if (status === "LOW_STOCK") {
        return (
            <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400">
                Low stock
            </Badge>
        );
    }

    return <Badge variant="secondary">In stock</Badge>;
}

function RepairStatusBadge({ status }) {
    const label = REPAIR_STATUS_LABELS[status] ?? status;

    if (status === "COMPLETED") {
        return <Badge variant="secondary">{label}</Badge>;
    }

    if (status === "CANCELLED") {
        return <Badge variant="destructive">{label}</Badge>;
    }

    if (status === "READY_FOR_PICKUP") {
        return <Badge>{label}</Badge>;
    }

    return <Badge variant="outline">{label}</Badge>;
}

function ReportTableSkeleton({ columns }) {
    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: columns }).map((_, index) => (
                            <TableHead key={index}>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: 6 }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: columns }).map((__, cellIndex) => (
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

function EmptyState({ icon: Icon, title, description }) {
    return (
        <div className="rounded-xl border border-dashed py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

function SalesReportTable({ rows }) {
    if (rows.length === 0) {
        return (
            <EmptyState
                icon={ShoppingCart}
                title="No sales in this range"
                description="Try widening the date range or recording new sales."
            />
        );
    }

    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((sale) => (
                        <TableRow key={sale.id}>
                            <TableCell className="font-medium">
                                {sale.invoiceNo}
                            </TableCell>
                            <TableCell>{sale.customerName ?? "—"}</TableCell>
                            <TableCell>
                                {PAYMENT_LABELS[sale.paymentMethod] ?? sale.paymentMethod}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                                {sale.items?.length ?? 0}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                                {formatCurrency(Number(sale.totalAmount))}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {formatDateTime(sale.createdAt)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function ExpenseReportTable({ rows }) {
    if (rows.length === 0) {
        return (
            <EmptyState
                icon={Receipt}
                title="No expenses in this range"
                description="Adjust filters or log expenses to see them here."
            />
        );
    }

    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell className="text-muted-foreground">
                                {formatDate(expense.expenseDate)}
                            </TableCell>
                            <TableCell>
                                {EXPENSE_CATEGORY_LABELS[expense.category] ?? expense.category}
                            </TableCell>
                            <TableCell className="max-w-[240px] truncate">
                                {expense.description}
                            </TableCell>
                            <TableCell>
                                {PAYMENT_LABELS[expense.paymentMethod] ?? expense.paymentMethod}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                                {formatCurrency(Number(expense.amount))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function InventoryReportTable({ rows }) {
    if (rows.length === 0) {
        return (
            <EmptyState
                icon={Package}
                title="No products match these filters"
                description="Change category or stock status to see inventory rows."
            />
        );
    }

    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Minimum</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-mono text-xs">
                                {product.sku}
                            </TableCell>
                            <TableCell className="font-medium">
                                {product.product}
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell className="text-right tabular-nums">
                                {product.stockQuantity}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                                {product.minimumStock}
                            </TableCell>
                            <TableCell>{product.unit}</TableCell>
                            <TableCell>
                                <InventoryStatusBadge status={product.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function RepairReportTable({ rows }) {
    if (rows.length === 0) {
        return (
            <EmptyState
                icon={Wrench}
                title="No repairs in this range"
                description="Try a different date range or repair status."
            />
        );
    }

    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Repair #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead className="text-right">Total cost</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((repair) => (
                        <TableRow key={repair.id}>
                            <TableCell className="font-medium">
                                {repair.repairNo}
                            </TableCell>
                            <TableCell>{repair.customer ?? "—"}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                                {repair.itemName}
                            </TableCell>
                            <TableCell>
                                <RepairStatusBadge status={repair.status} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {formatDate(repair.receivedAt)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                                {repair.totalCost != null
                                    ? formatCurrency(Number(repair.totalCost))
                                    : "—"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

const TABLE_COLUMNS = {
    sales: 6,
    expenses: 5,
    inventory: 7,
    repairs: 6,
};

export default function ReportTable({
    reportType,
    rows = [],
    loading,
}) {
    if (reportType === "profit") {
        if (loading) {
            return null;
        }

        return (
            <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center">
                <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">
                    Profit & loss summary
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Use the cards above for sales, expenses, and net profit in the
                    selected date range. There is no line-item table for this report.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <ReportTableSkeleton
                columns={TABLE_COLUMNS[reportType] ?? 5}
            />
        );
    }

    if (reportType === "sales") {
        return <SalesReportTable rows={rows} />;
    }

    if (reportType === "expenses") {
        return <ExpenseReportTable rows={rows} />;
    }

    if (reportType === "inventory") {
        return <InventoryReportTable rows={rows} />;
    }

    if (reportType === "repairs") {
        return <RepairReportTable rows={rows} />;
    }

    return null;
}
