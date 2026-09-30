import ListCurrencies from "@/components/admin/currencies/ListCurrencies";

export default function CurrencyPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Currencies</h1>
      </div>
      <ListCurrencies />
    </>
  )
}
