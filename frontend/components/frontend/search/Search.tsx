"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";
import { useEffect, useRef, useState } from "react";
import { SearchBar } from "./search-bar";
import { DropdownSearchResults } from "./dropdown-search-results";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";

export function Search() {
    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const debouncedQuery = useDebounce(query);
    const { currency } = useCurrency();
    const { data, isLoading } = useSearch(debouncedQuery, currency);
    const router = useRouter()
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            <SearchBar
                value={query}
                onChange={(value) => {
                    setQuery(value);
                    setShowResults(value.trim().length > 0);
                }}
                onFocus={() => {
                    if (query.trim()) {
                        setShowResults(true);
                    }
                }}
                onClickSearch={() => setShowResults(false)}
            />

            {showResults && debouncedQuery && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full">
                    {!isLoading
                        &&
                        <DropdownSearchResults
                            products={data?.products}
                            categories={data?.categories}
                            onSelectProduct={(p) => {
                                    setShowResults(false);
                                    setQuery(""); // clears the input and hides results
                                    router.push(`/product/${p.id}`)
                                }
                            }
                            onSelectCategory={(c) => {
                                    setShowResults(false);
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
