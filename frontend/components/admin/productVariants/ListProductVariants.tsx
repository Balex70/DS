'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { EditProductVariantDrawer } from './EditProductVariantDrawer';
import { Meta, ProductVariant, ProductVariantAiStatus } from '@/types/product';
import { getErrorStringFromCatch } from '@/helpers/general';
import NotFoundCard from '@/components/common/NotFoundCard';
import { ProductVariantPagination } from './ProductVariantPagination';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function ListProductVariants ({ productId }: {productId: number}) {
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedProductVariant, setSelectedProductVariant] = useState<ProductVariant | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTranslationsRemoving, setIsTranslationsRemoving] = useState(false)
  
  const fetchProductVariants = async (params: {
    productId: number,
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

  const changeAiStatus = async (newAiStatus: ProductVariantAiStatus) => {
    try {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`
            const parts = value.split(`; ${name}=`)
            if (parts.length === 2) return parts.pop()?.split(";").shift()
        }

        const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN") || "")

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': xsrfToken,
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/product-variants/ai-status-change/${productId}/${newAiStatus}`, {
            method: "PATCH",
            credentials: 'include',
            headers: headers,
            cache: 'no-cache', // 'no-cache' if you want it fresh each time
        })

        if (!response.ok) {
            throw new Error(`Failed to change AI status for product variants: ${response.status}`)
        }

        fetchProductVariants({productId, page})
    } catch (e) {
        console.error("AI status change for variants failed", e)
    } finally {
        //
    }
  }
  const handleTranslationsRemove = async () => {
      try {
          setIsTranslationsRemoving(true)

          const getCookie = (name: string) => {
              const value = `; ${document.cookie}`
              const parts = value.split(`; ${name}=`)
              if (parts.length === 2) return parts.pop()?.split(";").shift()
          }

          const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN") || "")

          const headers = {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-XSRF-TOKEN': xsrfToken,
          };
          const response = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/product-variants/translations-remove/${productId}`, {
              method: "PATCH",
              credentials: 'include',
              headers: headers,
              cache: 'no-cache', // 'no-cache' if you want it fresh each time
          })

          if (!response.ok) {
              throw new Error(`Failed to remove translations for product variants: ${response.status}`)
          }

          fetchProductVariants({productId, page})
      } catch (e) {
          console.error("Failed to remove translations for product variants", e)
      } finally {
          setIsTranslationsRemoving(false)
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
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2 ml-6">
            <Label htmlFor="ai-status">AI status:</Label>
            <Select
                onValueChange={(value) => changeAiStatus(value as ProductVariantAiStatus)}
                >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="AI status" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="queued">Queued</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button onClick={handleTranslationsRemove} disabled={isTranslationsRemoving} className="bg-red-200">
            {isTranslationsRemoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isTranslationsRemoving ? "Removing..." : "Remove translations for all variants!"}
        </Button>
      </div>
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
