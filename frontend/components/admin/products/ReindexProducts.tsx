'use client'

import { useState } from 'react';
import { getErrorStringFromCatch } from '@/helpers/general';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

function ReindexProducts () {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runReindex = async () => {
    try {
      setLoading(true)

      const getCookie = (name: string) => {
          const value = `; ${document.cookie}`
          const parts = value.split(`; ${name}=`)
          if (parts.length === 2) return parts.pop()?.split(";").shift()
      }
      const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN") || "")
      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': xsrfToken,
      };

      // fetch/sync currency
      const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/products/reindex`, {
          method: 'POST',
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

      const data = await res.json();

      if (data.message !== 'Products reindex queued') {
        throw new Error('Unexpected API response');
      }

      toast.success(data.message);
    } catch (err: unknown) {
      setError(getErrorStringFromCatch(err))
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    toast.error(error)
    setError(null)
  }

  return (
    <Button
      onClick={runReindex}
      disabled={loading}
      className="w-full max-w-xs m-2"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Reindexing..." : "Reindex Products"}
    </Button>
  )
}

export default ReindexProducts
