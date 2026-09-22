'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { ProductDrawer } from './ProductDrawer';
import { EditProductDrawer } from './EditProductDrawer';
import { DeleteProductDrawer } from './DeleteProductDrawer';
import { Meta, Product } from '@/types/product';
import { ProductPagination } from './ProductPagination';
import { ProductFilters } from './ProductFilters';
import { getErrorStringFromCatch } from '@/helpers/general';
import NotFoundCard from '@/components/common/NotFoundCard';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ListProducts () {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [enrichStatuses, setEnrichStatuses] = useState<string[]>([])
  const [aiTextsProcessed, setAiTextsProcessed] = useState<string | null>(null)
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const [search, setSearch] = useState("")
  const [searchFilter, setSearchFilter] = useState("")
  const [error, setError] = useState<string | null>(null)
  
  const fetchProducts = async (params?: {
    page?: number,
    enrichStatuses: string[]|null
    aiTextsProcessed: string|null,
    categoryIds: number[]|null,
    search?: string
  }) => {
    try {
      setLoading(true)

      const query = new URLSearchParams()

      if (params?.page) query.append("page", String(params.page))
      if (params?.enrichStatuses?.length) query.append("enrichStatuses", params.enrichStatuses.join(","))
      if (params?.aiTextsProcessed) query.append("aiTextsProcessed", params.aiTextsProcessed)
      if (params?.categoryIds?.length) query.append("categoryIds", params.categoryIds.join(","))
      if (params?.search) query.append("search", params.search)

      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

      // fetch products
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/products?${query.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      const productsRes = await res.json()

      setProducts(productsRes.data ?? [])
      setMeta(productsRes.meta ?? null)

    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchProducts({ page, enrichStatuses, aiTextsProcessed, categoryIds, search: searchFilter })
  }, [page, enrichStatuses, aiTextsProcessed, categoryIds, searchFilter])

  if (error) {
    return (
      <NotFoundCard
        title="Error fetching products"
        description={error}
      />
    )
  }

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      <form
        className="mb-4 flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault()

          setPage(1)
          setSearchFilter(search.trim())
        }}
      >
        <div className="relative flex-1">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="pr-9"
          />

          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearch("")
                setSearchFilter("")
                setPage(1)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit">
          OK
        </Button>
      </form>
      <ProductFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        enrichStatuses={enrichStatuses}
        categoryIds={categoryIds}
        aiTextsProcessed={aiTextsProcessed}
        onEnrichStatusesChange={(value) => {
          setPage(1)
          setEnrichStatuses(value)
        }}
        onAiTextsProcessedChange={(value) => {
          setPage(1)
          setAiTextsProcessed(value)
        }}
        onCategoryIdsChange={(value) => {
          setPage(1)
          setCategoryIds(value)
        }}
      />
      {loading ? (
        <Loader />
      ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Products ({meta?.total ?? 0})
              </h2>
            </div>
            <DataTable
              columns={columns({
                onView: (product) => {
                  setSelectedProduct(product)
                  setViewOpen(true)
                },
                onEdit: (product) => {
                  setSelectedProduct(product)
                  setEditOpen(true)
                },
                onDelete: (product) => {
                  setSelectedProduct(product)
                  setDeleteOpen(true)
                },
              })}
              data={products}
              onRowClick={(product) => {
                setSelectedProduct(product)
                setViewOpen(true)
              }}
            />
            <div className="flex gap-3 mt-4">
              {meta && (
                <ProductPagination
                  meta={meta}
                  onPageChange={(page) => {
                    setPage(page)
                  }}
                />
              )}
            </div>
          </>
      )}

      <ProductDrawer
        open={viewOpen}
        onOpenChange={setViewOpen}
        product={selectedProduct}
        onRefresh={() =>
          fetchProducts({
            page,
            enrichStatuses,
            aiTextsProcessed,
            categoryIds
          })
        }
      />

      <EditProductDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />

      <DeleteProductDrawer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={fetchProducts}
        product={selectedProduct}
      />
    </div>
  )
}

export default ListProducts
