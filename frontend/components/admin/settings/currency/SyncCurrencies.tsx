'use client'

import { useState } from 'react';
import { getErrorStringFromCatch } from '@/helpers/general';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

function SyncCurrencies ({
  onRefresh
}: {
  onRefresh: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrencyRate = async () => {
    try {
      setLoading(true)

      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

      // fetch/sync currency
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/currency/sync-rate`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })
      
      if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const errorJson = await res.json();
            if (Array.isArray(errorJson.errors)) {
                errorJson.errors.forEach((error: string, index: number) => {
                    setTimeout(() => toast.error(error), index * 2000);
                });
                return;
            } else {
                toast.error(errorJson.message || 'Unknown API error');
                return;
            }
        } else {
            // HTML / text response → system-level issue (not for client)
            const rawText = await res.text();
            setError(rawText.slice(0, 400));
            return;
        }
      }

      toast.success("Currencies updated");
    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
      onRefresh()
    }
  }

  if (error) {
    toast.error(error)
    setError(null)
  }

  return (
    <Button
      onClick={fetchCurrencyRate}
      disabled={loading}
      className="w-full max-w-xs m-2"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Fetching..." : "Fetch currency"}
    </Button>
  )
}

export default SyncCurrencies
