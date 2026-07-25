import {
    Eye,
    Pencil,
    Receipt,
    Trash2,
} from "lucide-react";

import {
    EXPENSE_CATEGORY_LABELS,
    PAYMENT_METHOD_LABELS,
} from "../../validators/expenseSchema";

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
import { formatDate } from "@/utils/date";

function ExpenseTableSkeleton() {
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

export default function ExpenseTable({
    expenses,
    loading = false,
    onView,
    onEdit,
    onDelete,
    onAdd,
}) {
    if (loading) {
        return <ExpenseTableSkeleton />;
    }

    if (expenses.length === 0) {
        return (
            <div className="rounded-xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Receipt className="h-6 w-6 text-muted-foreground" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    No expenses found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    {onAdd
                        ? "Record your first expense to start tracking spending."
                        : "Try adjusting your search or filters."}
                </p>

                {onAdd && (
                    <Button
                        className="mt-6"
                        onClick={onAdd}
                    >
                        New Expense
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
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">
                            Amount
                        </TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow
                            key={expense.id}
                            className="group"
                        >
                            <TableCell className="text-muted-foreground">
                                {formatDate(expense.expenseDate)}
                            </TableCell>

                            <TableCell>
                                <div className="max-w-[240px] truncate font-medium">
                                    {expense.description}
                                </div>
                            </TableCell>

                            <TableCell>
                                <Badge variant="outline">
                                    {EXPENSE_CATEGORY_LABELS[expense.category]
                                        ?? expense.category}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                                {PAYMENT_METHOD_LABELS[expense.paymentMethod]
                                    ?? expense.paymentMethod}
                            </TableCell>

                            <TableCell className="text-right tabular-nums font-medium">
                                {formatCurrency(Number(expense.amount))}
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onView(expense)}
                                                />
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            View details
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onEdit(expense)}
                                                />
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Edit expense
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onDelete(expense)}
                                                />
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Remove expense
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
