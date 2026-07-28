import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    FileText,
    Tags,
} from "lucide-react";

import CategoryForm from "../components/categories/CategoryForm";
import CategoryTable from "../components/categories/CategoryTable";
import CategoryToolbar from "../components/categories/CategoryToolbar";

import {
    archiveCategory,
    createCategory,
    getCategories,
    updateCategory,
} from "../services/categoryService";

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

function isWithinLast30Days(dateString) {
    if (!dateString) {
        return false;
    }

    const createdAt = new Date(dateString);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    return createdAt >= cutoff;
}

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getCategories();
            setCategories(response.data ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return categories;
        }

        return categories.filter((category) =>
            category.name.toLowerCase().includes(query)
            || category.code?.toLowerCase().includes(query)
            || category.description?.toLowerCase().includes(query)
        );
    }, [categories, search]);

    const stats = useMemo(() => {
        const withDescription = categories.filter(
            (category) => category.description?.trim()
        ).length;

        const addedRecently = categories.filter(
            (category) => isWithinLast30Days(category.createdAt)
        ).length;

        return {
            total: categories.length,
            withDescription,
            addedRecently,
        };
    }, [categories]);

    function handleOpenCreate() {
        setEditingCategory(null);
        setSubmitError(null);
        setOpen(true);
    }

    function handleOpenEdit(category) {
        setEditingCategory(category);
        setSubmitError(null);
        setOpen(true);
    }

    function handleDialogChange(isOpen) {
        setOpen(isOpen);

        if (!isOpen) {
            setEditingCategory(null);
            setSubmitError(null);
        }
    }

    async function handleSubmitCategory(data) {
        try {
            setSaving(true);
            setSubmitError(null);

            const payload = {
                ...data,
                description: data.description?.trim() || undefined,
            };

            if (editingCategory) {
                await updateCategory(editingCategory.id, payload);
            } else {
                await createCategory(payload);
            }

            setOpen(false);
            setEditingCategory(null);
            await loadCategories();
        } catch (error) {
            console.error(error);

            setSubmitError(
                error.response?.data?.message
                    ?? "Failed to save category. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteCategory() {
        if (!deleteTarget) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError(null);

            await archiveCategory(deleteTarget.id);

            setDeleteTarget(null);
            await loadCategories();
        } catch (error) {
            console.error(error);

            setDeleteError(
                error.response?.data?.message
                    ?? "Failed to remove category. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    }

    const showEmptyCreateState = !loading
        && categories.length === 0
        && !search.trim();

    const showFilteredEmptyState = !loading
        && categories.length > 0
        && filteredCategories.length === 0;

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div>
                    <p className="mt-1 text-foreground/75">
                        Organize products with category codes used for SKU
                        generation.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        title="Total Categories"
                        value={stats.total}
                        description="Active product groupings"
                        icon={Tags}
                    />

                    <StatCard
                        title="With Description"
                        value={stats.withDescription}
                        description="Documented categories"
                        icon={FileText}
                    />

                    <StatCard
                        title="Added Recently"
                        value={stats.addedRecently}
                        description="Created in the last 30 days"
                        icon={CalendarDays}
                    />
                </div>

                <CategoryToolbar
                    search={search}
                    setSearch={setSearch}
                    onAdd={handleOpenCreate}
                    resultCount={filteredCategories.length}
                    totalCount={categories.length}
                />

                {showFilteredEmptyState ? (
                    <div className="rounded-xl border border-dashed py-16 text-center">
                        <h3 className="text-lg font-semibold">
                            No matching categories
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/75">
                            No categories match &ldquo;{search}&rdquo;. Try a
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
                    <CategoryTable
                        categories={filteredCategories}
                        loading={loading}
                        onEdit={handleOpenEdit}
                        onDelete={(category) => {
                            setDeleteError(null);
                            setDeleteTarget(category);
                        }}
                        onAdd={showEmptyCreateState ? handleOpenCreate : undefined}
                    />
                )}

                <Dialog
                    open={open}
                    onOpenChange={handleDialogChange}
                >
                    <DialogContent className="gap-3 sm:max-w-lg">
                        <DialogHeader className="gap-1">
                            <DialogTitle>
                                {editingCategory
                                    ? "Edit Category"
                                    : "Add Category"}
                            </DialogTitle>
                        </DialogHeader>

                        {submitError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {submitError}
                            </div>
                        )}

                        <CategoryForm
                            key={editingCategory?.id ?? "new"}
                            category={editingCategory}
                            loading={saving}
                            onSubmit={handleSubmitCategory}
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
                                Remove category?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will remove{" "}
                                <span className="font-medium text-foreground">
                                    {deleteTarget?.name}
                                </span>{" "}
                                ({deleteTarget?.code}) from your active category
                                list. Existing products in this category will
                                remain unchanged.
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
                                onClick={handleDeleteCategory}
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
