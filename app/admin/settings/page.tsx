'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import SettingsForm from '@/components/admin/settings-form';
import UploadLogo from '@/components/admin/upload-logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('store-info');

  const tabs = [
    { value: 'store-info', label: 'Store Info' },
    { value: 'payment-settings', label: 'Payment Settings' },
    { value: 'shipping-options', label: 'Shipping Options' },
    { value: 'tax-settings', label: 'Tax Settings' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'admin-accounts', label: 'Admin Accounts' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure global e-commerce preferences.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="store-info" className="space-y-4">
          <UploadLogo />
          <SettingsForm section="store-info" />
        </TabsContent>

        <TabsContent value="payment-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Enable or disable payment options.</CardDescription>
            </CardHeader>
            <CardContent>
              <ToggleGroup type="multiple" className="justify-start">
                <ToggleGroupItem value="cod" aria-label="Toggle COD">
                  COD
                </ToggleGroupItem>
                <ToggleGroupItem value="online" aria-label="Toggle Online">
                  Online
                </ToggleGroupItem>
                <ToggleGroupItem value="wallet" aria-label="Toggle Wallet">
                  Wallet
                </ToggleGroupItem>
              </ToggleGroup>
            </CardContent>
          </Card>
          <SettingsForm section="payment-settings" />
        </TabsContent>

        <TabsContent value="shipping-options" className="space-y-4">
          <SettingsForm section="shipping-options" />
        </TabsContent>

        <TabsContent value="tax-settings" className="space-y-4">
          <SettingsForm section="tax-settings" />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage email and SMS alerts.</CardDescription>
            </CardHeader>
            <CardContent>
              <ToggleGroup type="multiple" className="justify-start">
                <ToggleGroupItem value="email" aria-label="Toggle Email">
                  Email Alerts
                </ToggleGroupItem>
                <ToggleGroupItem value="sms" aria-label="Toggle SMS">
                  SMS Alerts
                </ToggleGroupItem>
              </ToggleGroup>
            </CardContent>
          </Card>
          <SettingsForm section="notifications" />
        </TabsContent>

        <TabsContent value="admin-accounts" className="space-y-4">
          <SettingsForm section="admin-accounts" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
