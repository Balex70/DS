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
  const [enriched, setEnriched] = useState<string | null>(null)
  const [aiTextsProcessed, setAiTextsProcessed] = useState<string | null>(null)
  const [aiImagesProcessed, setAiImagesProcessed] = useState<string | null>(null)
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  
  const fetchProducts = async (params?: {
    page?: number,
    enriched: string|null,
    aiTextsProcessed: string|null,
    aiImagesProcessed: string|null,
    categoryIds: number[]|null
  }) => {
    try {
      setLoading(true)

      const query = new URLSearchParams()

      if (params?.page) query.append("page", String(params.page))
      if (params?.enriched) query.append("enriched", params.enriched)
      if (params?.aiTextsProcessed) query.append("aiTextsProcessed", params.aiTextsProcessed)
      if (params?.aiImagesProcessed) query.append("aiImagesProcessed", params.aiImagesProcessed)
      if (params?.categoryIds?.length) query.append("categoryIds", params.categoryIds.join(","))

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

    } catch (_err) {
      // do nothing
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchProducts({ page, enriched, aiTextsProcessed, aiImagesProcessed, categoryIds })
  }, [page, enriched, aiTextsProcessed, aiImagesProcessed, categoryIds])

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      <ProductFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        enriched={enriched}
        categoryIds={categoryIds}
        aiTextsProcessed={aiTextsProcessed}
        aiImagesProcessed={aiImagesProcessed}
        onEnrichedChange={(value) => {
          setPage(1)
          setEnriched(value)
        }}
        onAiTextsProcessedChange={(value) => {
          setPage(1)
          setAiTextsProcessed(value)
        }}
        onAiImagesProcessedChange={(value) => {
          setPage(1)
          setAiImagesProcessed(value)
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
            enriched,
            aiTextsProcessed,
            aiImagesProcessed,
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
