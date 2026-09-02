'use client'

import { useEffect, useState } from 'react';
import { DataTable } from './dataTable';
import { columns } from "./columns"
import { Currency } from '@/types/currency';
import { getCurrencies } from '@/lib/api/settings';
import SyncCurrencies from './SyncCurrencies';
import { getErrorStringFromCatch } from '@/helpers/general';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';

function ListCurrencies () {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [error, setError] = useState<string | null>(null)

  const fetchCurrencies = async () => {
    try {
      const res = await getCurrencies();

      const currenciesRes = await res.json()

      setCurrencies(currenciesRes.data ?? [])

    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      // finally
    }
  }
  useEffect(() => {
    fetchCurrencies();
  }, [])
  
  if (error) {
    return (
      <Alert className="mt-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <TriangleAlert className="h-4 w-4 !text-yellow-500" />

          <AlertTitle>Something went wrong</AlertTitle>

          <AlertDescription className="space-y-3">
              <p>
                  {error}
              </p>
          </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      <SyncCurrencies
        onRefresh={() =>
          fetchCurrencies()
        } />
      <DataTable
        columns={columns()}
        data={currencies}
      />
    </div>
  )
}

export default ListCurrencies
