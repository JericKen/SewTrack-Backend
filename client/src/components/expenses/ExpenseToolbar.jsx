import { Plus, Search } from "lucide-react";

import {
    EXPENSE_CATEGORIES,
    PAYMENT_METHODS,
} from "../../validators/expenseSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ExpenseToolbar({
    search,
    setSearch,
    category,
    setCategory,
    paymentMethod,
    setPaymentMethod,
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
                        placeholder="Search description..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                    {totalCount != null && (
                        <p className="text-sm text-muted-foreground">
                            {totalCount} expense{totalCount === 1 ? "" : "s"}
                        </p>
                    )}

                    <Button onClick={onAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Expense
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Select
                    value={category}
                    onValueChange={setCategory}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>

                    <SelectContent>
                        {EXPENSE_CATEGORIES.map((item) => (
                            <SelectItem
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Payment method" />
                    </SelectTrigger>

                    <SelectContent>
                        {PAYMENT_METHODS.map((item) => (
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
        </div>
    );
}
