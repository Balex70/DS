import { Product } from "@/types/product";
import { SearchProductCard } from "./SearchProductCard";

interface SearchProductsProps {
    products: Product[];
}

export function SearchProducts({
    products,
}: SearchProductsProps) {
    return (
        <section>
            <h2 className="mb-4 text-xl font-semibold">
                Products ({products.length})
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <SearchProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
}
