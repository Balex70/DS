'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { OrderDrawer } from './OrderDrawer';
import { OrderPagination } from './OrderPagination';
import { OrderFilters } from './OrderFilters';
import { Meta, Order } from '@/types/order';

function ListOrders () {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [enriched, setEnriched] = useState<string | null>(null)
  const [aiTextsProcessed, setAiTextsProcessed] = useState<string | null>(null)
  const [aiImagesProcessed, setAiImagesProcessed] = useState<string | null>(null)
  
  const fetchOrders = async (params?: {
    page?: number,
    enriched: string|null,
    aiTextsProcessed: string|null,
    aiImagesProcessed: string|null,
  }) => {
    try {
      setLoading(true)

      const query = new URLSearchParams()

      if (params?.page) query.append("page", String(params.page))
      if (params?.enriched) query.append("enriched", params.enriched)
      if (params?.aiTextsProcessed) query.append("aiTextsProcessed", params.aiTextsProcessed)
      if (params?.aiImagesProcessed) query.append("aiImagesProcessed", params.aiImagesProcessed)

      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

      // fetch orders
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/orders?${query.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      const ordersRes = await res.json()

      setOrders(ordersRes.data ?? [])
      setMeta(ordersRes.meta ?? null)

    } catch (_err) {
      // do nothing
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchOrders({ page, enriched, aiTextsProcessed, aiImagesProcessed })
  }, [page, enriched, aiTextsProcessed, aiImagesProcessed])

  console.log(orders)
  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      <OrderFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        enriched={enriched}
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
      />
      {loading ? (
        <Loader />
      ) : (
          <>
            <DataTable
              columns={columns()}
              data={orders}
              onRowClick={(order) => {
                setSelectedOrder(order)
                setViewOpen(true)
              }}
            />
            <div className="flex gap-3 mt-4">
              {meta && (
                <OrderPagination
                  meta={meta}
                  onPageChange={(page) => {
                    setPage(page)
                  }}
                />
              )}
            </div>
          </>
      )}

      <OrderDrawer
        open={viewOpen}
        onOpenChange={setViewOpen}
        order={selectedOrder}
        onRefresh={() =>
          fetchOrders({
            page,
            enriched,
            aiTextsProcessed,
            aiImagesProcessed
          })
        }
      />

    </div>
  )
}

export default ListOrders
