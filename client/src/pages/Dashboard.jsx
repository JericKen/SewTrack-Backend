import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Package,
    PhilippinePeso,
    Receipt,
    ShoppingCart,
    TrendingUp,
    Users,
    Wallet,
    Wrench,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../services/dashboardService";
import { formatCurrency } from "../utils/currency";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({
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

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-28 rounded-xl" />
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Skeleton className="h-56 rounded-xl" />
                <Skeleton className="h-56 rounded-xl" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
            </div>
        </div>
    );
}

function MetricRow({ label, value, muted }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span
                className={`text-sm font-medium tabular-nums ${muted ? "text-muted-foreground" : ""}`}
            >
                {value}
            </span>
        </div>
    );
}

function RepairPipelineRow({ label, count, variant }) {
    return (
        <div className="flex items-center justify-between gap-3 py-2.5">
            <span className="text-sm">{label}</span>
            <Badge variant={variant}>{count}</Badge>
        </div>
    );
}

const QUICK_ACTIONS = [
    {
        title: "Record sale",
        description: "Add a new sales transaction",
        to: "/sales",
        icon: ShoppingCart,
    },
    {
        title: "Add expense",
        description: "Log business spending",
        to: "/expenses",
        icon: Receipt,
    },
    {
        title: "New repair",
        description: "Create a repair order",
        to: "/repairs",
        icon: Wrench,
    },
    {
        title: "Products",
        description: "Manage catalog and stock",
        to: "/products",
        icon: Package,
    },
];

export default function Dashboard() {
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDashboard = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);

            const response = await getDashboard();
            setDashboard(response.data ?? null);
        } catch (loadError) {
            console.error(loadError);
            setError(
                loadError.response?.data?.message
                    ?? "Could not load dashboard. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const todayLabel = useMemo(
        () => new Intl.DateTimeFormat("en-PH", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(new Date()),
        []
    );

    const greeting = useMemo(() => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return "Good morning";
        }

        if (hour < 17) {
            return "Good afternoon";
        }

        return "Good evening";
    }, []);

    const profitClassName = useMemo(() => {
        if (!dashboard) {
            return "";
        }

        return dashboard.profit.month >= 0
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-destructive";
    }, [dashboard]);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error || !dashboard) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-card p-12 text-center">
                <p className="max-w-md text-sm text-muted-foreground">
                    {error ?? "Dashboard data is unavailable."}
                </p>
                <Button onClick={loadDashboard}>Try again</Button>
            </div>
        );
    }

    const {
        sales,
        expenses,
        profit,
        customers,
        inventory,
        repairs,
    } = dashboard;

    const repairTotal = repairs.pending
        + repairs.inProgress
        + repairs.readyForPickup;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                    {greeting}
                    {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Business overview for {todayLabel}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Today's sales"
                    value={formatCurrency(sales.today)}
                    description="Revenue recorded today"
                    icon={ShoppingCart}
                />

                <StatCard
                    title="Today's expenses"
                    value={formatCurrency(expenses.today)}
                    description="Spending logged today"
                    icon={Receipt}
                />

                <StatCard
                    title="Monthly profit"
                    value={formatCurrency(profit.month)}
                    description="Sales minus expenses this month"
                    icon={TrendingUp}
                    valueClassName={profitClassName}
                />

                <StatCard
                    title="Active customers"
                    value={customers.total.toLocaleString()}
                    description="Customers in your directory"
                    icon={Users}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue & spending</CardTitle>
                        <CardDescription>
                            Compare sales and expenses across periods
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y">
                        <MetricRow
                            label="Sales today"
                            value={formatCurrency(sales.today)}
                        />
                        <MetricRow
                            label="Sales this month"
                            value={formatCurrency(sales.month)}
                        />
                        <MetricRow
                            label="All-time sales"
                            value={formatCurrency(sales.total)}
                        />
                        <MetricRow
                            label="Expenses this month"
                            value={formatCurrency(expenses.month)}
                        />
                        <MetricRow
                            label="All-time expenses"
                            value={formatCurrency(expenses.total)}
                            muted
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly snapshot</CardTitle>
                        <CardDescription>
                            Key figures for the current calendar month
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-lg border bg-muted/40 p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Net profit
                                    </p>
                                    <p
                                        className={`mt-1 text-3xl font-semibold tabular-nums ${profitClassName}`}
                                    >
                                        {formatCurrency(profit.month)}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-background p-2 text-muted-foreground ring-1 ring-foreground/10">
                                    <PhilippinePeso className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <MetricRow
                                label="Gross sales (month)"
                                value={formatCurrency(sales.month)}
                            />
                            <MetricRow
                                label="Total expenses (month)"
                                value={formatCurrency(expenses.month)}
                            />
                        </div>

                        <Button
                            variant="outline"
                            className="w-full"
                            render={<Link to="/reports" />}
                        >
                            View reports
                            <ArrowRight data-icon="inline-end" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div>
                            <CardTitle>Inventory alerts</CardTitle>
                            <CardDescription>
                                Stock health across active products
                            </CardDescription>
                        </div>
                        <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                            <Package className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-lg border bg-muted/30 p-3 text-center">
                                <p className="text-2xl font-semibold tabular-nums">
                                    {inventory.totalProducts}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Active SKUs
                                </p>
                            </div>
                            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-center">
                                <p className="text-2xl font-semibold tabular-nums text-amber-700 dark:text-amber-400">
                                    {inventory.lowStock}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Low stock
                                </p>
                            </div>
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center">
                                <p className="text-2xl font-semibold tabular-nums text-destructive">
                                    {inventory.outOfStock}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Out of stock
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full"
                            render={<Link to="/products" />}
                        >
                            Manage products
                            <ArrowRight data-icon="inline-end" />
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div>
                            <CardTitle>Repair pipeline</CardTitle>
                            <CardDescription>
                                {repairTotal > 0
                                    ? `${repairTotal} open repair${repairTotal === 1 ? "" : "s"} in the queue`
                                    : "No open repairs in the queue"}
                            </CardDescription>
                        </div>
                        <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                            <Wrench className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="divide-y">
                        <RepairPipelineRow
                            label="Pending"
                            count={repairs.pending}
                            variant="secondary"
                        />
                        <RepairPipelineRow
                            label="In progress"
                            count={repairs.inProgress}
                            variant="outline"
                        />
                        <RepairPipelineRow
                            label="Ready for pickup"
                            count={repairs.readyForPickup}
                            variant="default"
                        />
                        <div className="flex items-center justify-between gap-3 py-2.5">
                            <span className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                Completed today
                            </span>
                            <Badge variant="secondary">
                                {repairs.completedToday}
                            </Badge>
                        </div>
                    </CardContent>
                    <CardContent className="pt-0">
                        <Button
                            variant="outline"
                            className="w-full"
                            render={<Link to="/repairs" />}
                        >
                            Open repairs
                            <ArrowRight data-icon="inline-end" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick actions</CardTitle>
                    <CardDescription>
                        Jump to common tasks without leaving the overview
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {QUICK_ACTIONS.map((action) => (
                            <Link
                                key={action.to}
                                to={action.to}
                                className="group flex items-start gap-3 rounded-lg border bg-muted/20 p-4 transition-colors hover:bg-muted/50"
                            >
                                <div className="rounded-lg bg-background p-2 text-muted-foreground ring-1 ring-foreground/10 group-hover:text-foreground">
                                    <action.icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium">
                                        {action.title}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {action.description}
                                    </p>
                                </div>
                                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
                <StatCard
                    title="Today's net"
                    value={formatCurrency(sales.today - expenses.today)}
                    description="Sales minus expenses for today"
                    icon={Wallet}
                    valueClassName={
                        sales.today - expenses.today >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-destructive"
                    }
                />
                <StatCard
                    title="Repairs completed today"
                    value={repairs.completedToday.toLocaleString()}
                    description="Finished and picked up today"
                    icon={Clock}
                />
            </div>
        </div>
    );
}
