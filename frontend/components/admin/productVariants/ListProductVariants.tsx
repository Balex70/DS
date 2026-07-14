'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { EditProductVariantDrawer } from './EditProductVariantDrawer';
import { Meta, ProductVariant } from '@/types/product';
import { getErrorStringFromCatch } from '@/helpers/general';
import NotFoundCard from '@/components/common/NotFoundCard';
import { ProductVariantPagination } from './ProductVariantPagination';

function ListProductVariants ({ productId }: {productId: string}) {
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedProductVariant, setSelectedProductVariant] = useState<ProductVariant | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchProductVariants = async (params: {
    productId: string,
    page?: number,
  }) => {
    try {
      setLoading(true)

      const query = new URLSearchParams()
      if (params?.page) query.append("page", String(params.page))
      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

      // fetch product variants
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/product-variants/${params.productId}?${query.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      const productVariantsRes = await res.json()

      setProductVariants(productVariantsRes.data ?? [])
      setMeta(productVariantsRes.meta ?? null)

    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    fetchProductVariants({page, productId});
  };

  useEffect(() => {
      fetchProductVariants({page, productId})
  }, [page, productId])

  if (error) {
    return (
      <NotFoundCard
        title="Error fetching product variants"
        description={error}
      />
    )
  }

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      {loading ? (
        <Loader />
      ) : (
          <>
            <DataTable
              columns={columns()}
              data={productVariants}
              onRowClick={(productVariant) => {
                setSelectedProductVariant(productVariant)
                setEditOpen(true)
              }}
            />
            <div className="flex gap-3 mt-4">
              {meta && (
                <ProductVariantPagination
                  meta={meta}
                  onPageChange={(page) => {
                    setPage(page)
                  }}
                />
              )}
            </div>
          </>
      )}

      <EditProductVariantDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        productVariant={selectedProductVariant}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

export default ListProductVariants
