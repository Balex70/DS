import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT,
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    withXSRFToken: true,
});
