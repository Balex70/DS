'use client';

import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";
import { useState } from "react";
import { SearchBar } from "./search-bar";
import { useRouter } from "@/i18n/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import { Search, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { MobileDropdownSearchResults } from "./mobile-dropdown-search-results";

export function MobileSearch() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query);
    const { currency } = useCurrency();
    const { data, isLoading } = useSearch(debouncedQuery, currency);
    const router = useRouter()
    const [open, setOpen] = useState(false);
    
    const handleClick = function(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        setOpen(true);
    }

    return (
        <>
            <form onClick={handleClick}>
                <InputGroup>
                    <InputGroupInput
                        onClick={() => setOpen(true)}
                        onFocus={() => setOpen(true)}
                        placeholder="Search..."
                    />
                    <InputGroupAddon
                        align="inline-end"
                        className="self-stretch flex p-0"
                        >
                        <InputGroupButton
                            className="h-full px-3 !rounded-r-md mr-1 bg-sky-500 hover:bg-sky-600 text-white"
                            variant="secondary"
                            type="submit"
                            onClick={() => setOpen(true)}
                            >
                            <Search className="!h-5 !w-5" />
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </form>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="bottom" className="!h-dvh max-h-dvh w-full rounded-none p-0" showCloseButton={false}>
                    <SheetHeader className="pb-0">
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <SearchBar
                                    value={query}
                                    onChange={(value) => {
                                        setQuery(value);
                                    }}
                                    onClickSearch={() => setOpen(true)}
                                />
                            </div>

                            <SheetClose asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="!h-6 !w-6" />
                                </Button>
                            </SheetClose>
                        </div>
                    </SheetHeader>
                    
                    <Separator className="my-0" />

                    <div className="flex-1 min-h-0 p-0">
                        {!isLoading
                            &&
                            <MobileDropdownSearchResults
                                query={debouncedQuery}
                                products={data?.products}
                                categories={data?.categories}
                                onSelectProduct={(p) => {
                                        setOpen(false);
                                        setQuery(""); // clears the input and hides results
                                        router.push(`/product/${p.id}`)
                                    }
                                }
                                onSelectCategory={(c) => {
                                        setOpen(false);
                                        setQuery(""); // clears the input and hides results
                                        router.push(`/category/${c.full_path}`)
                                    }
                                }
                            />
                        }
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
};
