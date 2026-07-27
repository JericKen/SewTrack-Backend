import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { getCustomerRepairHistory } from "../../services/customerService";
import { getCustomerFullName } from "@/utils/customer";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";

import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

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
            return <Badge variant="outline">{status}</Badge>;
    }
}

export default function CustomerRepairHistorySheet({
    customer,
    open,
    onOpenChange,
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState(null);

    useEffect(() => {
        if (!open || !customer?.id) {
            return;
        }

        let cancelled = false;

        async function loadHistory() {
            try {
                setLoading(true);
                setError(null);

                const response = await getCustomerRepairHistory(customer.id);

                if (!cancelled) {
                    setHistory(response.data ?? null);
                }
            } catch (loadError) {
                console.error(loadError);

                if (!cancelled) {
                    setError(
                        loadError.response?.data?.message
                            ?? "Failed to load repair history."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadHistory();

        return () => {
            cancelled = true;
        };
    }, [open, customer?.id]);

    useEffect(() => {
        if (!open) {
            setHistory(null);
            setError(null);
        }
    }, [open]);

    const repairs = history?.repairs ?? [];

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>
                        Repair History
                    </SheetTitle>

                    <SheetDescription>
                        {customer
                            ? getCustomerFullName(customer)
                            : "Customer repairs"}
                        {customer?.phone && ` · ${customer.phone}`}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                    {loading && (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading repairs...
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {!loading && !error && repairs.length === 0 && (
                        <div className="rounded-xl border border-dashed py-12 text-center">
                            <p className="text-sm text-foreground/75">
                                No repair orders linked to this customer yet.
                            </p>
                        </div>
                    )}

                    {!loading && !error && repairs.map((repair) => (
                        <div
                            key={repair.id}
                            className="rounded-xl border p-4 space-y-3"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium">
                                        {repair.itemType}
                                    </p>
                                    {repair.description && (
                                        <p className="mt-1 text-sm text-foreground/75">
                                            {repair.description}
                                        </p>
                                    )}
                                </div>

                                <StatusBadge status={repair.status} />
                            </div>

                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Cost
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(repair.repairCost)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Received
                                    </span>
                                    <span>
                                        {formatDate(repair.receivedAt)}
                                    </span>
                                </div>

                                {repair.dueDate && (
                                    <div className="flex justify-between gap-4">
                                        <span className="text-muted-foreground">
                                            Due
                                        </span>
                                        <span>
                                            {formatDate(repair.dueDate)}
                                        </span>
                                    </div>
                                )}

                                {repair.completedAt && (
                                    <div className="flex justify-between gap-4">
                                        <span className="text-muted-foreground">
                                            Completed
                                        </span>
                                        <span>
                                            {formatDate(repair.completedAt)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
