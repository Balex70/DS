"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";
import { useState } from "react";
import { SearchBar } from "./search-bar";
import { Spinner } from "@/components/ui/spinner";
import { SearchResults } from "./search-results";
import { useRouter } from "next/navigation";

export function Search() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query);
    const { data, isLoading } = useSearch(debouncedQuery);
    const router = useRouter()
    return (
        <>
            <SearchBar
                value={query}
                onChange={setQuery}
            />

            {debouncedQuery && (
                <div className="absolute z-50 w-full">
                    {isLoading
                        ? <Spinner />
                        :
                        <SearchResults
                            products={data?.products}
                            categories={data?.categories}
                            onSelectProduct={(p) =>
                                router.push(`/product/${p.id}`)
                            }
                            onSelectCategory={(c) =>
                                router.push(`/category/${c.slug}`)
                            }
                        />
                    }
                    
                </div>
            )}
        </>
    )
};
