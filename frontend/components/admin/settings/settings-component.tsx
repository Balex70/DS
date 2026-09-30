'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralSettings from './GeneralSettings';
import { useEffect, useState } from 'react';
import { Settings } from "@/types/settings";
import { toast } from "sonner";
import { getSettings } from "@/lib/api/settings";
import { getCookie, getErrorStringFromCatch } from "@/helpers/general"
import { Button } from "@/components/ui/button";
import ProductsSettings from './ProductsSettings';

function SettingsComponent () {
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
    <Tabs defaultValue="general" className="w-full">
      <div className="flex justify-start mb-2">
          <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
          </Button>
      </div>
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralSettings settings={settings} updateSetting={updateSetting} />
      </TabsContent>

      <TabsContent value="products">
        <ProductsSettings settings={settings} updateSetting={updateSetting} />
      </TabsContent>
    </Tabs>
  )
}

export default SettingsComponent
