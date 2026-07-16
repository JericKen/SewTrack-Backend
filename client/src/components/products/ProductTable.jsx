import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
    Pencil,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProductTable({
    products,
    onEdit,
    onDelete,
}) {

    if (products.length === 0) {
        return (
            <div className="rounded-lg border border-dashed py-12 text-center">
                <h3 className="text-lg font-semibold">
                    No products found
                </h3>

                <p className="text-muted-foreground mt-2">
                    Add your first product to begin managing inventory.
                </p>
            </div>
        );
    }

    return (

        <div className="rounded-lg border">

            <Table>

                <TableHeader>

                    <TableRow>

                        <TableHead>Name</TableHead>

                        <TableHead>Category</TableHead>

                        <TableHead>Supplier</TableHead>

                        <TableHead className="text-center">
                            Stock
                        </TableHead>

                        <TableHead className="text-right">
                            Price
                        </TableHead>

                        <TableHead className="text-center">
                            Status
                        </TableHead>

                        <TableHead className="text-right">
                            Actions
                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {products.map((product) => (

                        <TableRow key={product.id}>

                            <TableCell className="font-medium">
                                {product.name}
                            </TableCell>

                            <TableCell>
                                {product.category?.name ?? "-"}
                            </TableCell>

                            <TableCell>
                                {product.supplier?.name ?? "-"}
                            </TableCell>

                            <TableCell className="text-center">
                                {product.stock}
                            </TableCell>

                            <TableCell className="text-right">
                                ₱{Number(product.sellingPrice).toLocaleString()}
                            </TableCell>

                            <TableCell className="text-center">

                                <Badge>

                                    {product.stock <= product.minimumStock
                                        ? "Low Stock"
                                        : "In Stock"}

                                </Badge>

                            </TableCell>

                            <TableCell className="text-right space-x-2">

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(product)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(product)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </div>

    );

}