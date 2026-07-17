'use client'

import { useState } from 'react';
import { Meta } from '@/types/material';
import { getErrorStringFromCatch } from '@/helpers/general';
import NotFoundCard from '@/components/common/NotFoundCard';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Currency = {
  from: string;
  to: string;
  rate: number;
}
function Currency () {
  const [currency, setCurrency] = useState<Currency[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrency = async () => {
    try {
      setLoading(true)

      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

      // fetch materials
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/currency/sync-rate`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      const currencyRes = await res.json()
      console.log('currencyRes')
      console.log(currencyRes)

    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
    }
  }

  // if (error) {
  //   return (
  //     <NotFoundCard
  //         title="Error fetching currencies"
  //         description={error}
  //     />
  //   )
  // }

  return (
    <div className="w-full main-bg flex flex-col border-b-0 rounded-none">
      <Button onClick={fetchCurrency} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Fetching..." : "Fetch currency"}
      </Button>
    </div>
  )
}

export default Currency
