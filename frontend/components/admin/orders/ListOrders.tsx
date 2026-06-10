'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { OrderDrawer } from './OrderDrawer';
import { OrderPagination } from './OrderPagination';
import { OrderFilters } from './OrderFilters';
import { DsStatus, Meta, Order, OrderStatus } from '@/types/order';
import { PaymentStatus } from '@/types/payment';
import { Input } from '@/components/ui/input';
import { getErrorStringFromCatch } from '@/helpers/general';
import NotFoundCard from '@/components/common/NotFoundCard';

function ListOrders () {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<OrderStatus | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [dsStatus, setDsStatus] = useState<DsStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * Debounce search
   */
  useEffect(() => {
      const timeout = setTimeout(() => {
          setDebouncedSearch(search)
      }, 500)

      return () => clearTimeout(timeout)
  }, [search])
  
  const fetchOrders = async (params?: {
    page?: number,
    search?: string,
    status: OrderStatus|null,
    paymentStatus: PaymentStatus|null,
    dsStatus: DsStatus|null,
  }) => {
    try {
      setLoading(true)

      const query = new URLSearchParams()

      if (params?.page) query.append("page", String(params.page))
      if (params?.search) query.append("search", params.search)
      if (params?.status) query.append("status", params.status)
      if (params?.paymentStatus) query.append("paymentStatus", params.paymentStatus)
      if (params?.dsStatus) query.append("dsStatus", params.dsStatus)

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

    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
    }
  }

  /**
   * Reset page when search changes
   */
  useEffect(() => {
      setPage(1)
  }, [debouncedSearch])

  /**
   * Fetch orders
   */
  useEffect(() => {
      fetchOrders({ page, search: debouncedSearch, status, paymentStatus, dsStatus })
  }, [page, debouncedSearch, status, paymentStatus, dsStatus])

  if (error) {
    return (
      <NotFoundCard
          title="Error fetching orders"
          description={error}
      />
    )
  }

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md mb-2"
      />
      <OrderFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        status={status}
        paymentStatus={paymentStatus}
        dsStatus={dsStatus}
        onStatusChange={(value) => {
          setPage(1)
          setStatus(value)
        }}
        onPaymentStatusChange={(value) => {
          setPage(1)
          setPaymentStatus(value)
        }}
        onDsStatusChange={(value) => {
          setPage(1)
          setDsStatus(value)
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
      />

    </div>
  )
}

export default ListOrders
