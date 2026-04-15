'use server'

import { getErrorStringFromCatch } from "@/helpers/general";
import { CommonLogger } from "@/lib/logger/commonLogger";
import { cookies } from 'next/headers'

const sliceCharacters = 600;

// Not working with Sanctum
export async function userLogin(email: string, password: string): Promise<any> {
  try {
      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };

      const res = await fetch(`${process.env.CORE_API_ENTRYPOINT}/api/users/loginWithToken`, {
          method: 'POST',
          credentials: 'include',
          headers: headers,
          body: JSON.stringify({
            email,
            password,
          }),
          cache: 'no-cache', // 'no-cache' if you want it fresh each time
      })

      if (!res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
              const errorJson = await res.json();
              return { error: errorJson.message || 'Unknown API error' };
          } else {
              // HTML / text response → system-level issue (not for client)
              const rawText = await res.text();
              throw new Error(rawText.slice(0, sliceCharacters));
          }
      }

      const data = await res.json()

      if (!data.token) {
          return { error: data.message || 'Unknown API error' };
      }

      return { token: data.token, refresh_token: data.refresh_token }
  } catch (error) {
      const message = "Failed to userLogin: " + getErrorStringFromCatch(error)
      CommonLogger('info', message, 'full')
      throw new Error(message)
  }
}

// Not working with Sanctum
export async function userLogout(): Promise<any> {
    try {
        await fetch(`${process.env.CORE_API_ENTRYPOINT}/api/users/logoutWithToken`, {
          method: 'POST',
          credentials: 'include',
        });
    } catch (error) {
        const message = "Failed to userLogout: " + getErrorStringFromCatch(error)
        CommonLogger('info', message, 'full')
        throw new Error(message)
    }
}

// Not working with Sanctum
export async function getUsers(): Promise<any> {
    try {
        const cookieStore = await cookies()

        const cookieHeader = cookieStore
            .getAll()
            .map(c => `${c.name}=${c.value}`)
            .join('; ')

        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Cookie: cookieHeader,
        };

        const res = await fetch(`${process.env.CORE_API_ENTRYPOINT}/api/users`, {
            method: 'GET',
            credentials: 'include',
            headers: headers,
            cache: 'no-cache', // 'no-cache' if you want it fresh each time
        })

        if (!res.ok) {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const errorJson = await res.json();
                return { error: errorJson.message || 'Unknown API error' };
            } else {
                // HTML / text response → system-level issue (not for client)
                const rawText = await res.text();
                throw new Error(rawText.slice(0, sliceCharacters));
            }
        }

        const data = await res.json()

        return data;
    } catch (error) {
        const message = "Failed to getUsers: " + getErrorStringFromCatch(error)
        CommonLogger('info', message, 'full')
        throw new Error(message)
    }
}

export async function getUser(): Promise<any> {
    try {
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        const res = await fetch(`${process.env.CORE_API_ENTRYPOINT}/api/users/meWithToken`, {
            method: 'GET',
            credentials: 'include',
            headers: headers,
            cache: 'no-cache', // 'no-cache' if you want it fresh each time
        })

        if (!res.ok) {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const errorJson = await res.json();
                return { error: errorJson.message || 'Unknown API error' };
            } else {
                // HTML / text response → system-level issue (not for client)
                const rawText = await res.text();
                throw new Error(rawText.slice(0, sliceCharacters));
            }
        }

        const data = await res.json()

        return data;
    } catch (error) {
        const message = "Failed to getUser: " + getErrorStringFromCatch(error)
        CommonLogger('info', message, 'full')
        throw new Error(message)
    }
}
