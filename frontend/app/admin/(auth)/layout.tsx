export default async function Layout({ children }: { children: React.ReactNode }) {
  return (

    <main className="flex-1 overflow-auto p-4">
      {children}
    </main>

  )
}
