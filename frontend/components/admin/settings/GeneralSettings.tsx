"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from "@/types/settings";

type Props = {
    settings: Settings
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

export default function GeneralSettings({
    settings,
    updateSetting,
}: Props) {

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
            <div className="space-y-2">
                <Label htmlFor="store-fe-address-en">Address (English)</Label>

                <Input
                    id="store-fe-address-en"
                    value={settings["store.fe_address.en"] ?? ""}
                    onChange={(e) =>
                        updateSetting("store.fe_address.en", e.target.value)
                    }
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="store-fe-address-uk">Address (Ukrainian)</Label>

                <Input
                    id="store-fe-address-uk"
                    value={settings["store.fe_address.uk"] ?? ""}
                    onChange={(e) =>
                        updateSetting("store.fe_address.uk", e.target.value)
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
        </div>
    );
}
