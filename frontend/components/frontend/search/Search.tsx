"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";
import { useState } from "react";
import { SearchBar } from "./search-bar";
import { Spinner } from "@/components/ui/spinner";
import { DropdownSearchResults } from "./dropdown-search-results";
import { useRouter } from "next/navigation";

export function Search() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query);
    const { data, isLoading } = useSearch(debouncedQuery);
    const router = useRouter()

    return (
        <div className="relative w-full">
            <SearchBar
                value={query}
                onChange={setQuery}
            />

            {debouncedQuery && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full">
                    {!isLoading
                        &&
                        <DropdownSearchResults
                            products={data?.products}
                            categories={data?.categories}
                            onSelectProduct={(p) => {
                                    setQuery(""); // clears the input and hides results
                                    router.push(`/product/${p.id}`)
                                }
                            }
                            onSelectCategory={(c) => {
                                    setQuery(""); // clears the input and hides results
                                    router.push(`/category/${c.full_path}`)
                                }
                            }
                        />
                    }
                    
                </div>
            )}
        </div>
    )
};
