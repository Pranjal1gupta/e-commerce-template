'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsFormProps {
  section: string;
}

export default function SettingsForm({ section }: SettingsFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving settings for', section, formData);
    // TODO: Implement actual save logic
  };

  const renderStoreInfo = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="storeName">Store Name</Label>
        <Input
          id="storeName"
          value={formData.storeName || ''}
          onChange={(e) => handleInputChange('storeName', e.target.value)}
          placeholder="Enter store name"
        />
      </div>
      <div>
        <Label htmlFor="storeAddress">Store Address</Label>
        <Textarea
          id="storeAddress"
          value={formData.storeAddress || ''}
          onChange={(e) => handleInputChange('storeAddress', e.target.value)}
          placeholder="Enter store address"
        />
      </div>
      <div>
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={formData.contactEmail || ''}
          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
          placeholder="Enter contact email"
        />
      </div>
      <div>
        <Label htmlFor="contactPhone">Contact Phone</Label>
        <Input
          id="contactPhone"
          type="tel"
          value={formData.contactPhone || ''}
          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
          placeholder="Enter contact phone"
        />
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Payment method toggles (placeholder)</p>
      <div>
        <Label htmlFor="cod">Cash on Delivery</Label>
        <Select value={formData.cod || 'enabled'} onValueChange={(value) => handleInputChange('cod', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="online">Online Payment</Label>
        <Select value={formData.online || 'enabled'} onValueChange={(value) => handleInputChange('online', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="wallet">Wallet Payment</Label>
        <Select value={formData.wallet || 'enabled'} onValueChange={(value) => handleInputChange('wallet', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderShippingOptions = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="shippingType">Shipping Type</Label>
        <Select value={formData.shippingType || 'standard'} onValueChange={(value) => handleInputChange('shippingType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="express">Express</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="shippingRate">Shipping Rate ($)</Label>
        <Input
          id="shippingRate"
          type="number"
          value={formData.shippingRate || ''}
          onChange={(e) => handleInputChange('shippingRate', e.target.value)}
          placeholder="Enter shipping rate"
        />
      </div>
    </div>
  );

  const renderTaxSettings = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="taxType">Tax Type</Label>
        <Select value={formData.taxType || 'gst'} onValueChange={(value) => handleInputChange('taxType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gst">GST</SelectItem>
            <SelectItem value="vat">VAT</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="taxRate">Tax Rate (%)</Label>
        <Input
          id="taxRate"
          type="number"
          value={formData.taxRate || ''}
          onChange={(e) => handleInputChange('taxRate', e.target.value)}
          placeholder="Enter tax rate"
        />
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="emailAlerts">Email Alerts</Label>
        <Select value={formData.emailAlerts || 'enabled'} onValueChange={(value) => handleInputChange('emailAlerts', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="smsAlerts">SMS Alerts</Label>
        <Select value={formData.smsAlerts || 'enabled'} onValueChange={(value) => handleInputChange('smsAlerts', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderAdminAccounts = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Manage users & permissions (placeholder)</p>
      <div>
        <Label htmlFor="adminRole">Admin Role</Label>
        <Select value={formData.adminRole || 'super'} onValueChange={(value) => handleInputChange('adminRole', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="super">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderForm = () => {
    switch (section) {
      case 'store-info':
        return renderStoreInfo();
      case 'payment-settings':
        return renderPaymentSettings();
      case 'shipping-options':
        return renderShippingOptions();
      case 'tax-settings':
        return renderTaxSettings();
      case 'notifications':
        return renderNotifications();
      case 'admin-accounts':
        return renderAdminAccounts();
      default:
        return <p>Select a section to configure.</p>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.replace('-', ' ').toUpperCase()}</CardTitle>
        <CardDescription>Configure {section.replace('-', ' ')} settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
          <Button type="submit">Save Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
}
