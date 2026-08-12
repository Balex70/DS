"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSettings } from "@/lib/api/settings";
import { getCookie, getErrorStringFromCatch } from "@/helpers/general"

type Settings = {
    "store.name": string;
    // "checkout.guest_checkout": boolean;
    "product_sync.max_pages_allowed": number;
    // "shipping.free_shipping_threshold": number;
};

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

            {/* <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label>Guest checkout</Label>
                <p className="text-sm text-muted-foreground">
                Allow customers to checkout without creating an account.
                </p>
            </div>

            <Switch
                checked={settings["checkout.guest_checkout"]}
                onCheckedChange={(checked) =>
                updateSetting("checkout.guest_checkout", checked)
                }
            />
            </div> */}

            <div className="space-y-2">
            <Label htmlFor="cancel-after">
                Max pages allowed for product sync
            </Label>

            <Input
                id="cancel-after"
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

            {/* <div className="space-y-2">
            <Label htmlFor="free-shipping">
                Free shipping threshold
            </Label>

            <Input
                id="free-shipping"
                type="number"
                step="0.01"
                value={settings["shipping.free_shipping_threshold"]}
                onChange={(e) =>
                updateSetting(
                    "shipping.free_shipping_threshold",
                    Number(e.target.value)
                )
                }
            />
            </div> */}
        </div>

        <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
            </Button>
        </div>
        </div>
    );
}
