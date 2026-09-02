export type Settings = {
    "store.name": string;
    "store.fe_email": string;
    "store.fe_phone": string;
    "product_sync.allow_cron_sync": boolean;
    "product_sync.allow_cron_enrichment": boolean;
    "product_sync.max_pages_allowed": number;
    "product_sync.time_since_last_update": number;
    "currency_sync.allow_cron_sync": boolean;
};
