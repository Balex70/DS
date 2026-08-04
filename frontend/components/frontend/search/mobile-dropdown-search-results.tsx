"use client";

import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Card } from "@/components/ui/card";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { useCurrency } from "@/context/CurrencyContext";

type DropdownSearchResultsProps = {
    query: string;
    products?: Product[];
    categories?: Category[];
    onSelectProduct: (product: Product) => void;
    onSelectCategory: (category: Category) => void;
}

export function MobileDropdownSearchResults({
    query,
    products = [],
    categories = [],
    onSelectProduct,
    onSelectCategory,
}: DropdownSearchResultsProps) {
    const { currency } = useCurrency();
    const hasResults =
        products.length > 0 || categories.length > 0;
    
    products.splice(5);

    if (!hasResults && query !== "") {
        return (
            <Card className="mt-0 p-3 text-sm text-muted-foreground !border-0 !shadow-none !ring-0">
                No results found
            </Card>
        );
    }
    
    if (!hasResults && query === "") {
        return (
            <Card className="mt-0 p-3 text-sm text-muted-foreground !border-0 !shadow-none !ring-0">
                Start typing...
            </Card>
        );
    }

    return (
        <Card className="w-full mt-0 p-3 text-sm !border-0 !shadow-none !ring-0">
            {/* Products */}
            {products.length > 0 && (
                <div className="w-full">
                    <div className="text-xs font-medium text-muted-foreground mb-2 pl-2 mr-4 pr-4">
                        Products                        
                    </div>

                    {products.map((product) => (
                        <button
                            key={product.id}
                            onClick={() =>
                                onSelectProduct(product)
                            }
                            className="flex w-full items-center justify-between pl-2 pr-4 py-1.5 rounded-md text-sm hover:bg-muted flex justify-between"
                        >
                            <span className="truncate">{product.name_processed ?? product.name_raw}</span>

                            {product.price && (
                                <span className="text-xs text-muted-foreground">
                                    <PriceRenderer value={product.price} />
                                    {(currency !== "USD" && product.currency_price) && (
                                        <span className="ml-0 text-xs font-normal text-muted-foreground">
                                            (
                                            <PriceRenderer
                                                value={product.currency_price}
                                                currency={currency}
                                            />
                                            )
                                        </span>
                                    )}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
                <div>
                    <div className="px-2 text-xs font-medium text-muted-foreground mb-1">
                        Categories
                    </div>

                    <div className="space-y-1">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() =>
                                    onSelectCategory(category)
                                }
                                className="flex w-full items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-muted"
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
