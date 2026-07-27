import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { REPAIR_STATUS_LABELS } from "../../validators/repairOrderSchema";
import {
    getRepairOrderById,
    updateRepairStatus,
} from "../../services/repairOrderService";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle, 
} from "@/components/ui/sheet";

import { formatCurrency } from "@/utils/currency";
import { formatDate, formatDateTime } from "@/utils/date";

function DetailRow({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="max-w-[60%] text-right font-medium">{value}</span>
        </div>
    );
}

function StatusBadge({ status }) {
    switch (status) {
        case "PENDING":
            return <Badge variant="outline">Pending</Badge>;
        case "IN_PROGRESS":
            return <Badge variant="secondary">In Progress</Badge>;
        case "READY_FOR_PICKUP":
            return (
                <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15 dark:text-amber-400">
                    Ready for Pickup
                </Badge>
            );
        case "COMPLETED":
            return (
                <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400">
                    Completed
                </Badge>
            );
        case "CANCELLED":
            return <Badge variant="destructive">Cancelled</Badge>;
        default:
            return (
                <Badge variant="outline">
                    {REPAIR_STATUS_LABELS[status] ?? status}
                </Badge>
            );
    }
}

const NEXT_STATUS = {
    PENDING: {
        label: "Start Repair",
        status: "IN_PROGRESS",
    },
    IN_PROGRESS: {
        label: "Ready for Pickup",
        status: "READY_FOR_PICKUP",
    },
    READY_FOR_PICKUP: {
        label: "Mark Completed",
        status: "COMPLETED",
    },
};

export default function RepairDetailSheet({
    repairId,
    open,
    onOpenChange,
    onUpdated,
    onCancelRequest,
}) {
    const [repair, setRepair] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open || !repairId) {
            return;
        }

        async function loadRepair() {
            try {
                setLoading(true);
                setError(null);

                const response = await getRepairOrderById(repairId);
                setRepair(response.data ?? null);
            } catch (loadError) {
                console.error(loadError);
                setError(
                    loadError.response?.data?.message
                        ?? "Failed to load repair order."
                );
            } finally {
                setLoading(false);
            }
        }

        loadRepair();
    }, [open, repairId]);

    useEffect(() => {
        if (!open) {
            setRepair(null);
            setError(null);
        }
    }, [open]);

    async function handleStatusUpdate(status) {
        if (!repair) {
            return;
        }

        try {
            setUpdating(true);
            setError(null);

            const response = await updateRepairStatus(repair.id, status);
            setRepair(response.data ?? repair);
            onUpdated?.();
        } catch (updateError) {
            console.error(updateError);
            setError(
                updateError.response?.data?.message
                    ?? "Failed to update repair status."
            );
        } finally {
            setUpdating(false);
        }
    }

    const nextAction = repair ? NEXT_STATUS[repair.status] : null;
    const canCancel = repair
        && repair.status !== "COMPLETED"
        && repair.status !== "CANCELLED";

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>
                        {repair ? `Repair #${repair.id}` : "Repair Details"}
                    </SheetTitle>
                    <SheetDescription>
                        Repair order details and status
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 px-4 pb-4">
                    {loading && (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading repair order...
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {!loading && repair && (
                        <>
                            <div className="space-y-3">
                                <DetailRow
                                    label="Status"
                                    value={<StatusBadge status={repair.status} />}
                                />
                                <DetailRow
                                    label="Received"
                                    value={formatDateTime(repair.receivedAt)}
                                />
                                <DetailRow
                                    label="Due Date"
                                    value={formatDate(repair.dueDate)}
                                />
                                <DetailRow
                                    label="Customer"
                                    value={repair.customerName}
                                />
                                <DetailRow
                                    label="Phone"
                                    value={repair.phone || "—"}
                                />
                                <DetailRow
                                    label="Item Type"
                                    value={repair.itemType}
                                />
                                <DetailRow
                                    label="Repair Cost"
                                    value={formatCurrency(Number(repair.repairCost ?? 0))}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Issue Description
                                </p>
                                <p className="text-sm">
                                    {repair.description}
                                </p>
                            </div>

                            {repair.remarks && (
                                <>
                                    <Separator />
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Remarks
                                        </p>
                                        <p className="text-sm">
                                            {repair.remarks}
                                        </p>
                                    </div>
                                </>
                            )}

                            {(repair.completedAt || repair.claimedAt) && (
                                <>
                                    <Separator />
                                    <div className="space-y-3">
                                        {repair.completedAt && (
                                            <DetailRow
                                                label="Completed"
                                                value={formatDateTime(repair.completedAt)}
                                            />
                                        )}
                                        {repair.claimedAt && (
                                            <DetailRow
                                                label="Claimed"
                                                value={formatDateTime(repair.claimedAt)}
                                            />
                                        )}
                                    </div>
                                </>
                            )}

                            {(nextAction || canCancel) && (
                                <>
                                    <Separator />

                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium">
                                            Actions
                                        </h3>

                                        <div className="flex flex-wrap gap-2">
                                            {nextAction && (
                                                <Button
                                                    size="sm"
                                                    disabled={updating}
                                                    onClick={() =>
                                                        handleStatusUpdate(nextAction.status)
                                                    }
                                                >
                                                    {updating
                                                        ? "Updating..."
                                                        : nextAction.label}
                                                </Button>
                                            )}

                                            {canCancel && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={updating}
                                                    onClick={() =>
                                                        onCancelRequest?.(repair)
                                                    }
                                                >
                                                    Cancel Order
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
