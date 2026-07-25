import {
    EXPENSE_CATEGORY_LABELS,
    PAYMENT_METHOD_LABELS,
} from "../../validators/expenseSchema";

import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { formatCurrency } from "@/utils/currency";
import { formatDate, formatDateTime } from "@/utils/date";

function DetailRow({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}

export default function ExpenseDetailSheet({
    expense,
    open,
    onOpenChange,
}) {
    if (!expense) {
        return null;
    }

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>
                        Expense #{expense.id}
                    </SheetTitle>
                    <SheetDescription>
                        Expense details and payment info
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 px-4 pb-4">
                    <div className="space-y-3">
                        <DetailRow
                            label="Date"
                            value={formatDate(expense.expenseDate)}
                        />
                        <DetailRow
                            label="Amount"
                            value={formatCurrency(Number(expense.amount))}
                        />
                        <DetailRow
                            label="Category"
                            value={
                                EXPENSE_CATEGORY_LABELS[expense.category]
                                    ?? expense.category
                            }
                        />
                        <DetailRow
                            label="Payment Method"
                            value={
                                PAYMENT_METHOD_LABELS[expense.paymentMethod]
                                    ?? expense.paymentMethod
                            }
                        />
                    </div>

                    <Separator />

                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                            Description
                        </p>
                        <p className="text-sm">
                            {expense.description}
                        </p>
                    </div>

                    {expense.remarks && (
                        <>
                            <Separator />

                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Remarks
                                </p>
                                <p className="text-sm">
                                    {expense.remarks}
                                </p>
                            </div>
                        </>
                    )}

                    <Separator />

                    <div className="space-y-3">
                        <DetailRow
                            label="Created"
                            value={formatDateTime(expense.createdAt)}
                        />
                        <DetailRow
                            label="Last Updated"
                            value={formatDateTime(expense.updatedAt)}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
