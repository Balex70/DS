'use client'

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";

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
                <InputGroupAddon align="inline-end">
                <InputGroupButton
                    size="icon-xs"
                    aria-label="Clear"
                    onClick={() => onChange("")}>
                    <X />
                </InputGroupButton>
                <InputGroupButton
                    variant="secondary"
                    type="submit"
                    >
                    Search
                </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </form>
    );
}
