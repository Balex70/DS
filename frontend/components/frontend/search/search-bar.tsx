'use client'

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function SearchBar({
    value,
    onChange,
}: SearchBarProps) {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const query = value.trim();

        if (!query) {
            return;
        }

        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputGroup>
                <InputGroupInput
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
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
                    onClick={handleSubmit}
                    >
                    Search
                </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </form>
    );
}
