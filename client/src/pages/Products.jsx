import { useEffect, useState } from "react";
import ProductTable from "../components/products/ProductTable";
import { getProducts } from "../services/productService";
import ProductToolbar from "../components/products/ProductToolbar";
import ProductDialog from "../components/products/ProductDialog";
import { getCategories } from "../services/categoryService";

export default function Products() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {

        loadProducts();
        loadCategories();

    }, []);

    async function loadCategories() {

        try {

            const data = await getCategories();

            setCategories(data);

        } catch (error) {

            console.error(error);

        }

    }

    async function loadProducts() {

        const response = await getProducts();

        setProducts(response.data);

    }

    return (

        <div className="space-y-6">

            <div>

                <p className="text-muted-foreground">
                    Manage your store inventory.
                </p>

            </div>
            <ProductToolbar
                search={search}
                setSearch={setSearch}
                onAdd={() => {
                    setSelectedProduct(null);
                    setOpen(true);
                }}
            />

            <ProductTable
                products={products}
                onEdit={(product) => {
                    setSelectedProduct(product);
                    setOpen(true);
                }}
                onDelete={(product) => console.log(product)}
            />

           <ProductDialog
                open={open}
                onOpenChange={setOpen}
                categories={categories}
                product={selectedProduct}
                onSuccess={loadProducts}
            />

        </div>

    );

}