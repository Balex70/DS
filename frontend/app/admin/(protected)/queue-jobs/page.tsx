import ListJobs from "@/components/admin/queueJobs/ListJobs";

export default function QueueJobsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Queue Jobs</h1>
      </div>
      <ListJobs />
    </>
  )
}
