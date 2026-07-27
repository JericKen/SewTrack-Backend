import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CustomerToolbar({
    search,
    setSearch,
    onAdd,
    resultCount,
    totalCount,
}) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground/50" />

                <Input
                    className="pl-9"
                    placeholder="Search by name or phone..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                {totalCount != null && (
                    <p className="text-sm text-foreground/75">
                        {resultCount === totalCount
                            ? `${totalCount} customer${totalCount === 1 ? "" : "s"}`
                            : `${resultCount} of ${totalCount} customers`}
                    </p>
                )}

                <Button onClick={onAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </div>
        </div>
    );
}
