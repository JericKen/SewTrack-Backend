import { useCallback, useEffect, useMemo, useState } from "react";
import {
    MapPin,
    Phone,
    UserPlus,
    Users,
} from "lucide-react";

import CustomerForm from "../components/customers/CustomerForm";
import CustomerRepairHistorySheet from "../components/customers/CustomerRepairHistorySheet";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerToolbar from "../components/customers/CustomerToolbar";

import {
    archiveCustomer,
    createCustomer,
    getCustomers,
    updateCustomer,
} from "../services/customerService";

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

import { getCustomerFullName } from "@/utils/customer";

const PAGE_SIZE = 10;
const STATS_LIMIT = 1000;

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
                    <CardDescription className="text-foreground/75">
                        {title}
                    </CardDescription>
                    <CardTitle className="text-2xl tabular-nums">
                        {value}
                    </CardTitle>
                    {description && (
                        <p className="text-xs text-foreground/70">
                            {description}
                        </p>
                    )}
                </div>

                <div className="rounded-lg bg-muted p-2 text-foreground/70">
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
        </Card>
    );
}

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [statsCustomers, setStatsCustomers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
    });

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [open, setOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [repairHistoryCustomer, setRepairHistoryCustomer] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const loadStats = useCallback(async () => {
        try {
            const response = await getCustomers({
                limit: STATS_LIMIT,
                sort: "desc",
            });

            setStatsCustomers(response.data?.data ?? []);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const loadCustomers = useCallback(async () => {
        try {
            setLoading(true);

            const params = {
                page,
                limit: PAGE_SIZE,
                sort: "desc",
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            const response = await getCustomers(params);

            setCustomers(response.data?.data ?? []);
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
        loadCustomers();
    }, [loadCustomers]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const stats = useMemo(() => {
        const withPhone = statsCustomers.filter(
            (customer) => customer.phone?.trim()
        ).length;

        const withAddress = statsCustomers.filter(
            (customer) => customer.address?.trim()
        ).length;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recent = statsCustomers.filter(
            (customer) => new Date(customer.createdAt) >= thirtyDaysAgo
        ).length;

        return {
            total: pagination.total || statsCustomers.length,
            withPhone,
            withAddress,
            recent,
        };
    }, [statsCustomers, pagination.total]);

    function handleOpenCreate() {
        setEditingCustomer(null);
        setSubmitError(null);
        setOpen(true);
    }

    function handleOpenEdit(customer) {
        setEditingCustomer(customer);
        setSubmitError(null);
        setOpen(true);
    }

    function handleDialogChange(isOpen) {
        setOpen(isOpen);

        if (!isOpen) {
            setEditingCustomer(null);
            setSubmitError(null);
        }
    }

    async function refreshCustomers() {
        await Promise.all([
            loadCustomers(),
            loadStats(),
        ]);
    }

    async function handleSubmitCustomer(data) {
        try {
            setSaving(true);
            setSubmitError(null);

            const payload = {
                ...data,
                lastName: data.lastName?.trim() || undefined,
                phone: data.phone?.trim() || undefined,
                address: data.address?.trim() || undefined,
                remarks: data.remarks?.trim() || undefined,
            };

            if (editingCustomer) {
                await updateCustomer(editingCustomer.id, payload);
            } else {
                await createCustomer(payload);
            }

            setOpen(false);
            setEditingCustomer(null);
            await refreshCustomers();
        } catch (error) {
            console.error(error);

            setSubmitError(
                error.response?.data?.message
                    ?? "Failed to save customer. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteCustomer() {
        if (!deleteTarget) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError(null);

            await archiveCustomer(deleteTarget.id);

            setDeleteTarget(null);
            await refreshCustomers();
        } catch (error) {
            console.error(error);

            setDeleteError(
                error.response?.data?.message
                    ?? "Failed to remove customer. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    }

    const showEmptyCreateState = !loading
        && pagination.total === 0
        && !search.trim();

    const showFilteredEmptyState = !loading
        && pagination.total > 0
        && customers.length === 0;

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div>
                    <p className="mt-1 text-foreground/75">
                        Manage customer contacts, notes, and repair history.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Customers"
                        value={stats.total}
                        description="Active customer records"
                        icon={Users}
                    />

                    <StatCard
                        title="With Phone"
                        value={stats.withPhone}
                        description="Reachable by phone"
                        icon={Phone}
                    />

                    <StatCard
                        title="With Address"
                        value={stats.withAddress}
                        description="With a saved address"
                        icon={MapPin}
                    />

                    <StatCard
                        title="New This Month"
                        value={stats.recent}
                        description="Added in the last 30 days"
                        icon={UserPlus}
                    />
                </div>

                <CustomerToolbar
                    search={search}
                    setSearch={setSearch}
                    onAdd={handleOpenCreate}
                    resultCount={customers.length}
                    totalCount={pagination.total}
                />

                {showFilteredEmptyState ? (
                    <div className="rounded-xl border border-dashed py-16 text-center">
                        <h3 className="text-lg font-semibold">
                            No matching customers
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/75">
                            No customers match &ldquo;{search}&rdquo;. Try a
                            different search term.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => setSearch("")}
                        >
                            Clear search
                        </Button>
                    </div>
                ) : (
                    <CustomerTable
                        customers={customers}
                        loading={loading}
                        onEdit={handleOpenEdit}
                        onDelete={(customer) => {
                            setDeleteError(null);
                            setDeleteTarget(customer);
                        }}
                        onViewRepairs={setRepairHistoryCustomer}
                        onAdd={showEmptyCreateState ? handleOpenCreate : undefined}
                    />
                )}

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
                    open={open}
                    onOpenChange={handleDialogChange}
                >
                    <DialogContent className="gap-3 sm:max-w-2xl">
                        <DialogHeader className="gap-1">
                            <DialogTitle>
                                {editingCustomer
                                    ? "Edit Customer"
                                    : "Add Customer"}
                            </DialogTitle>
                        </DialogHeader>

                        {submitError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {submitError}
                            </div>
                        )}

                        <CustomerForm
                            key={editingCustomer?.id ?? "new"}
                            customer={editingCustomer}
                            loading={saving}
                            onSubmit={handleSubmitCustomer}
                        />
                    </DialogContent>
                </Dialog>

                <CustomerRepairHistorySheet
                    customer={repairHistoryCustomer}
                    open={Boolean(repairHistoryCustomer)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setRepairHistoryCustomer(null);
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
                                Remove customer?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will remove{" "}
                                <span className="font-medium text-foreground">
                                    {getCustomerFullName(deleteTarget)}
                                </span>{" "}
                                from your active customer list. Existing repair
                                records will be kept.
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
                                onClick={handleDeleteCustomer}
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
