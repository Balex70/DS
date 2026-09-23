import ListLogs from "@/components/admin/logs/ListLogs";

export default function LogsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
      </div>
      <ListLogs />
    </>
  )
}
