import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Shield,
    UserCheck,
    UserCog,
    UserRound,
} from "lucide-react";

import UserForm from "../components/users/UserForm";
import UserPasswordForm from "../components/users/UserPasswordForm";
import UserTable from "../components/users/UserTable";
import UserToolbar from "../components/users/UserToolbar";

import {
    archiveUser,
    createUser,
    getUsers,
    resetUserPassword,
    updateUser,
} from "../services/userService";

import { useAuth } from "../context/AuthContext";

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

export default function Users() {
    const { user: currentUser, refreshUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [passwordTarget, setPasswordTarget] = useState(null);
    const [archiveTarget, setArchiveTarget] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [archiving, setArchiving] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [archiveError, setArchiveError] = useState(null);
    const [loadError, setLoadError] = useState(null);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setLoadError(null);

            const response = await getUsers();
            setUsers(response.data ?? []);
        } catch (error) {
            console.error(error);

            setLoadError(
                error.response?.data?.message
                    ?? "Failed to load users. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return users;
        }

        return users.filter((user) =>
            user.name.toLowerCase().includes(query)
            || user.email.toLowerCase().includes(query)
            || user.role.toLowerCase().includes(query)
        );
    }, [users, search]);

    const stats = useMemo(() => {
        const activeUsers = users.filter((user) => user.isActive);
        const admins = activeUsers.filter((user) => user.role === "ADMIN");
        const staff = activeUsers.filter((user) => user.role === "STAFF");

        return {
            total: users.length,
            active: activeUsers.length,
            admins: admins.length,
            staff: staff.length,
        };
    }, [users]);

    function handleOpenCreate() {
        setEditingUser(null);
        setSubmitError(null);
        setOpen(true);
    }

    function handleOpenEdit(user) {
        setEditingUser(user);
        setSubmitError(null);
        setOpen(true);
    }

    function handleDialogChange(isOpen) {
        setOpen(isOpen);

        if (!isOpen) {
            setEditingUser(null);
            setSubmitError(null);
        }
    }

    async function handleSubmitUser(data) {
        try {
            setSaving(true);
            setSubmitError(null);

            const isSelfUpdate = editingUser?.id === currentUser?.id;

            if (editingUser) {
                await updateUser(editingUser.id, data);
            } else {
                await createUser(data);
            }

            setOpen(false);
            setEditingUser(null);
            await loadUsers();

            if (isSelfUpdate) {
                await refreshUser();
            }
        } catch (error) {
            console.error(error);

            setSubmitError(
                error.response?.data?.message
                    ?? "Failed to save user. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleResetPassword({ password }) {
        if (!passwordTarget) {
            return;
        }

        try {
            setResetting(true);
            setPasswordError(null);

            await resetUserPassword(passwordTarget.id, password);

            setPasswordTarget(null);
        } catch (error) {
            console.error(error);

            setPasswordError(
                error.response?.data?.message
                    ?? "Failed to reset password. Please try again."
            );
        } finally {
            setResetting(false);
        }
    }

    async function handleArchiveUser() {
        if (!archiveTarget) {
            return;
        }

        try {
            setArchiving(true);
            setArchiveError(null);

            await archiveUser(archiveTarget.id);

            setArchiveTarget(null);
            await loadUsers();
        } catch (error) {
            console.error(error);

            setArchiveError(
                error.response?.data?.message
                    ?? "Failed to archive user. Please try again."
            );
        } finally {
            setArchiving(false);
        }
    }

    const showEmptyCreateState = !loading
        && users.length === 0
        && !search.trim()
        && !loadError;

    const showFilteredEmptyState = !loading
        && users.length > 0
        && filteredUsers.length === 0;

    if (currentUser?.role !== "ADMIN") {
        return (
            <div className="rounded-xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Shield className="h-6 w-6 text-foreground/60" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    Access restricted
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/75">
                    Only administrators can manage user accounts.
                </p>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div>
                    <p className="mt-1 text-foreground/75">
                        Manage team accounts, roles, and access to SewTrack.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Users"
                        value={stats.total}
                        description="All registered accounts"
                        icon={UserCog}
                    />

                    <StatCard
                        title="Active"
                        value={stats.active}
                        description="Can sign in"
                        icon={UserCheck}
                    />

                    <StatCard
                        title="Administrators"
                        value={stats.admins}
                        description="Full access"
                        icon={Shield}
                    />

                    <StatCard
                        title="Staff"
                        value={stats.staff}
                        description="Standard access"
                        icon={UserRound}
                    />
                </div>

                <UserToolbar
                    search={search}
                    setSearch={setSearch}
                    onAdd={handleOpenCreate}
                    resultCount={filteredUsers.length}
                    totalCount={users.length}
                />

                {loadError && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        {loadError}
                    </div>
                )}

                {showFilteredEmptyState ? (
                    <div className="rounded-xl border border-dashed py-16 text-center">
                        <h3 className="text-lg font-semibold">
                            No matching users
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/75">
                            No users match &ldquo;{search}&rdquo;. Try a
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
                    <UserTable
                        users={filteredUsers}
                        currentUserId={currentUser?.id}
                        loading={loading}
                        onEdit={handleOpenEdit}
                        onResetPassword={(user) => {
                            setPasswordError(null);
                            setPasswordTarget(user);
                        }}
                        onArchive={(user) => {
                            setArchiveError(null);
                            setArchiveTarget(user);
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
                                {editingUser
                                    ? "Edit User"
                                    : "Add User"}
                            </DialogTitle>
                        </DialogHeader>

                        {submitError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {submitError}
                            </div>
                        )}

                        <UserForm
                            key={editingUser?.id ?? "new"}
                            user={editingUser}
                            isSelf={editingUser?.id === currentUser?.id}
                            loading={saving}
                            onSubmit={handleSubmitUser}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={Boolean(passwordTarget)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setPasswordTarget(null);
                            setPasswordError(null);
                        }
                    }}
                >
                    <DialogContent className="gap-3 sm:max-w-md">
                        <DialogHeader className="gap-1">
                            <DialogTitle>
                                Reset Password
                            </DialogTitle>
                        </DialogHeader>

                        <p className="text-sm text-foreground/75">
                            Set a new password for{" "}
                            <span className="font-medium text-foreground">
                                {passwordTarget?.name}
                            </span>
                            .
                        </p>

                        {passwordError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {passwordError}
                            </div>
                        )}

                        <UserPasswordForm
                            key={passwordTarget?.id ?? "reset"}
                            loading={resetting}
                            onSubmit={handleResetPassword}
                        />
                    </DialogContent>
                </Dialog>

                <AlertDialog
                    open={Boolean(archiveTarget)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setArchiveTarget(null);
                            setArchiveError(null);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Archive user?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will deactivate{" "}
                                <span className="font-medium text-foreground">
                                    {archiveTarget?.name}
                                </span>
                                . They will no longer be able to sign in, but
                                their activity history will be preserved.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {archiveError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                {archiveError}
                            </div>
                        )}

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={archiving}>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                variant="destructive"
                                disabled={archiving}
                                onClick={handleArchiveUser}
                            >
                                {archiving ? "Archiving..." : "Archive User"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </TooltipProvider>
    );
}
