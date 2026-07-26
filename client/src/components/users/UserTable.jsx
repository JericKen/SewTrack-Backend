import {
    KeyRound,
    Pencil,
    Shield,
    Trash2,
    UserCog,
    UserRound,
} from "lucide-react";

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

import { formatDate } from "@/utils/date";

function UserTableSkeleton() {
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

function RoleBadge({ role }) {
    if (role === "ADMIN") {
        return (
            <Badge variant="default" className="gap-1">
                <Shield className="h-3 w-3" />
                Admin
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className="gap-1">
            <UserRound className="h-3 w-3" />
            Staff
        </Badge>
    );
}

export default function UserTable({
    users,
    currentUserId,
    loading = false,
    onEdit,
    onResetPassword,
    onArchive,
    onAdd,
}) {
    if (loading) {
        return <UserTableSkeleton />;
    }

    if (users.length === 0) {
        return (
            <div className="rounded-xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <UserCog className="h-6 w-6 text-foreground/60" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    No users found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/75">
                    {onAdd
                        ? "Add your first team member to grant access to SewTrack."
                        : "Try adjusting your search to find what you are looking for."}
                </p>

                {onAdd && (
                    <Button
                        className="mt-6"
                        onClick={onAdd}
                    >
                        Add User
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
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.map((user) => {
                        const isSelf = user.id === currentUserId;
                        const isArchived = !user.isActive;

                        return (
                            <TableRow
                                key={user.id}
                                className={`group ${isArchived ? "opacity-60" : ""}`}
                            >
                                <TableCell>
                                    <div className="font-medium">
                                        {user.name}
                                        {isSelf && (
                                            <span className="ml-2 text-xs font-normal text-foreground/60">
                                                (You)
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-0.5 text-sm text-foreground/75">
                                        {user.email}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <RoleBadge role={user.role} />
                                </TableCell>

                                <TableCell>
                                    {isArchived ? (
                                        <Badge variant="outline">
                                            Archived
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">
                                            Active
                                        </Badge>
                                    )}
                                </TableCell>

                                <TableCell className="text-sm text-foreground/75">
                                    {formatDate(user.createdAt)}
                                </TableCell>

                                <TableCell className="text-right">
                                    {!isArchived && (
                                        <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                            <Tooltip>
                                                <TooltipTrigger
                                                    render={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            onClick={() => onEdit(user)}
                                                        />
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </TooltipTrigger>

                                                <TooltipContent>
                                                    Edit user
                                                </TooltipContent>
                                            </Tooltip>

                                            {!isSelf && (
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger
                                                            render={
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon-sm"
                                                                    onClick={() =>
                                                                        onResetPassword(user)
                                                                    }
                                                                />
                                                            }
                                                        >
                                                            <KeyRound className="h-4 w-4" />
                                                        </TooltipTrigger>

                                                        <TooltipContent>
                                                            Reset password
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger
                                                            render={
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon-sm"
                                                                    onClick={() =>
                                                                        onArchive(user)
                                                                    }
                                                                />
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </TooltipTrigger>

                                                        <TooltipContent>
                                                            Archive user
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
