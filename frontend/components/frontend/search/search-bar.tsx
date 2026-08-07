'use client'

import { Search, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onClickSearch: () => void;
}

export function SearchBar({
    value,
    onChange,
    onFocus,
    onClickSearch
}: SearchBarProps) {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const query = value.trim();
        if (!query) {
            return;
        }

        onClickSearch();
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputGroup>
                <InputGroupInput
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    placeholder="Search..."
                />
                <InputGroupAddon
                    align="inline-end"
                    className="self-stretch flex p-0"
                    >
                    {value &&
                        <>
                            <InputGroupButton
                                size="icon-xs"
                                aria-label="Clear"
                                onClick={() => onChange("")}
                            >
                                <X />
                            </InputGroupButton>

                            <Separator orientation="vertical" className="my-2 self-stretch" />
                        </>
                    }
                    <InputGroupButton
                        className="h-full px-3 !rounded-r-md mr-1 bg-sky-500 hover:bg-sky-600 text-white"
                        variant="secondary"
                        type="submit"
                        >
                        <Search className="!h-5 !w-5" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </form>
    );
}
