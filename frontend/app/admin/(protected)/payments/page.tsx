import ListPayments from "@/components/admin/payments/ListPayments";

export default function PaymentsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
      </div>
      <ListPayments />
    </>
  )
}
