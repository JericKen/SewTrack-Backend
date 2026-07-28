import {
    Pencil,
    Tags,
    Trash2,
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

function CategoryTableSkeleton() {
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

export default function CategoryTable({
    categories,
    loading = false,
    onEdit,
    onDelete,
    onAdd,
}) {
    if (loading) {
        return <CategoryTableSkeleton />;
    }

    if (categories.length === 0) {
        return (
            <div className="rounded-xl border border-dashed py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Tags className="h-6 w-6 text-foreground/60" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    No categories found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/75">
                    {onAdd
                        ? "Add your first category to organize products and generate SKUs."
                        : "Try adjusting your search to find what you are looking for."}
                </p>

                {onAdd && (
                    <Button
                        className="mt-6"
                        onClick={onAdd}
                    >
                        Add Category
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
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {categories.map((category) => (
                        <TableRow
                            key={category.id}
                            className="group"
                        >
                            <TableCell>
                                <Badge variant="secondary">
                                    {category.code}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <div className="font-medium">
                                    {category.name}
                                </div>
                            </TableCell>

                            <TableCell className="max-w-[280px] truncate text-foreground/75">
                                {category.description || "—"}
                            </TableCell>

                            <TableCell className="text-sm text-foreground/75">
                                {formatDate(category.createdAt)}
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onEdit(category)}
                                                />
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Edit category
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => onDelete(category)}
                                                />
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            Remove category
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
