import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductToolbar({
    search,
    setSearch,
    onAdd,
    resultCount,
    totalCount,
}) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Search by name, SKU, or category..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                {totalCount != null && (
                    <p className="text-sm text-muted-foreground">
                        {resultCount === totalCount
                            ? `${totalCount} product${totalCount === 1 ? "" : "s"}`
                            : `${resultCount} of ${totalCount} products`}
                    </p>
                )}

                <Button onClick={onAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>
        </div>
    );
}
