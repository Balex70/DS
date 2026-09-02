"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSettings } from "@/lib/api/settings";
import { getCookie, getErrorStringFromCatch } from "@/helpers/general"
import { Settings } from "@/types/settings";
import { Switch } from "@/components/ui/switch";

export default function GeneralSettings() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await getSettings();

            const settingsRes = await res.json()

            setSettings(settingsRes ?? []);
        };

        fetchSettings();
    }, []);

    const updateSetting = <K extends keyof Settings>(
        key: K,
        value: Settings[K]
    ) => {
        setSettings((current) =>
        current
            ? {
                ...current,
                [key]: value,
            }
            : current
        );
    };

    const handleSave = async () => {
        if (!settings) return;

        setSaving(true);

        try {
            // get the csrf token
            await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/sanctum/csrf-cookie`, {
                credentials: 'include',
            });

            const csrfToken = getCookie('XSRF-TOKEN');

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': csrfToken!, // get the csrf token
            };

            // fetch settings
            const res = await fetch(`${process.env.NEXT_PUBLIC_CORE_API_ENTRYPOINT}/api/settings`, {
                method: 'PUT',
                credentials: 'include',
                headers: headers,
                cache: 'no-cache', // 'no-cache' if you want it fresh each time
                body: JSON.stringify(settings),
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
                        toast.error(errorJson.errors || 'Unknown API error');
                        return;
                    }
                } else {
                    // HTML / text response → system-level issue (not for client)
                    const rawText = await res.text();
                    setError(rawText.slice(0, 400))
                    return;
                }
            }

            toast.success("Saved settings successfully");
        } catch (err: unknown) {
            setError(getErrorStringFromCatch(err))  
        } finally {
            setSaving(false);
        }
    };

    if (!settings) {
        return <div>Loading...</div>;
    }
  
    if (error) {
        toast.error(error)
        setError(null)
    }

    return (
        <div className="max-w-2xl space-y-8">
        <div>
            <h2 className="text-lg font-semibold">General Settings</h2>
            <p className="text-sm text-muted-foreground">
                Configure general store settings.
            </p>
        </div>

        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="store-name">Store name</Label>

                <Input
                    id="store-name"
                    value={settings["store.name"]}
                    onChange={(e) =>
                        updateSetting("store.name", e.target.value)
                    }
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="store-fe-email">Store email (render on Frontend)</Label>

                <Input
                    id="store-fe-email"
                    value={settings["store.fe_email"]}
                    onChange={(e) =>
                        updateSetting("store.fe_email", e.target.value)
                    }
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="store-fe-phone">Store phone number (render on Frontend)</Label>

                <Input
                    id="store-fe-phone"
                    value={settings["store.fe_phone"]}
                    onChange={(e) =>
                        updateSetting("store.fe_phone", e.target.value)
                    }
                />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label>Allow products cron sync</Label>
                    <p className="text-sm text-muted-foreground">
                        Allow products sync using cron job via command SyncCategoriesProductsCommand (php artisan app:sync-products)
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
                    <Label>Allow sync currencies</Label>
                    <p className="text-sm text-muted-foreground">
                        Allow syncing currencies using cron job via command SyncCurrenciesCommand (php artisan app:sync-currencies)
                    </p>
                </div>

                <Switch
                    checked={settings["currency_sync.allow_cron_sync"]}
                    onCheckedChange={(checked) =>
                    updateSetting("currency_sync.allow_cron_sync", checked)
                    }
                />
            </div>
        </div>

        <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
            </Button>
        </div>
        </div>
    );
}
