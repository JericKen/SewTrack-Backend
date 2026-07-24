import {
    Eye,
    Wrench,
} from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatCurrency } from "@/utils/currency";
import { formatDate, formatDateTime } from "@/utils/date";

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

function RepairTableSkeleton() {
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

export default function RepairTable({
    repairs,
    loading = false,
    onView,
    onAdd,
}) {
    if (loading) {
        return <RepairTableSkeleton />;
    }

    if (repairs.length === 0) {
        return (
            <div className="rounded-xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Wrench className="h-6 w-6 text-muted-foreground" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    No repair orders found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    {onAdd
                        ? "Create your first repair order to start tracking jobs."
                        : "Try adjusting your search or filters."}
                </p>

                {onAdd && (
                    <Button
                        className="mt-6"
                        onClick={onAdd}
                    >
                        New Repair
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
                        <TableHead>Order</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">
                            Cost
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
                    {repairs.map((repair) => (
                        <TableRow
                            key={repair.id}
                            className="group"
                        >
                            <TableCell className="font-mono text-xs">
                                #{repair.id}
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                                {formatDateTime(repair.receivedAt)}
                            </TableCell>

                            <TableCell>
                                <div>{repair.customerName}</div>
                                {repair.phone && (
                                    <div className="text-xs text-muted-foreground">
                                        {repair.phone}
                                    </div>
                                )}
                            </TableCell>

                            <TableCell>
                                <div className="font-medium">
                                    {repair.itemType}
                                </div>
                                <div className="line-clamp-1 max-w-[200px] text-xs text-muted-foreground">
                                    {repair.description}
                                </div>
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                                {formatDate(repair.dueDate)}
                            </TableCell>

                            <TableCell className="text-right tabular-nums font-medium">
                                {formatCurrency(Number(repair.repairCost ?? 0))}
                            </TableCell>

                            <TableCell className="text-center">
                                <StatusBadge status={repair.status} />
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onView(repair)}
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
