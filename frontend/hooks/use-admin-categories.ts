import { useEffect, useState } from "react";
import { Category } from "@/types/category";

export function useAdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/categories`,
                    {
                        credentials: "include",
                    }
                );

                const json = await res.json();
                setCategories(json.data ?? []);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { categories, loading };
}
