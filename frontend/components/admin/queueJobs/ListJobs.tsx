'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import Loader from '@/components/common/Loader';
import { JobDrawer } from './JobDrawer';
import { DeleteJobDrawer } from './DeleteJobDrawer';
import { JobPagination } from './JobPagination';
import { getCookie, getErrorStringFromCatch } from '@/helpers/general';
import NotFoundCard from '@/components/common/NotFoundCard';
import { Meta, Job } from '@/types/job';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from "sonner";

function ListJobs () {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchFilter, setSearchFilter] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false);
  const [errorDeleting, setErrorDeleting] = useState<string | null>(null)
  
  const fetchJobs = async (params?: {
    page?: number,
    search?: string
  }) => {
    try {
      setLoading(true)

      const query = new URLSearchParams()

      if (params?.page) query.append("page", String(params.page))
      if (params?.search?.trim()) query.append("search", params.search.trim())

      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

      // fetch jobs
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/queue-jobs?${query.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      const jobsRes = await res.json()

      setJobs(jobsRes.data ?? [])
      setMeta(jobsRes.meta ?? null)

    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchJobs({ page, search: searchFilter })
  }, [page, searchFilter])

  const handleDelete = async () => {
      setDeleting(true);

      try {
          // get the csrf token
          await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/sanctum/csrf-cookie`, {
              credentials: 'include',
          });

          const csrfToken = getCookie('XSRF-TOKEN');

          const headers = {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-XSRF-TOKEN': csrfToken!, // get the csrf token
          };

          // delete jobs
          const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/queue-jobs`, {
              method: 'DELETE',
              credentials: 'include',
              headers: headers,
              cache: 'no-cache', // 'no-cache' if you want it fresh each time
          })

          if (!res.ok) {
              const contentType = res.headers.get('content-type') || '';
              if (contentType.includes('application/json')) {
                  const errorJson = await res.json();
                  if (Array.isArray(errorJson.errors)) {
                      errorJson.errors.forEach((error: string, index: number) => {
                          setTimeout(() => toast.error(error), index * 2000);
                      });
                      return;
                  } else {
                      toast.error(errorJson.errors || 'Unknown API error');
                      return;
                  }
              } else {
                  // HTML / text response → system-level issue (not for client)
                  const rawText = await res.text();
                  setErrorDeleting(rawText.slice(0, 400))
                  return;
              }
          }

          toast.success("Deleted jobs successfully");
          fetchJobs({ page, search: searchFilter })
      } catch (err: unknown) {
          setErrorDeleting(getErrorStringFromCatch(err))
      } finally {
          setDeleting(false);
      }
  };

  if (errorDeleting) {
      toast.error(errorDeleting)
      setErrorDeleting(null)
  }

  if (error) {
    return (
      <NotFoundCard
        title="Error fetching jobs"
        description={error}
      />
    )
  }

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      <div className="flex justify-start mb-2">
          <Button onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete all jobs!!!"}
          </Button>
      </div>
      <form
        className="mb-4 flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault()

          setPage(1)
          setSearchFilter(search.trim())
        }}
      >
        <div className="relative flex-1">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search jobs..."
            className="pr-9"
          />

          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearch("")
                setSearchFilter("")
                setPage(1)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit">
          OK
        </Button>
      </form>
      {loading ? (
        <Loader />
      ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Jobs ({meta?.total ?? 0})
              </h2>
            </div>
            <DataTable
              columns={columns({
                onView: (job) => {
                  setSelectedJob(job)
                  setViewOpen(true)
                },
                onDelete: (job) => {
                  setSelectedJob(job)
                  setDeleteOpen(true)
                },
              })}
              data={jobs}
              onRowClick={(job) => {
                setSelectedJob(job)
                setViewOpen(true)
              }}
            />
            <div className="flex gap-3 mt-4">
              {meta && (
                <JobPagination
                  meta={meta}
                  onPageChange={(page) => {
                    setPage(page)
                  }}
                />
              )}
            </div>
          </>
      )}

      <JobDrawer
        open={viewOpen}
        onOpenChange={setViewOpen}
        job={selectedJob}
      />

      <DeleteJobDrawer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={fetchJobs}
        job={selectedJob}
      />
    </div>
  )
}

export default ListJobs
