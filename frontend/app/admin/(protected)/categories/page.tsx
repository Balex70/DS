import CategoryTree from "@/components/admin/categories/CategoryTree";

export default function CategoriesPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
      </div>
      <CategoryTree />
    </>
  )
}
