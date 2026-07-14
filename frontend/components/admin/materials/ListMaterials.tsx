'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { MaterialDrawer } from './MaterialDrawer';
import { Meta, Material } from '@/types/material';
import { MaterialPagination } from './MaterialPagination';
import { getErrorStringFromCatch } from '@/helpers/general';
import NotFoundCard from '@/components/common/NotFoundCard';

function ListMaterials () {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const fetchMaterials = async (params?: {
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

      // fetch materials
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/materials`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      const materialsRes = await res.json()

      setMaterials(materialsRes.data ?? [])
      setMeta(materialsRes.meta ?? null)

    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchMaterials({ page })
  }, [page])  

  if (error) {
    return (
      <NotFoundCard
          title="Error fetching materials"
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
              data={materials}
              onRowClick={(material) => {
                setSelectedMaterial(material)
                setViewOpen(true)
              }}
            />
            <div className="flex gap-3 mt-4">
              {meta && (
                <MaterialPagination
                  meta={meta}
                  onPageChange={(page) => {
                    setPage(page)
                  }}
                />
              )}
            </div>
          </>
      )}

      <MaterialDrawer
        open={viewOpen}
        onOpenChange={setViewOpen}
        material={selectedMaterial}
        onRefresh={fetchMaterials}
      />
    </div>
  )
}

export default ListMaterials
