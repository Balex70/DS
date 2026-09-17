'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { LogDrawer } from './LogDrawer';
import { DeleteLogDrawer } from './DeleteLogDrawer';
import { LogPagination } from './LogPagination';
import { LogFilters } from './LogFilters';
import { getErrorStringFromCatch } from '@/helpers/general';
import NotFoundCard from '@/components/common/NotFoundCard';
import { Meta, Log } from '@/types/log';

function ListLogs () {
  const [logs, setLogs] = useState<Log[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [levels, setLevels] = useState<string[]>([])
  const [realms, setRealms] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const fetchLogs = async (params?: {
    page?: number,
    levels: string[]|null
    realms: string[]|null,
  }) => {
    try {
      setLoading(true)

      const query = new URLSearchParams()

      if (params?.page) query.append("page", String(params.page))
      if (params?.levels?.length) query.append("levels", params.levels.join(","))
      if (params?.realms?.length) query.append("realms", params.realms.join(","))

      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

      // fetch logs
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/app-logs?${query.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      const logsRes = await res.json()

      setLogs(logsRes.data ?? [])
      setMeta(logsRes.meta ?? null)

    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchLogs({ page, levels, realms })
  }, [page, levels, realms])

  if (error) {
    return (
      <NotFoundCard
        title="Error fetching logs"
        description={error}
      />
    )
  }

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      <LogFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        levels={levels}
        realms={realms}
        onLevelsChange={(value) => {
          setPage(1)
          setLevels(value)
        }}
        onRealmsChange={(value) => {
          setPage(1)
          setRealms(value)
        }}
      />
      {loading ? (
        <Loader />
      ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Logs ({meta?.total ?? 0})
              </h2>
            </div>
            <DataTable
              columns={columns({
                onView: (log) => {
                  setSelectedLog(log)
                  setViewOpen(true)
                },
                onDelete: (log) => {
                  setSelectedLog(log)
                  setDeleteOpen(true)
                },
              })}
              data={logs}
              onRowClick={(log) => {
                setSelectedLog(log)
                setViewOpen(true)
              }}
            />
            <div className="flex gap-3 mt-4">
              {meta && (
                <LogPagination
                  meta={meta}
                  onPageChange={(page) => {
                    setPage(page)
                  }}
                />
              )}
            </div>
          </>
      )}

      <LogDrawer
        open={viewOpen}
        onOpenChange={setViewOpen}
        log={selectedLog}
      />

      <DeleteLogDrawer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={fetchLogs}
        log={selectedLog}
      />
    </div>
  )
}

export default ListLogs
