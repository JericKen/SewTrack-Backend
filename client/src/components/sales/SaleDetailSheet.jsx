import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { formatCurrency } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";

const PAYMENT_LABELS = {
    CASH: "Cash",
    GCASH: "GCash",
    BANK_TRANSFER: "Bank Transfer",
};

function DetailRow({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}

export default function SaleDetailSheet({
    sale,
    open,
    onOpenChange,
}) {
    if (!sale) {
        return null;
    }

    const isVoided = sale.status === "VOIDED";

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>
                        {sale.invoiceNo}
                    </SheetTitle>
                    <SheetDescription>
                        Sale details and line items
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 px-4 pb-4">
                    <div className="space-y-3">
                        <DetailRow
                            label="Date"
                            value={formatDateTime(sale.createdAt)}
                        />
                        <DetailRow
                            label="Customer"
                            value={sale.customerName || "Walk-in"}
                        />
                        <DetailRow
                            label="Payment"
                            value={PAYMENT_LABELS[sale.paymentMethod]
                                ?? sale.paymentMethod}
                        />
                        <DetailRow
                            label="Status"
                            value={
                                isVoided
                                    ? (
                                        <Badge variant="destructive">
                                            Voided
                                        </Badge>
                                    )
                                    : (
                                        <Badge variant="secondary">
                                            Completed
                                        </Badge>
                                    )
                            }
                        />
                    </div>

                    {sale.remarks && (
                        <>
                            <Separator />
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Remarks
                                </p>
                                <p className="text-sm">
                                    {sale.remarks}
                                </p>
                            </div>
                        </>
                    )}

                    <Separator />

                    <div className="space-y-3">
                        <h3 className="text-sm font-medium">
                            Line Items
                        </h3>

                        <div className="rounded-xl border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">
                                            Qty
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Subtotal
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {sale.items?.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {item.product?.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.product?.sku}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-center tabular-nums">
                                                {item.quantity}
                                            </TableCell>

                                            <TableCell className="text-right tabular-nums">
                                                {formatCurrency(Number(item.subtotal))}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    <TableRow className="hover:bg-transparent">
                                        <TableCell
                                            colSpan={2}
                                            className="text-right font-medium"
                                        >
                                            Total
                                        </TableCell>
                                        <TableCell className="text-right text-base font-semibold tabular-nums">
                                            {formatCurrency(Number(sale.totalAmount))}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
