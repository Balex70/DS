import { getCookie } from "@/helpers/general";

const API_URL = process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT!;

async function getHeaders() {
    await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
    });

    return {
        'Content-Type': "application/json",
        'Accept': "application/json",
        'X-XSRF-TOKEN': getCookie("XSRF-TOKEN")!,
    };
}

export async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    const headers = await getHeaders();

    return fetch(`${API_URL}${path}`, {
        credentials: "include",
        cache: "no-cache",
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });
}
