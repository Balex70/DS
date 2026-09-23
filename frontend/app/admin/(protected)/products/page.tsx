import ListProducts from "@/components/admin/products/ListProducts";

export default function ProductsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
      </div>
      <ListProducts />
    </>
  )
}
