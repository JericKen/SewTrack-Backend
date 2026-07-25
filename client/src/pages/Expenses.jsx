import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    PhilippinePeso,
    Receipt,
    Wallet,
} from "lucide-react";

import ExpenseDetailSheet from "../components/expenses/ExpenseDetailSheet";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseToolbar from "../components/expenses/ExpenseToolbar";

import {
    archiveExpense,
    createExpense,
    getExpenseSummary,
    getExpenses,
    updateExpense,
} from "../services/expenseService";

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

function buildQueryParams({
    page,
    search,
    category,
    paymentMethod,
}) {
    const params = {
        page,
        limit: PAGE_SIZE,
        sort: "desc",
    };

    if (search.trim()) {
        params.search = search.trim();
    }

    if (category !== "ALL") {
        params.category = category;
    }

    if (paymentMethod !== "ALL") {
        params.paymentMethod = paymentMethod;
    }

    return params;
}

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
    });

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("ALL");
    const [paymentMethod, setPaymentMethod] = useState("ALL");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [detailExpense, setDetailExpense] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [submitError, setSubmitError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const loadSummary = useCallback(async () => {
        try {
            setSummaryLoading(true);
            const response = await getExpenseSummary();
            setSummary(response.data ?? null);
        } catch (error) {
            console.error(error);
        } finally {
            setSummaryLoading(false);
        }
    }, []);

    const loadExpenses = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getExpenses(buildQueryParams({
                page,
                search,
                category,
                paymentMethod,
            }));

            setExpenses(response.data?.data ?? []);
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
    }, [page, search, category, paymentMethod]);

    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

    useEffect(() => {
        loadSummary();
    }, [loadSummary]);

    useEffect(() => {
        setPage(1);
    }, [search, category, paymentMethod]);

    const stats = useMemo(() => {
        const pageTotal = expenses.reduce(
            (sum, expense) => sum + Number(expense.amount),
            0
        );

        return {
            total: pagination.total,
            todayExpenses: Number(summary?.todayExpenses ?? 0),
            monthExpenses: Number(summary?.monthExpenses ?? 0),
            pageTotal,
        };
    }, [expenses, pagination.total, summary]);

    function handleOpenCreate() {
        setEditingExpense(null);
        setSubmitError(null);
        setFormOpen(true);
    }

    function handleOpenEdit(expense) {
        setEditingExpense(expense);
        setSubmitError(null);
        setFormOpen(true);
    }

    function handleFormDialogChange(isOpen) {
        setFormOpen(isOpen);

        if (!isOpen) {
            setEditingExpense(null);
            setSubmitError(null);
        }
    }

    async function handleSubmitExpense(data) {
        try {
            setSaving(true);
            setSubmitError(null);

            if (editingExpense) {
                await updateExpense(editingExpense.id, data);
            } else {
                await createExpense(data);
            }

            setFormOpen(false);
            setEditingExpense(null);
            setPage(editingExpense ? page : 1);

            await Promise.all([loadExpenses(), loadSummary()]);
        } catch (error) {
            console.error(error);

            setSubmitError(
                error.response?.data?.message
                    ?? "Failed to save expense. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteExpense() {
        if (!deleteTarget) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError(null);

            await archiveExpense(deleteTarget.id);

            setDeleteTarget(null);
            await Promise.all([loadExpenses(), loadSummary()]);
        } catch (error) {
            console.error(error);

            setDeleteError(
                error.response?.data?.message
                    ?? "Failed to remove expense. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    }

    const showEmptyCreateState = !loading
        && pagination.total === 0
        && !search.trim()
        && category === "ALL"
        && paymentMethod === "ALL";

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div>
                    <p className="mt-1 text-muted-foreground">
                        Track business and household spending across categories.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Expenses"
                        value={stats.total}
                        description="All recorded expenses"
                        icon={Receipt}
                    />

                    <StatCard
                        title="Today"
                        value={
                            summaryLoading
                                ? "..."
                                : formatCurrency(stats.todayExpenses)
                        }
                        description="Spending today"
                        icon={PhilippinePeso}
                    />

                    <StatCard
                        title="This Month"
                        value={
                            summaryLoading
                                ? "..."
                                : formatCurrency(stats.monthExpenses)
                        }
                        description="Month-to-date spending"
                        icon={CalendarDays}
                    />

                    <StatCard
                        title="Page Total"
                        value={formatCurrency(stats.pageTotal)}
                        description="Amount on current page"
                        icon={Wallet}
                    />
                </div>

                <ExpenseToolbar
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    onAdd={handleOpenCreate}
                    totalCount={pagination.total}
                />

                <ExpenseTable
                    expenses={expenses}
                    loading={loading}
                    onView={setDetailExpense}
                    onEdit={handleOpenEdit}
                    onDelete={(expense) => {
                        setDeleteError(null);
                        setDeleteTarget(expense);
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
                    open={formOpen}
                    onOpenChange={handleFormDialogChange}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingExpense
                                    ? "Edit Expense"
                                    : "New Expense"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingExpense
                                    ? "Update the expense details below."
                                    : "Record a new business or household expense."}
                            </DialogDescription>
                        </DialogHeader>

                        {submitError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {submitError}
                            </div>
                        )}

                        <ExpenseForm
                            key={editingExpense?.id ?? "new"}
                            expense={editingExpense}
                            loading={saving}
                            onSubmit={handleSubmitExpense}
                        />
                    </DialogContent>
                </Dialog>

                <ExpenseDetailSheet
                    expense={detailExpense}
                    open={Boolean(detailExpense)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setDetailExpense(null);
                        }
                    }}
                />

                <AlertDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setDeleteTarget(null);
                            setDeleteError(null);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Remove expense?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will remove the expense for{" "}
                                <span className="font-medium text-foreground">
                                    {deleteTarget?.description}
                                </span>{" "}
                                ({formatCurrency(Number(deleteTarget?.amount ?? 0))}).
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {deleteError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {deleteError}
                            </div>
                        )}

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleting}>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                variant="destructive"
                                disabled={deleting}
                                onClick={handleDeleteExpense}
                            >
                                {deleting ? "Removing..." : "Remove"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </TooltipProvider>
    );
}
