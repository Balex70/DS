'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { PaymentDrawer } from './PaymentDrawer';
import { Meta, Payment } from '@/types/payment';
import { PaymentPagination } from './PaymentPagination';
import { PaymentFilters } from './PaymentFilters';
import { Input } from '@/components/ui/input';

function ListPayments () {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [gateway, setGateway] = useState<string | null>(null)

  /**
   * Debounce search
   */
  useEffect(() => {
      const timeout = setTimeout(() => {
          setDebouncedSearch(search)
      }, 500)

      return () => clearTimeout(timeout)
  }, [search])

  const fetchPayments = async (params?: {
    page?: number,
    search?: string,
    status: string|null,
    gateway: string|null,
  }) => {
    try {
      setLoading(true)

      const query = new URLSearchParams()

      if (params?.page) query.append("page", String(params.page))
      if (params?.search) query.append("search", params.search)
      if (params?.status) query.append("status", params.status)
      if (params?.gateway) query.append("gateway", params.gateway)

      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

      // fetch payments
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/payments?${query.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      const paymentsRes = await res.json()

      setPayments(paymentsRes.data ?? [])
      setMeta(paymentsRes.meta ?? null)

    } catch (_err) {
      // do nothing
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

  useEffect(() => {
      fetchPayments({ page, search: debouncedSearch, status, gateway })
  }, [page, debouncedSearch, status, gateway])  

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      <Input
          placeholder="Search payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md mb-2"
      />
      <PaymentFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        status={status}
        gateway={gateway}
        onStatusChange={(value) => {
          setPage(1)
          setStatus(value)
        }}
        onGatewayChange={(value) => {
          setPage(1)
          setGateway(value)
        }}
      />
      {loading ? (
        <Loader />
      ) : (
          <>
            <DataTable
              columns={columns()}
              data={payments}
              onRowClick={(payment) => {
                setSelectedPayment(payment)
                setViewOpen(true)
              }}
            />
            <div className="flex gap-3 mt-4">
              {meta && (
                <PaymentPagination
                  meta={meta}
                  onPageChange={(page) => {
                    setPage(page)
                  }}
                />
              )}
            </div>
          </>
      )}

      <PaymentDrawer
        open={viewOpen}
        onOpenChange={setViewOpen}
        payment={selectedPayment}
      />
    </div>
  )
}

export default ListPayments
