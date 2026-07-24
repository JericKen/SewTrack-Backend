import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CheckCircle2,
    Clock,
    PhilippinePeso,
    Wrench,
} from "lucide-react";

import RepairDetailSheet from "../components/repairs/RepairDetailSheet";
import RepairForm from "../components/repairs/RepairForm";
import RepairTable from "../components/repairs/RepairTable";
import RepairToolbar from "../components/repairs/RepairToolbar";

import {
    cancelRepairOrder,
    createRepairOrder,
    getRepairOrders,
} from "../services/repairOrderService";

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

function buildQueryParams({ page, search, status }) {
    const params = {
        page,
        limit: PAGE_SIZE,
        sort: "desc",
    };

    if (search.trim()) {
        params.search = search.trim();
    }

    if (status !== "ALL") {
        params.status = status;
    }

    return params;
}

export default function Repairs() {
    const [repairs, setRepairs] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
    });

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);
    const [detailRepairId, setDetailRepairId] = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);

    const [submitError, setSubmitError] = useState(null);
    const [cancelError, setCancelError] = useState(null);

    const loadRepairs = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getRepairOrders(buildQueryParams({
                page,
                search,
                status,
            }));

            setRepairs(response.data?.data ?? []);
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
    }, [page, search, status]);

    useEffect(() => {
        loadRepairs();
    }, [loadRepairs]);

    useEffect(() => {
        setPage(1);
    }, [search, status]);

    const stats = useMemo(() => {
        const activeCount = repairs.filter(
            (repair) => repair.status === "PENDING"
                || repair.status === "IN_PROGRESS"
        ).length;

        const readyCount = repairs.filter(
            (repair) => repair.status === "READY_FOR_PICKUP"
        ).length;

        const pageValue = repairs.reduce(
            (sum, repair) => sum + Number(repair.repairCost ?? 0),
            0
        );

        return {
            total: pagination.total,
            activeCount,
            readyCount,
            pageValue,
        };
    }, [repairs, pagination.total]);

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

    async function handleCreateRepair(data) {
        try {
            setSaving(true);
            setSubmitError(null);

            await createRepairOrder(data);

            setCreateOpen(false);
            setPage(1);
            await loadRepairs();
        } catch (error) {
            console.error(error);

            setSubmitError(
                error.response?.data?.message
                    ?? "Failed to create repair order. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleCancelRepair() {
        if (!cancelTarget) {
            return;
        }

        try {
            setCancelling(true);
            setCancelError(null);

            await cancelRepairOrder(cancelTarget.id);

            setCancelTarget(null);

            if (detailRepairId === cancelTarget.id) {
                setDetailRepairId(null);
            }

            await loadRepairs();
        } catch (error) {
            console.error(error);

            setCancelError(
                error.response?.data?.message
                    ?? "Failed to cancel repair order. Please try again."
            );
        } finally {
            setCancelling(false);
        }
    }

    const showEmptyCreateState = !loading
        && pagination.total === 0
        && !search.trim()
        && status === "ALL";

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div>
                    <p className="mt-1 text-muted-foreground">
                        Track repair jobs from intake through pickup.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Repairs"
                        value={stats.total}
                        description="All recorded orders"
                        icon={Wrench}
                    />

                    <StatCard
                        title="Active Jobs"
                        value={stats.activeCount}
                        description="Pending or in progress on this page"
                        icon={Clock}
                    />

                    <StatCard
                        title="Ready for Pickup"
                        value={stats.readyCount}
                        description="On this page"
                        icon={CheckCircle2}
                    />

                    <StatCard
                        title="Page Value"
                        value={formatCurrency(stats.pageValue)}
                        description="Repair cost on current page"
                        icon={PhilippinePeso}
                    />
                </div>

                <RepairToolbar
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    onAdd={handleOpenCreate}
                    totalCount={pagination.total}
                />

                <RepairTable
                    repairs={repairs}
                    loading={loading}
                    onView={(repair) => setDetailRepairId(repair.id)}
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
                            <DialogTitle>New Repair Order</DialogTitle>
                            <DialogDescription>
                                Record a new item dropped off for repair.
                            </DialogDescription>
                        </DialogHeader>

                        {submitError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {submitError}
                            </div>
                        )}

                        <RepairForm
                            key={createOpen ? "open" : "closed"}
                            loading={saving}
                            onSubmit={handleCreateRepair}
                        />
                    </DialogContent>
                </Dialog>

                <RepairDetailSheet
                    repairId={detailRepairId}
                    open={Boolean(detailRepairId)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setDetailRepairId(null);
                        }
                    }}
                    onUpdated={loadRepairs}
                    onCancelRequest={(repair) => {
                        setCancelError(null);
                        setCancelTarget(repair);
                    }}
                />

                <AlertDialog
                    open={Boolean(cancelTarget)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setCancelTarget(null);
                            setCancelError(null);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Cancel this repair order?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will cancel repair order{" "}
                                <span className="font-medium text-foreground">
                                    #{cancelTarget?.id}
                                </span>{" "}
                                for {cancelTarget?.customerName}. This action
                                cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {cancelError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {cancelError}
                            </div>
                        )}

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={cancelling}>
                                Keep Order
                            </AlertDialogCancel>

                            <AlertDialogAction
                                variant="destructive"
                                disabled={cancelling}
                                onClick={handleCancelRepair}
                            >
                                {cancelling ? "Cancelling..." : "Cancel Order"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </TooltipProvider>
    );
}
