'use server'

import { getErrorStringFromCatch } from "@/helpers/general";
import { CommonLogger } from "@/lib/logger/commonLogger";
import { Product } from "@/types/product";

const sliceCharacters = 600
// const delay = (ms: number) =>
//     new Promise((resolve) => setTimeout(resolve, ms));

export async function getProduct(
    id: string | number,
    currency?: string
): Promise<Product> {
    try {
        // await delay(3000);
        const query = new URLSearchParams();

        if (currency) {
            query.append("currency", String(currency));
        }

        const url = `${process.env.CORE_API_ENTRYPOINT}/api/store/products/${id}/?${query.toString()}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: {
                revalidate: 60,
            },
        });

        if (!res.ok) {
            const contentType = res.headers.get("content-type") || "";

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

        const result = await res.json();

        return result.data;
    } catch (error) {
        const message = "Failed to get product: " + getErrorStringFromCatch(error);
        CommonLogger("info", message, "full");
        throw error instanceof Error ? error : new Error(message);
    }
}
