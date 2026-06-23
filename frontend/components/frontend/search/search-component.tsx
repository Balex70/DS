'use client'

import { SearchProducts } from "./SearchProducts";
import { useFullSearch } from "@/hooks/use-full-search";

interface SearchComponentProps {
    q: string | undefined;
}

export function SearchComponent({q}: SearchComponentProps) {
    const { data, isLoading } = useFullSearch(q ? q : "");
    
    if (isLoading) {
        return (
            <div className="py-12 text-center text-muted-foreground">
                Loading...
            </div>
        );
    }
    if (!data?.data?.length) {
        return (
            <div className="py-12 text-center text-muted-foreground">
                No results found for <span className="font-medium">&apos;{q}&apos;</span>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {data?.data?.length > 0 && (
                <SearchProducts products={data?.data} />
            )}
        </div>
    );
}
