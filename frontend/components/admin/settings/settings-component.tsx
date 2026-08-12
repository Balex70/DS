'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Currency from "@/components/admin/settings/Currency";
import GeneralSettings from './GeneralSettings';

function SettingsComponent () {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="currency">Currency</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralSettings />
      </TabsContent>

      <TabsContent value="currency">
        <Currency />
      </TabsContent>
    </Tabs>
  )
}

export default SettingsComponent
