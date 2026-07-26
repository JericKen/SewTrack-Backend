import { RefreshCw } from "lucide-react";

import {
    EXPENSE_CATEGORIES,
    PAYMENT_METHODS,
} from "../../validators/expenseSchema";
import { REPAIR_STATUSES } from "../../validators/repairOrderSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const REPORT_TYPES = [
    { value: "sales", label: "Sales" },
    { value: "expenses", label: "Expenses" },
    { value: "profit", label: "Profit & loss" },
    { value: "inventory", label: "Inventory" },
    { value: "repairs", label: "Repairs" },
];

export const INVENTORY_STATUSES = [
    { value: "ALL", label: "All statuses" },
    { value: "IN_STOCK", label: "In stock" },
    { value: "LOW_STOCK", label: "Low stock" },
    { value: "OUT_OF_STOCK", label: "Out of stock" },
];

export default function ReportToolbar({
    reportType,
    setReportType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    category,
    setCategory,
    paymentMethod,
    setPaymentMethod,
    inventoryCategory,
    setInventoryCategory,
    inventoryStatus,
    setInventoryStatus,
    repairStatus,
    setRepairStatus,
    categories = [],
    loading,
    onRefresh,
    rowCount,
}) {
    const showDateRange = reportType !== "inventory";
    const showExpenseFilters = reportType === "expenses";
    const showInventoryFilters = reportType === "inventory";
    const showRepairFilters = reportType === "repairs";

    return (
        <div className="space-y-4 rounded-xl border bg-card p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                    <Label className="text-muted-foreground">Report type</Label>
                    <div className="flex flex-wrap gap-2">
                        {REPORT_TYPES.map((type) => (
                            <Button
                                key={type.value}
                                type="button"
                                size="sm"
                                variant={
                                    reportType === type.value
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setReportType(type.value)}
                            >
                                {type.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {rowCount != null && reportType !== "profit" && (
                        <p className="text-sm text-muted-foreground">
                            {rowCount} row{rowCount === 1 ? "" : "s"}
                        </p>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={loading}
                        onClick={onRefresh}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                {showDateRange && (
                    <>
                        <div className="space-y-1.5">
                            <Label htmlFor="report-start-date">From</Label>
                            <Input
                                id="report-start-date"
                                type="date"
                                className="w-full sm:w-[160px]"
                                value={startDate}
                                onChange={(event) => setStartDate(event.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="report-end-date">To</Label>
                            <Input
                                id="report-end-date"
                                type="date"
                                className="w-full sm:w-[160px]"
                                value={endDate}
                                onChange={(event) => setEndDate(event.target.value)}
                            />
                        </div>
                    </>
                )}

                {showExpenseFilters && (
                    <>
                        <div className="space-y-1.5">
                            <Label>Category</Label>
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
                        </div>

                        <div className="space-y-1.5">
                            <Label>Payment method</Label>
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
                    </>
                )}

                {showInventoryFilters && (
                    <>
                        <div className="space-y-1.5">
                            <Label>Category</Label>
                            <Select
                                value={inventoryCategory}
                                onValueChange={setInventoryCategory}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All categories
                                    </SelectItem>
                                    {categories.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={String(item.id)}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Stock status</Label>
                            <Select
                                value={inventoryStatus}
                                onValueChange={setInventoryStatus}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INVENTORY_STATUSES.map((item) => (
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
                    </>
                )}

                {showRepairFilters && (
                    <div className="space-y-1.5">
                        <Label>Status</Label>
                        <Select
                            value={repairStatus}
                            onValueChange={setRepairStatus}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
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
                )}
            </div>
        </div>
    );
}
