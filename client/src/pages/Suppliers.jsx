import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Mail,
    Phone,
    Truck,
    UserRound,
} from "lucide-react";

import SupplierForm from "../components/suppliers/SupplierForm";
import SupplierTable from "../components/suppliers/SupplierTable";
import SupplierToolbar from "../components/suppliers/SupplierToolbar";

import {
    archiveSupplier,
    createSupplier,
    getSuppliers,
    updateSupplier,
} from "../services/supplierService";

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

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const loadSuppliers = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getSuppliers();
            setSuppliers(response.data ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSuppliers();
    }, [loadSuppliers]);

    const filteredSuppliers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return suppliers;
        }

        return suppliers.filter((supplier) =>
            supplier.name.toLowerCase().includes(query)
            || supplier.contactPerson?.toLowerCase().includes(query)
            || supplier.phone?.toLowerCase().includes(query)
            || supplier.email?.toLowerCase().includes(query)
            || supplier.address?.toLowerCase().includes(query)
        );
    }, [suppliers, search]);

    const stats = useMemo(() => {
        const withContactPerson = suppliers.filter(
            (supplier) => supplier.contactPerson?.trim()
        ).length;

        const withPhone = suppliers.filter(
            (supplier) => supplier.phone?.trim()
        ).length;

        const withEmail = suppliers.filter(
            (supplier) => supplier.email?.trim()
        ).length;

        return {
            total: suppliers.length,
            withContactPerson,
            withPhone,
            withEmail,
        };
    }, [suppliers]);

    function handleOpenCreate() {
        setEditingSupplier(null);
        setSubmitError(null);
        setOpen(true);
    }

    function handleOpenEdit(supplier) {
        setEditingSupplier(supplier);
        setSubmitError(null);
        setOpen(true);
    }

    function handleDialogChange(isOpen) {
        setOpen(isOpen);

        if (!isOpen) {
            setEditingSupplier(null);
            setSubmitError(null);
        }
    }

    async function handleSubmitSupplier(data) {
        try {
            setSaving(true);
            setSubmitError(null);

            const payload = {
                ...data,
                contactPerson: data.contactPerson?.trim() || undefined,
                phone: data.phone?.trim() || undefined,
                email: data.email?.trim() || undefined,
                address: data.address?.trim() || undefined,
                remarks: data.remarks?.trim() || undefined,
            };

            if (editingSupplier) {
                await updateSupplier(editingSupplier.id, payload);
            } else {
                await createSupplier(payload);
            }

            setOpen(false);
            setEditingSupplier(null);
            await loadSuppliers();
        } catch (error) {
            console.error(error);

            setSubmitError(
                error.response?.data?.message
                    ?? "Failed to save supplier. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteSupplier() {
        if (!deleteTarget) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError(null);

            await archiveSupplier(deleteTarget.id);

            setDeleteTarget(null);
            await loadSuppliers();
        } catch (error) {
            console.error(error);

            setDeleteError(
                error.response?.data?.message
                    ?? "Failed to remove supplier. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    }

    const showEmptyCreateState = !loading
        && suppliers.length === 0
        && !search.trim();

    const showFilteredEmptyState = !loading
        && suppliers.length > 0
        && filteredSuppliers.length === 0;

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div>
                    <p className="mt-1 text-foreground/75">
                        Manage vendor contacts for purchases and restocking.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Suppliers"
                        value={stats.total}
                        description="Active vendor records"
                        icon={Truck}
                    />

                    <StatCard
                        title="Contact Persons"
                        value={stats.withContactPerson}
                        description="With a named contact"
                        icon={UserRound}
                    />

                    <StatCard
                        title="With Phone"
                        value={stats.withPhone}
                        description="Reachable by phone"
                        icon={Phone}
                    />

                    <StatCard
                        title="With Email"
                        value={stats.withEmail}
                        description="Reachable by email"
                        icon={Mail}
                    />
                </div>

                <SupplierToolbar
                    search={search}
                    setSearch={setSearch}
                    onAdd={handleOpenCreate}
                    resultCount={filteredSuppliers.length}
                    totalCount={suppliers.length}
                />

                {showFilteredEmptyState ? (
                    <div className="rounded-xl border border-dashed py-16 text-center">
                        <h3 className="text-lg font-semibold">
                            No matching suppliers
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/75">
                            No suppliers match &ldquo;{search}&rdquo;. Try a
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
                    <SupplierTable
                        suppliers={filteredSuppliers}
                        loading={loading}
                        onEdit={handleOpenEdit}
                        onDelete={(supplier) => {
                            setDeleteError(null);
                            setDeleteTarget(supplier);
                        }}
                        onAdd={showEmptyCreateState ? handleOpenCreate : undefined}
                    />
                )}

                <Dialog
                    open={open}
                    onOpenChange={handleDialogChange}
                >
                    <DialogContent className="gap-3 sm:max-w-2xl">
                        <DialogHeader className="gap-1">
                            <DialogTitle>
                                {editingSupplier
                                    ? "Edit Supplier"
                                    : "Add Supplier"}
                            </DialogTitle>
                        </DialogHeader>

                        {submitError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {submitError}
                            </div>
                        )}

                        <SupplierForm
                            key={editingSupplier?.id ?? "new"}
                            supplier={editingSupplier}
                            loading={saving}
                            onSubmit={handleSubmitSupplier}
                        />
                    </DialogContent>
                </Dialog>

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
                                Remove supplier?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will remove{" "}
                                <span className="font-medium text-foreground">
                                    {deleteTarget?.name}
                                </span>{" "}
                                from your active supplier list. Existing
                                purchase records will be kept.
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
                                onClick={handleDeleteSupplier}
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
