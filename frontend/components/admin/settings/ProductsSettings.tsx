"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from "@/types/settings";

type Props = {
    settings: Settings
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

export default function ProductsSettings({
    settings,
    updateSetting,
}: Props) {

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-lg font-semibold">Products Settings</h2>
                <p className="text-sm text-muted-foreground">
                    Configure settings for products.
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col rounded-lg border p-4 gap-3">
                    <Label>Allow products cron sync</Label>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label>Allow products cron sync</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow products sync (update products for each active category) using cron job via command SyncCategoriesProductsCommand (php artisan app:sync-products)
                            </p>
                        </div>

                        <Switch
                            checked={settings["product_sync.allow_cron_sync"]}
                            onCheckedChange={(checked) =>
                            updateSetting("product_sync.allow_cron_sync", checked)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="product-sync-max-pages">
                            Max pages allowed for product sync
                        </Label>

                        <Input
                            id="product-sync-max-pages"
                            type="number"
                            value={settings["product_sync.max_pages_allowed"]}
                            onChange={(e) =>
                            updateSetting(
                                "product_sync.max_pages_allowed",
                                Number(e.target.value)
                            )
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product-sync-time-since-last-update">
                        Max amount of time (hours) spent from last update of products for category
                        </Label>

                        <Input
                            id="product-sync-time-since-last-update"
                            type="number"
                            value={settings["product_sync.time_since_last_update"]}
                            onChange={(e) =>
                            updateSetting(
                                "product_sync.time_since_last_update",
                                Number(e.target.value)
                            )
                            }
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label>Allow products enrichment</Label>
                        <p className="text-sm text-muted-foreground">
                            Allow products enrichment using cron job via command EnrichProductCommand (php artisan app:enrich-product)
                        </p>
                    </div>

                    <Switch
                        checked={settings["product_sync.allow_cron_enrichment"]}
                        onCheckedChange={(checked) =>
                        updateSetting("product_sync.allow_cron_enrichment", checked)
                        }
                    />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label>Allow retry failed products enrichment</Label>
                        <p className="text-sm text-muted-foreground">
                            Allow retrying failed product enrichment using the cron job via command
                            RetryOrDeleteFailedProductEnrichmentCommand
                            (php artisan app:retry-enrich-failed-product).
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-500">
                            Warning: this will delete product if it has no orders and failed to enrich again.
                        </p>
                    </div>

                    <Switch
                        checked={settings["product_sync.allow_cron_retry_enrichment"]}
                        onCheckedChange={(checked) =>
                            updateSetting("product_sync.allow_cron_retry_enrichment", checked)
                        }
                    />
                </div>
            </div>
        </div>
    );
}
