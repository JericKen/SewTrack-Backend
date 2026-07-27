import {
    History,
    MapPin,
    Pencil,
    Phone,
    Trash2,
    Users,
} from "lucide-react";

import { getCustomerFullName } from "@/utils/customer";
import { formatDate } from "@/utils/date";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

function CustomerTableSkeleton() {
    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableHead key={index}>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: 5 }).map((__, cellIndex) => (
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

export default function CustomerTable({
    customers,
    loading = false,
    onEdit,
    onDelete,
    onViewRepairs,
    onAdd,
}) {
    if (loading) {
        return <CustomerTableSkeleton />;
    }

    if (customers.length === 0) {
        return (
            <div className="rounded-xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Users className="h-6 w-6 text-foreground/60" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    No customers found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/75">
                    {onAdd
                        ? "Add your first customer to track contact details and repair history."
                        : "Try adjusting your search to find what you are looking for."}
                </p>

                {onAdd && (
                    <Button
                        className="mt-6"
                        onClick={onAdd}
                    >
                        Add Customer
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
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {customers.map((customer) => (
                        <TableRow
                            key={customer.id}
                            className="group"
                        >
                            <TableCell>
                                <div className="font-medium">
                                    {getCustomerFullName(customer)}
                                </div>

                                {customer.remarks && (
                                    <div className="mt-0.5 line-clamp-1 text-xs text-foreground/70">
                                        {customer.remarks}
                                    </div>
                                )}
                            </TableCell>

                            <TableCell>
                                {customer.phone ? (
                                    <div className="flex items-center gap-1.5 text-sm text-foreground/90">
                                        <Phone className="h-3.5 w-3.5 shrink-0 text-foreground/50" />
                                        <span>{customer.phone}</span>
                                    </div>
                                ) : (
                                    <span className="text-foreground/50">—</span>
                                )}
                            </TableCell>

                            <TableCell className="max-w-[220px]">
                                {customer.address ? (
                                    <div className="flex items-center gap-1.5 truncate text-foreground/75">
                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-foreground/50" />
                                        <span className="truncate">
                                            {customer.address}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-foreground/50">—</span>
                                )}
                            </TableCell>

                            <TableCell className="text-sm text-foreground/75">
                                {formatDate(customer.createdAt)}
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onViewRepairs(customer)}
                                                />
                                            }
                                        >
                                            <History className="h-4 w-4" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Repair history
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onEdit(customer)}
                                                />
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Edit customer
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onDelete(customer)}
                                                />
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Remove customer
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
