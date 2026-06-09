'use client'

import { useEffect, useState } from "react";
import CategoryNode from "./CategoryNode";
import { Category } from "@/types/category";
import treeBuilder from "./treeBuilder";
import Loader from "@/components/common/Loader";
import NotFoundCard from "@/components/common/NotFoundCard";
import { Button } from "@/components/ui/button";
import { getCookie, getErrorStringFromCatch } from "@/helpers/general";
import { ButtonGroup } from "@/components/ui/button-group"
import { toast } from "sonner";

function CategoryTree() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true)
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>([]);
    const [syncFullPathsLoading, setSyncFullPathsLoading] = useState(false)
    const [errorFetch, setErrorFetch] = useState<string | null>(null)
    const [errorBulkActive, setErrorBulkActive] = useState<string | null>(null)
    const [errorSyncFullPaths, setErrorSyncFullPaths] = useState<string | null>(null)

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

        } catch (err: unknown) {
            setErrorFetch(getErrorStringFromCatch(err))
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

            if (!res.ok) {
                const data = await res.json().catch(() => null)

                throw new Error(data?.message || `Request failed (${res.status})`)
            }

            setSavedIds([...selectedIds]);
        } catch (err: unknown) {
            setErrorBulkActive(getErrorStringFromCatch(err))
        } finally {
            // setLoading(false)
        }
    }

    const handleSyncFullPaths = async () => {
        try {
            setSyncFullPathsLoading(true)
            const csrfToken = getCookie('XSRF-TOKEN');
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': csrfToken!, // get the csrf token
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/categories/sync-full-paths`, {
                method: 'POST',
                credentials: 'include',
                headers: headers,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
            })

            if (!res.ok) {
                setSyncFullPathsLoading(false);
                const data = await res.json().catch(() => null)
                throw new Error(data?.message || `Request failed (${res.status})`)
            }

            setSyncFullPathsLoading(false);
        } catch (err: unknown) {
            setErrorSyncFullPaths(getErrorStringFromCatch(err))
        } finally {
            // setLoading(false)
        }
    }

    if (loading) {
        return <Loader />
    }

    if (errorFetch) {
        return (
            <NotFoundCard
                title="Error fetching categories"
                description={errorFetch}
            />
        )
    }

    if (errorBulkActive) {
        toast.error(errorBulkActive)
        setErrorBulkActive(null)
    }

    if (errorSyncFullPaths) {
        toast.error(errorSyncFullPaths)
        setErrorSyncFullPaths(null)
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
                    <Button onClick={handleSyncFullPaths} disabled={syncFullPathsLoading}>
                        Sync Full Paths
                    </Button>
                </ButtonGroup>

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
