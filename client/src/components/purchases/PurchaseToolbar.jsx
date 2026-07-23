import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PurchaseToolbar({
    search,
    setSearch,
    onAdd,
    totalCount,
}) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Search by supplier..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
                {totalCount != null && (
                    <p className="text-sm text-muted-foreground">
                        {totalCount} purchase{totalCount === 1 ? "" : "s"}
                    </p>
                )}

                <Button onClick={onAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Purchase
                </Button>
            </div>
        </div>
    );
}
