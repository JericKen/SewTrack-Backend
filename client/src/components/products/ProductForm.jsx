import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productSchema } from "@/validators/productSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ProductForm({
    categories,
    onSubmit,
    loading = false,
}) {

    const form = useForm({

        resolver: zodResolver(productSchema),

        defaultValues: {

            name: "",
            categoryId: undefined,
            type: undefined,
            unit: undefined,

            costPrice: 0,
            sellingPrice: 0,

            stockQuantity: 0,
            minimumStock: 5,

            description: ""

        }

    });

    return (

        <Form {...form}>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >

                {/* Product Name */}

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>
                                Product Name
                            </FormLabel>

                            <FormControl>

                                <Input
                                    placeholder="Enter product name"
                                    {...field}
                                />

                            </FormControl>

                            <FormMessage />

                        </FormItem>

                    )}
                />

                {/* Category */}

                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>
                                Category
                            </FormLabel>

                            <Select
                                value={field.value?.toString()}
                                onValueChange={(value) =>
                                    field.onChange(Number(value))
                                }
                            >

                                <FormControl>

                                    <SelectTrigger>

                                        <SelectValue placeholder="Select category" />

                                    </SelectTrigger>

                                </FormControl>

                                <SelectContent>

                                    {categories.map((category) => (

                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >

                                            {category.name}

                                        </SelectItem>

                                    ))}

                                </SelectContent>

                            </Select>

                            <FormMessage />

                        </FormItem>

                    )}
                />

                {/* Product Type */}

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>
                                Product Type
                            </FormLabel>

                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >

                                <FormControl>

                                    <SelectTrigger>

                                        <SelectValue placeholder="Select product type" />

                                    </SelectTrigger>

                                </FormControl>

                                <SelectContent>

                                    <SelectItem value="RESALE">
                                        Resale
                                    </SelectItem>

                                    <SelectItem value="MANUFACTURED">
                                        Manufactured
                                    </SelectItem>

                                </SelectContent>

                            </Select>

                            <FormMessage />

                        </FormItem>

                    )}
                />

                {/* Unit */}

                <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>
                                Unit
                            </FormLabel>

                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >

                                <FormControl>

                                    <SelectTrigger>

                                        <SelectValue placeholder="Select unit" />

                                    </SelectTrigger>

                                </FormControl>

                                <SelectContent>

                                    <SelectItem value="PCS">PCS</SelectItem>
                                    <SelectItem value="METER">Meter</SelectItem>
                                    <SelectItem value="PACK">Pack</SelectItem>
                                    <SelectItem value="PAIR">Pair</SelectItem>
                                    <SelectItem value="ROLL">Roll</SelectItem>
                                    <SelectItem value="BUNDLE">Bundle</SelectItem>

                                </SelectContent>

                            </Select>

                            <FormMessage />

                        </FormItem>

                    )}
                />

                {/* Prices */}

                <div className="grid grid-cols-2 gap-4">

                    <FormField
                        control={form.control}
                        name="costPrice"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>
                                    Cost Price
                                </FormLabel>

                                <FormControl>

                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                    />

                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sellingPrice"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>
                                    Selling Price
                                </FormLabel>

                                <FormControl>

                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                    />

                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                </div>

                {/* Stock */}

                <div className="grid grid-cols-2 gap-4">

                    <FormField
                        control={form.control}
                        name="stockQuantity"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>
                                    Initial Stock
                                </FormLabel>

                                <FormControl>

                                    <Input
                                        type="number"
                                        {...field}
                                    />

                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={form.control}
                        name="minimumStock"
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>
                                    Minimum Stock
                                </FormLabel>

                                <FormControl>

                                    <Input
                                        type="number"
                                        {...field}
                                    />

                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                </div>

                {/* Description */}

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (

                        <FormItem>

                            <FormLabel>
                                Description
                            </FormLabel>

                            <FormControl>

                                <Textarea
                                    rows={4}
                                    placeholder="Product description (optional)"
                                    {...field}
                                />

                            </FormControl>

                            <FormMessage />

                        </FormItem>

                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >

                    {loading
                        ? "Saving..."
                        : "Save Product"}

                </Button>

            </form>

        </Form>

    );

}