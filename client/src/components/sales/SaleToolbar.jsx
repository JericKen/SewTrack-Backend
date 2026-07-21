import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const PAYMENT_METHODS = [
    { value: "ALL", label: "All methods" },
    { value: "CASH", label: "Cash" },
    { value: "GCASH", label: "GCash" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
];

const STATUSES = [
    { value: "ALL", label: "All statuses" },
    { value: "COMPLETED", label: "Completed" },
    { value: "VOIDED", label: "Voided" },
];

export default function SaleToolbar({
    search,
    setSearch,
    paymentMethod,
    setPaymentMethod,
    status,
    setStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
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
                        placeholder="Search invoice or customer..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                    {totalCount != null && (
                        <p className="text-sm text-muted-foreground">
                            {totalCount} sale{totalCount === 1 ? "" : "s"}
                        </p>
                    )}

                    <Button onClick={onAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Sale
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                >
                    <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="Payment method" />
                    </SelectTrigger>

                    <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                            <SelectItem
                                key={method.value}
                                value={method.value}
                            >
                                {method.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={status}
                    onValueChange={setStatus}
                >
                    <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>

                    <SelectContent>
                        {STATUSES.map((item) => (
                            <SelectItem
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    type="date"
                    className="w-full sm:w-[160px]"
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                    aria-label="From date"
                />

                <Input
                    type="date"
                    className="w-full sm:w-[160px]"
                    value={dateTo}
                    onChange={(event) => setDateTo(event.target.value)}
                    aria-label="To date"
                />
            </div>
        </div>
    );
}
