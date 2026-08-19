export type Settings = {
    "store.name": string;
    "store.fe_email": string;
    "store.fe_phone": string;
    // "checkout.guest_checkout": boolean;
    "product_sync.allow_cron_sync": boolean;
    "product_sync.allow_cron_enrichment": boolean;
    "product_sync.max_pages_allowed": number;
    "product_sync.time_since_last_update": number;
    // "shipping.free_shipping_threshold": number;
};
