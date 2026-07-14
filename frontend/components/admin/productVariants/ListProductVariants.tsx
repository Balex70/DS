'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { EditProductVariantDrawer } from './EditProductVariantDrawer';
import { ProductVariant } from '@/types/product';
import { getErrorStringFromCatch } from '@/helpers/general';
import NotFoundCard from '@/components/common/NotFoundCard';

function ListProductVariants ({ productId }: {productId: string}) {
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true)
  const [selectedProductVariant, setSelectedProductVariant] = useState<ProductVariant | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchProductVariants = async (productId: string) => {
    try {
      setLoading(true)

      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

      // fetch product variants
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/product-variants/${productId}`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      const productVariantsRes = await res.json()

      setProductVariants(productVariantsRes.data ?? [])

    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    fetchProductVariants(productId);
  };

  useEffect(() => {
      fetchProductVariants(productId)
  }, [productId])

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
