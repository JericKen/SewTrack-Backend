import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function ProductToolbar({
    search,
    setSearch,
    onAdd,
}) {

    return (

        <div className="flex items-center justify-between gap-4">

            <div className="relative w-full max-w-sm">

                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <Button onClick={onAdd}>

                <Plus className="mr-2 h-4 w-4" />

                Add Product

            </Button>

        </div>

    );

}