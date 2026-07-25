import {
    Mail,
    Pencil,
    Phone,
    Trash2,
    Truck,
} from "lucide-react";

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

import { formatDate } from "@/utils/date";

function SupplierTableSkeleton() {
    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <TableHead key={index}>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: 6 }).map((__, cellIndex) => (
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

function ContactCell({ phone, email }) {
    if (!phone && !email) {
        return <span className="text-foreground/50">—</span>;
    }

    return (
        <div className="space-y-1 text-sm">
            {phone && (
                <div className="flex items-center gap-1.5 text-foreground/90">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-foreground/50" />
                    <span>{phone}</span>
                </div>
            )}

            {email && (
                <div className="flex items-center gap-1.5 text-foreground/75">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-foreground/50" />
                    <span className="truncate">{email}</span>
                </div>
            )}
        </div>
    );
}

export default function SupplierTable({
    suppliers,
    loading = false,
    onEdit,
    onDelete,
    onAdd,
}) {
    if (loading) {
        return <SupplierTableSkeleton />;
    }

    if (suppliers.length === 0) {
        return (
            <div className="rounded-xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Truck className="h-6 w-6 text-foreground/60" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    No suppliers found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/75">
                    {onAdd
                        ? "Add your first supplier to track purchases and contact details."
                        : "Try adjusting your search to find what you are looking for."}
                </p>

                {onAdd && (
                    <Button
                        className="mt-6"
                        onClick={onAdd}
                    >
                        Add Supplier
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
                        <TableHead>Supplier</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {suppliers.map((supplier) => (
                        <TableRow
                            key={supplier.id}
                            className="group"
                        >
                            <TableCell>
                                <div className="font-medium">
                                    {supplier.name}
                                </div>

                                {supplier.remarks && (
                                    <div className="mt-0.5 line-clamp-1 text-xs text-foreground/70">
                                        {supplier.remarks}
                                    </div>
                                )}
                            </TableCell>

                            <TableCell className="text-foreground/90">
                                {supplier.contactPerson || "—"}
                            </TableCell>

                            <TableCell>
                                <ContactCell
                                    phone={supplier.phone}
                                    email={supplier.email}
                                />
                            </TableCell>

                            <TableCell className="max-w-[220px] truncate text-foreground/75">
                                {supplier.address || "—"}
                            </TableCell>

                            <TableCell className="text-sm text-foreground/75">
                                {formatDate(supplier.createdAt)}
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onEdit(supplier)}
                                                />
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Edit supplier
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onDelete(supplier)}
                                                />
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Remove supplier
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
