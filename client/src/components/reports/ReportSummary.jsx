import {
    Package,
    PhilippinePeso,
    Receipt,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Wrench,
} from "lucide-react";

import { formatCurrency } from "@/utils/currency";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SummaryStatCard({
    title,
    value,
    description,
    icon: Icon,
    valueClassName,
}) {
    return (
        <Card size="sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-0">
                <div className="space-y-1">
                    <CardDescription>{title}</CardDescription>
                    <CardTitle
                        className={`text-2xl tabular-nums ${valueClassName ?? ""}`}
                    >
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

function SummarySkeleton({ count = 3 }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} className="h-28 rounded-xl" />
            ))}
        </div>
    );
}

export default function ReportSummary({
    reportType,
    summary,
    loading,
}) {
    if (loading) {
        const count = reportType === "inventory" || reportType === "repairs"
            ? 4
            : reportType === "profit"
                ? 3
                : 3;

        return <SummarySkeleton count={count} />;
    }

    if (!summary) {
        return null;
    }

    if (reportType === "sales") {
        return (
            <div className="grid gap-4 sm:grid-cols-3">
                <SummaryStatCard
                    title="Total sales"
                    value={formatCurrency(Number(summary.totalSales ?? 0))}
                    description="Gross revenue in range"
                    icon={ShoppingCart}
                />
                <SummaryStatCard
                    title="Transactions"
                    value={Number(summary.totalTransactions ?? 0).toLocaleString()}
                    description="Sales recorded"
                    icon={Receipt}
                />
                <SummaryStatCard
                    title="Average sale"
                    value={formatCurrency(Number(summary.averageSale ?? 0))}
                    description="Per transaction"
                    icon={PhilippinePeso}
                />
            </div>
        );
    }

    if (reportType === "expenses") {
        return (
            <div className="grid gap-4 sm:grid-cols-3">
                <SummaryStatCard
                    title="Total expenses"
                    value={formatCurrency(Number(summary.totalExpenses ?? 0))}
                    description="Spending in range"
                    icon={Receipt}
                />
                <SummaryStatCard
                    title="Transactions"
                    value={Number(summary.totalTransactions ?? 0).toLocaleString()}
                    description="Expenses logged"
                    icon={TrendingDown}
                />
                <SummaryStatCard
                    title="Average expense"
                    value={formatCurrency(Number(summary.averageExpense ?? 0))}
                    description="Per entry"
                    icon={PhilippinePeso}
                />
            </div>
        );
    }

    if (reportType === "profit") {
        const profit = Number(summary.profit ?? 0);
        const profitClassName = profit >= 0
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-destructive";

        return (
            <div className="grid gap-4 sm:grid-cols-3">
                <SummaryStatCard
                    title="Sales"
                    value={formatCurrency(Number(summary.sales ?? 0))}
                    description="Revenue in range"
                    icon={ShoppingCart}
                />
                <SummaryStatCard
                    title="Expenses"
                    value={formatCurrency(Number(summary.expenses ?? 0))}
                    description="Spending in range"
                    icon={Receipt}
                />
                <SummaryStatCard
                    title="Net profit"
                    value={formatCurrency(profit)}
                    description="Sales minus expenses"
                    icon={TrendingUp}
                    valueClassName={profitClassName}
                />
            </div>
        );
    }

    if (reportType === "inventory") {
        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryStatCard
                    title="Products"
                    value={Number(summary.totalProducts ?? 0).toLocaleString()}
                    description="Active SKUs"
                    icon={Package}
                />
                <SummaryStatCard
                    title="In stock"
                    value={Number(summary.inStock ?? 0).toLocaleString()}
                    description="Healthy levels"
                    icon={Package}
                />
                <SummaryStatCard
                    title="Low stock"
                    value={Number(summary.lowStock ?? 0).toLocaleString()}
                    description="At or below minimum"
                    icon={Package}
                    valueClassName="text-amber-700 dark:text-amber-400"
                />
                <SummaryStatCard
                    title="Out of stock"
                    value={Number(summary.outOfStock ?? 0).toLocaleString()}
                    description="Needs restock"
                    icon={Package}
                    valueClassName="text-destructive"
                />
            </div>
        );
    }

    if (reportType === "repairs") {
        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <SummaryStatCard
                    title="Total repairs"
                    value={Number(summary.totalRepairs ?? 0).toLocaleString()}
                    description="Orders in range"
                    icon={Wrench}
                />
                <SummaryStatCard
                    title="Open queue"
                    value={(
                        Number(summary.pending ?? 0)
                        + Number(summary.inProgress ?? 0)
                        + Number(summary.readyForPickup ?? 0)
                    ).toLocaleString()}
                    description="Pending, in progress, ready"
                    icon={Wrench}
                />
                <SummaryStatCard
                    title="Completed"
                    value={Number(summary.completed ?? 0).toLocaleString()}
                    description="Finished in range"
                    icon={Wrench}
                />
            </div>
        );
    }

    return null;
}
