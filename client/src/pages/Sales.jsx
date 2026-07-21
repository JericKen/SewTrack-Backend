import { useCallback, useEffect, useMemo, useState } from "react";
import {
    PhilippinePeso,
    Receipt,
    ShoppingCart,
} from "lucide-react";

import SaleDetailSheet from "../components/sales/SaleDetailSheet";
import SaleForm from "../components/sales/SaleForm";
import SaleTable from "../components/sales/SaleTable";
import SaleToolbar from "../components/sales/SaleToolbar";

import {
    createSale,
    getSales,
    voidSale,
} from "../services/saleService";

import { formatCurrency } from "../utils/currency";
import { getTodayISO } from "../utils/date";

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

const PAGE_SIZE = 10;

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

function buildQueryParams({
    page,
    search,
    paymentMethod,
    status,
    dateFrom,
    dateTo,
}) {
    const params = {
        page,
        limit: PAGE_SIZE,
        sort: "desc",
    };

    if (search.trim()) {
        params.search = search.trim();
    }

    if (paymentMethod !== "ALL") {
        params.paymentMethod = paymentMethod;
    }

    if (status !== "ALL") {
        params.status = status;
    }

    if (dateFrom) {
        params.from = dateFrom;
    }

    if (dateTo) {
        params.to = dateTo;
    }

    return params;
}

export default function Sales() {
    const [sales, setSales] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
    });
    const [todayRevenue, setTodayRevenue] = useState(0);

    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("ALL");
    const [status, setStatus] = useState("ALL");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [voiding, setVoiding] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);
    const [detailSale, setDetailSale] = useState(null);
    const [voidTarget, setVoidTarget] = useState(null);

    const [submitError, setSubmitError] = useState(null);
    const [voidError, setVoidError] = useState(null);

    const loadTodayRevenue = useCallback(async () => {
        try {
            const today = getTodayISO();
            const response = await getSales({
                from: today,
                to: today,
                status: "COMPLETED",
                limit: 1000,
            });

            const total = (response.data?.sales ?? []).reduce(
                (sum, sale) => sum + Number(sale.totalAmount),
                0
            );

            setTodayRevenue(total);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const loadSales = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getSales(buildQueryParams({
                page,
                search,
                paymentMethod,
                status,
                dateFrom,
                dateTo,
            }));

            setSales(response.data?.sales ?? []);
            setPagination(response.data?.pagination ?? {
                page: 1,
                limit: PAGE_SIZE,
                total: 0,
                totalPages: 0,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, search, paymentMethod, status, dateFrom, dateTo]);

    useEffect(() => {
        loadSales();
    }, [loadSales]);

    useEffect(() => {
        loadTodayRevenue();
    }, [loadTodayRevenue]);

    useEffect(() => {
        setPage(1);
    }, [search, paymentMethod, status, dateFrom, dateTo]);

    const stats = useMemo(() => {
        const completedCount = sales.filter(
            (sale) => sale.status === "COMPLETED"
        ).length;

        const pageRevenue = sales
            .filter((sale) => sale.status === "COMPLETED")
            .reduce((sum, sale) => sum + Number(sale.totalAmount), 0);

        return {
            total: pagination.total,
            todayRevenue,
            completedCount,
            pageRevenue,
        };
    }, [sales, pagination.total, todayRevenue]);

    function handleOpenCreate() {
        setSubmitError(null);
        setCreateOpen(true);
    }

    function handleCreateDialogChange(isOpen) {
        setCreateOpen(isOpen);

        if (!isOpen) {
            setSubmitError(null);
        }
    }

    async function handleCreateSale(data) {
        try {
            setSaving(true);
            setSubmitError(null);

            await createSale(data);

            setCreateOpen(false);
            setPage(1);
            await Promise.all([loadSales(), loadTodayRevenue()]);
        } catch (error) {
            console.error(error);

            setSubmitError(
                error.response?.data?.message
                    ?? "Failed to create sale. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleVoidSale() {
        if (!voidTarget) {
            return;
        }

        try {
            setVoiding(true);
            setVoidError(null);

            await voidSale(voidTarget.id);

            setVoidTarget(null);

            if (detailSale?.id === voidTarget.id) {
                setDetailSale(null);
            }

            await Promise.all([loadSales(), loadTodayRevenue()]);
        } catch (error) {
            console.error(error);

            setVoidError(
                error.response?.data?.message
                    ?? "Failed to void sale. Please try again."
            );
        } finally {
            setVoiding(false);
        }
    }

    const showEmptyCreateState = !loading
        && pagination.total === 0
        && !search.trim()
        && paymentMethod === "ALL"
        && status === "ALL"
        && !dateFrom
        && !dateTo;

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div>
                    <p className="mt-1 text-muted-foreground">
                        Record sales, track invoices, and manage transactions.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Sales"
                        value={stats.total}
                        description="All recorded transactions"
                        icon={Receipt}
                    />

                    <StatCard
                        title="Today's Revenue"
                        value={formatCurrency(stats.todayRevenue)}
                        description="Completed sales today"
                        icon={PhilippinePeso}
                    />

                    <StatCard
                        title="Completed"
                        value={stats.completedCount}
                        description="On this page"
                        icon={ShoppingCart}
                    />

                    <StatCard
                        title="Page Total"
                        value={formatCurrency(stats.pageRevenue)}
                        description="Revenue on current page"
                        icon={PhilippinePeso}
                    />
                </div>

                <SaleToolbar
                    search={search}
                    setSearch={setSearch}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    status={status}
                    setStatus={setStatus}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    dateTo={dateTo}
                    setDateTo={setDateTo}
                    onAdd={handleOpenCreate}
                    totalCount={pagination.total}
                />

                <SaleTable
                    sales={sales}
                    loading={loading}
                    onView={setDetailSale}
                    onVoid={(sale) => {
                        setVoidError(null);
                        setVoidTarget(sale);
                    }}
                    onAdd={showEmptyCreateState ? handleOpenCreate : undefined}
                />

                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1 || loading}
                                onClick={() => setPage((current) => current - 1)}
                            >
                                Previous
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= pagination.totalPages || loading}
                                onClick={() => setPage((current) => current + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                <Dialog
                    open={createOpen}
                    onOpenChange={handleCreateDialogChange}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>New Sale</DialogTitle>
                            <DialogDescription>
                                Add products and complete the transaction.
                            </DialogDescription>
                        </DialogHeader>

                        {submitError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {submitError}
                            </div>
                        )}

                        <SaleForm
                            key={createOpen ? "open" : "closed"}
                            loading={saving}
                            onSubmit={handleCreateSale}
                        />
                    </DialogContent>
                </Dialog>

                <SaleDetailSheet
                    sale={detailSale}
                    open={Boolean(detailSale)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setDetailSale(null);
                        }
                    }}
                />

                <AlertDialog
                    open={Boolean(voidTarget)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setVoidTarget(null);
                            setVoidError(null);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Void this sale?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will void invoice{" "}
                                <span className="font-medium text-foreground">
                                    {voidTarget?.invoiceNo}
                                </span>{" "}
                                and restore stock for all items. This action
                                cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {voidError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {voidError}
                            </div>
                        )}

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={voiding}>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                variant="destructive"
                                disabled={voiding}
                                onClick={handleVoidSale}
                            >
                                {voiding ? "Voiding..." : "Void Sale"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </TooltipProvider>
    );
}
