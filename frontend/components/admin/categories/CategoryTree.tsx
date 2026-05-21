'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import CategoryNode from "./CategoryNode";
import { Category } from "@/types/category";
import treeBuilder from "./treeBuilder";
import Loader from "@/components/common/Loader";
import NotFoundCard from "@/components/common/NotFoundCard";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/helpers/general";
import { ButtonGroup } from "@/components/ui/button-group"

function CategoryTree() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true)
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>([]);
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

    useEffect(() => {
        const initial = categories
            .filter(c => c.active)
            .map(c => c.id).sort((a, b) => a - b);

        setSelectedIds(initial);
        setSavedIds(initial);
    }, [categories]);

    const isUnchanged =
        selectedIds.length === savedIds.length &&
        selectedIds.every((id, i) => id === savedIds[i]);

    const handleSelectedIds = (id: number) => {
        setSelectedIds(prev => {
            const updated = prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id];
            return updated.sort((a, b) => a - b);
        });
    };
    const handleBulkActive = async () => {
        try {
            const csrfToken = getCookie('XSRF-TOKEN');
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': csrfToken!, // get the csrf token
            };
    
            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/categories/bulk-activate`, {
                method: 'POST',
                credentials: 'include',
                headers: headers,
                body: JSON.stringify({
                    ids: selectedIds,
                    active: true,
                }),
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            setSavedIds([...selectedIds]);
        } catch (err: any) {
            // setError(err.message)
        } finally {
            // setLoading(false)
        }
    }

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
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between my-2">
                <h1 className="text-lg font-medium">Categories</h1>

                <ButtonGroup>
                    {/* <Button variant="outline" onClick={() => setSelectedIds([])}>
                        Clear
                    </Button> */}

                    <Button onClick={handleBulkActive} disabled={isUnchanged}>
                        Activate selected
                    </Button>
                </ButtonGroup>
            </div>

            <div className="text-sm">
                {data.map(node => (
                    <CategoryNode key={node.id} node={node} onSelected={handleSelectedIds} selectedIds={selectedIds} fetchCategories={fetchCategories}/>
                ))}
            </div>
        </>
    );
}

export default CategoryTree;
