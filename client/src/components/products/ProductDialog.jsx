import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import ProductForm from "./ProductForm";

import {
    createProduct,
    updateProduct,
} from "@/services/productService";

export default function ProductDialog({

    open,
    onOpenChange,
    categories,
    product,
    onSuccess

}) {

    async function handleSubmit(data) {

        if (product) {
            await updateProduct(product.id, data);
        } else {
            await createProduct(data);
        }

        onOpenChange(false);
        onSuccess();
    }

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-2xl">

                <DialogHeader>

                    <DialogTitle>
                        {product
                               ? "Edit Product"
                            : "Add Product"}
                    </DialogTitle>

                </DialogHeader>

                <ProductForm
                    product={product}
                    categories={categories}
                    onSubmit={handleSubmit}
                />

            </DialogContent>

        </Dialog>

    );

}