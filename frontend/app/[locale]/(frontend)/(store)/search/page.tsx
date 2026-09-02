import { SearchComponent } from "@/components/frontend/search/search-component";

type Props = {
    searchParams: Promise<{
        q?: string;
    }>;
};

export default async function SearchPage({searchParams}: Props) {
    const { q } = await searchParams
    return (
        <div className="container mx-auto px-4 py-6">
            <SearchComponent q={q} />
        </div>
    );
}
