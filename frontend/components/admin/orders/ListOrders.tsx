'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { OrderDrawer } from './OrderDrawer';
import { OrderPagination } from './OrderPagination';
import { OrderFilters } from './OrderFilters';
import { Meta, Order, OrderStatus } from '@/types/order';
import { PaymentStatus } from '@/types/payment';

function ListOrders () {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<OrderStatus | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [dsStatus, setDsStatus] = useState<string | null>(null)
  
  const fetchOrders = async (params?: {
    page?: number,
    status: OrderStatus|null,
    paymentStatus: PaymentStatus|null,
    dsStatus: string|null,
  }) => {
    try {
      setLoading(true)

      const query = new URLSearchParams()

      if (params?.page) query.append("page", String(params.page))
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

    } catch (_err) {
      // do nothing
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchOrders({ page, status, paymentStatus, dsStatus })
  }, [page, status, paymentStatus, dsStatus])

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
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
        onRefresh={() =>
          fetchOrders({
            page,
            status,
            paymentStatus,
            dsStatus,
          })
        }
      />

    </div>
  )
}

export default ListOrders
