'use client'

import { useEffect, useState } from "react";
import CategoryNode from "./CategoryNode";
import { Category } from "@/types/category";
import treeBuilder from "./treeBuilder";
import Loader from "@/components/common/Loader";
import NotFoundCard from "@/components/common/NotFoundCard";

function CategoryTree() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true)
    const fetchCategories = async () => {
        try {
            setLoading(true)

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };
            // fetch categories
            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/categories`, {
                method: 'GET',
                credentials: 'include',
                headers: headers,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            const categoriesRes = await res.json()

            setCategories(categoriesRes.data ?? [])

        } catch (_err) {
            // do nothing
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])
    
    if (loading) {
        return <Loader />
    }

    if (!categories || categories.length === 0) {
        return (
          <NotFoundCard
            title="No categories found"
            description="There are no categories to display"
          />
        )
    }

    const data = treeBuilder(categories)

    return (
        <div className="text-sm">
            {data.map(node => (
                <CategoryNode key={node.id} node={node} />
            ))}
        </div>
    );
}

export default CategoryTree;
