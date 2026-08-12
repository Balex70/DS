'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralSettings from './GeneralSettings';
import ListCurrencies from './currency/ListCurrencies';

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
        <ListCurrencies />
      </TabsContent>
    </Tabs>
  )
}

export default SettingsComponent
