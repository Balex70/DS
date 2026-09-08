'use server'

import { getErrorStringFromCatch } from "@/helpers/general";
import { CommonLogger } from "@/lib/logger/commonLogger";
import { Settings } from "@/types/settings";

const sliceCharacters = 600
// const delay = (ms: number) =>
//     new Promise((resolve) => setTimeout(resolve, ms));
export async function getSettings(): Promise<Settings> {
  try {
    // await delay(3000);
    const headers = {
        'Content-Type': 'application/json',
    };

    const res = await fetch(`${process.env.CORE_API_ENTRYPOINT}/api/store/settings`, {
        method: 'GET',
        headers: headers,
        next: {
            revalidate: 60,
        },
    })

    if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            // JSON response → safe to show error to client
            const errorJson = await res.json();
            throw new Error(errorJson.error || 'Unknown API error');
        } else {
            // HTML / text response → system-level issue (not for client)
            const rawText = await res.text();
            throw new Error(rawText.slice(0, sliceCharacters));
        }
    }

    const result = await res.json()
    return result
  } catch (error) {
      const message = "Failed to get settings: " + getErrorStringFromCatch(error)
      CommonLogger('info', message, 'full')
      throw new Error(message)
  }
}
