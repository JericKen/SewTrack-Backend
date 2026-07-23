import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Package,
    PhilippinePeso,
    ShoppingBag,
} from "lucide-react";

import PurchaseDetailSheet from "../components/purchases/PurchaseDetailSheet";
import PurchaseForm from "../components/purchases/PurchaseForm";
import PurchaseTable from "../components/purchases/PurchaseTable";
import PurchaseToolbar from "../components/purchases/PurchaseToolbar";

import {
    createPurchase,
    getPurchases,
} from "../services/purchaseService";

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

function buildQueryParams({ page, search }) {
    const params = {
        page,
        limit: PAGE_SIZE,
        sort: "desc",
    };

    if (search.trim()) {
        params.search = search.trim();
    }

    return params;
}

function isToday(value) {
    if (!value) {
        return false;
    }

    return new Date(value).toISOString().slice(0, 10) === getTodayISO();
}

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
    });
    const [todaySpend, setTodaySpend] = useState(0);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);
    const [detailPurchase, setDetailPurchase] = useState(null);

    const [submitError, setSubmitError] = useState(null);

    const loadTodaySpend = useCallback(async () => {
        try {
            const response = await getPurchases({
                limit: 1000,
                sort: "desc",
            });

            const total = (response.data?.purchases ?? [])
                .filter((purchase) => isToday(purchase.purchasedAt))
                .reduce(
                    (sum, purchase) => sum + Number(purchase.totalAmount),
                    0
                );

            setTodaySpend(total);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const loadPurchases = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getPurchases(buildQueryParams({
                page,
                search,
            }));

            setPurchases(response.data?.purchases ?? []);
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
    }, [page, search]);

    useEffect(() => {
        loadPurchases();
    }, [loadPurchases]);

    useEffect(() => {
        loadTodaySpend();
    }, [loadTodaySpend]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const stats = useMemo(() => {
        const itemCount = purchases.reduce(
            (sum, purchase) => sum + (purchase.items?.length ?? 0),
            0
        );

        const pageTotal = purchases.reduce(
            (sum, purchase) => sum + Number(purchase.totalAmount),
            0
        );

        return {
            total: pagination.total,
            todaySpend,
            itemCount,
            pageTotal,
        };
    }, [purchases, pagination.total, todaySpend]);

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

    async function handleCreatePurchase(data) {
        try {
            setSaving(true);
            setSubmitError(null);

            await createPurchase(data);

            setCreateOpen(false);
            setPage(1);
            await Promise.all([loadPurchases(), loadTodaySpend()]);
        } catch (error) {
            console.error(error);

            setSubmitError(
                error.response?.data?.message
                    ?? "Failed to create purchase. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    const showEmptyCreateState = !loading
        && pagination.total === 0
        && !search.trim();

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div>
                    <p className="mt-1 text-muted-foreground">
                        Record stock purchases and track supplier orders.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Purchases"
                        value={stats.total}
                        description="All recorded purchases"
                        icon={Package}
                    />

                    <StatCard
                        title="Today's Spend"
                        value={formatCurrency(stats.todaySpend)}
                        description="Purchases made today"
                        icon={PhilippinePeso}
                    />

                    <StatCard
                        title="Line Items"
                        value={stats.itemCount}
                        description="On this page"
                        icon={ShoppingBag}
                    />

                    <StatCard
                        title="Page Total"
                        value={formatCurrency(stats.pageTotal)}
                        description="Amount on current page"
                        icon={PhilippinePeso}
                    />
                </div>

                <PurchaseToolbar
                    search={search}
                    setSearch={setSearch}
                    onAdd={handleOpenCreate}
                    totalCount={pagination.total}
                />

                <PurchaseTable
                    purchases={purchases}
                    loading={loading}
                    onView={setDetailPurchase}
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
                            <DialogTitle>New Purchase</DialogTitle>
                            <DialogDescription>
                                Add products received from a supplier to restock inventory.
                            </DialogDescription>
                        </DialogHeader>

                        {submitError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {submitError}
                            </div>
                        )}

                        <PurchaseForm
                            key={createOpen ? "open" : "closed"}
                            loading={saving}
                            onSubmit={handleCreatePurchase}
                        />
                    </DialogContent>
                </Dialog>

                <PurchaseDetailSheet
                    purchase={detailPurchase}
                    open={Boolean(detailPurchase)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setDetailPurchase(null);
                        }
                    }}
                />
            </div>
        </TooltipProvider>
    );
}
