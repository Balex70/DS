import ListOrders from "@/components/admin/orders/ListOrders";

export default function OrdersPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>
      <ListOrders />
    </>
  )
}
