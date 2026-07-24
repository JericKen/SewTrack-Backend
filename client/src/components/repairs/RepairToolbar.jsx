import { Plus, Search } from "lucide-react";

import { REPAIR_STATUSES } from "../../validators/repairOrderSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function RepairToolbar({
    search,
    setSearch,
    status,
    setStatus,
    onAdd,
    totalCount,
}) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        className="pl-9"
                        placeholder="Search customer or item type..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                    {totalCount != null && (
                        <p className="text-sm text-muted-foreground">
                            {totalCount} repair{totalCount === 1 ? "" : "s"}
                        </p>
                    )}

                    <Button onClick={onAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Repair
                    </Button>
                </div>
            </div>

            <Select
                value={status}
                onValueChange={setStatus}
            >
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                    {REPAIR_STATUSES.map((item) => (
                        <SelectItem
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
