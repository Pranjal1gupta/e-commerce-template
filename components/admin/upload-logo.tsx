'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';

export default function UploadLogo() {
  const [logoUrl, setLogoUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    console.log('Uploading logo:', logoUrl);
    // TODO: Implement actual upload logic
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Logo</CardTitle>
        <CardDescription>Upload and manage your store logo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={logoUrl} alt="Store Logo" />
            <AvatarFallback>
              <Upload className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="logo-upload">Choose Logo</Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>
        </div>
        <Button onClick={handleUpload} disabled={!logoUrl}>
          Upload Logo
        </Button>
      </CardContent>
    </Card>
  );
}
