'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Database } from 'lucide-react';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);

  async function handleSeed() {
    setLoading(true);
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        setSeeded(true);
        toast.success('Database seeded successfully!');
      } else {
        toast.error(data.error || 'Failed to seed database');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <Database className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-3xl font-bold mb-4">Setup Your E-commerce Store</h1>
          <p className="text-muted-foreground mb-8">
            Click the button below to populate your database with sample products, categories, and offers.
            This will help you get started with exploring all the features.
          </p>

          {seeded ? (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <p className="text-lg font-semibold text-green-600">Database seeded successfully!</p>
              <p className="text-muted-foreground">
                Your store is now ready to use. Start exploring by visiting the home page.
              </p>
              <Button size="lg" onClick={() => window.location.href = '/'}>
                Go to Home Page
              </Button>
            </div>
          ) : (
            <Button size="lg" onClick={handleSeed} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Seed Database
            </Button>
          )}

          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-left">
            <h3 className="font-semibold mb-2">What will be created:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 10 product categories</li>
              <li>• 15+ sample products with images</li>
              <li>• Multiple promotional offers and deals</li>
              <li>• Sample banners for the homepage</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-left">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Note:</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              To create an admin user, sign up for an account and then manually update the
              <code className="mx-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">is_admin</code>
              field to <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">true</code>
              in the profiles table using Supabase dashboard.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
