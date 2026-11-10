import ListFailedJobs from "@/components/admin/failedJobs/ListFailedJobs";

export default function FailedJobsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Failed Jobs</h1>
      </div>
      <ListFailedJobs />
    </>
  )
}
