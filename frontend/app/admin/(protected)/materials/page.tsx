import ListMaterials from "@/components/admin/materials/ListMaterials";

export default function PaymentsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Materials</h1>
      </div>
      <ListMaterials />
    </>
  )
}
