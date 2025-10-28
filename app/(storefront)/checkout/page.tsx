'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { dummyData } from '@/lib/dummy-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchAddresses();
  }, [user, router]);

  async function fetchAddresses() {
    const data = await dummyData.getAddresses(user?.id || '');
    setAddresses(data);
    if (data && data.length > 0) {
      setSelectedAddress(data[0]);
    }
  }

  const shippingCost = deliveryMethod === 'express' ? 15 : deliveryMethod === 'overnight' ? 30 : 5;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  async function handlePlaceOrder() {
    if (!selectedAddress && !newAddress.full_name) {
      toast.error('Please provide a delivery address');
      return;
    }

    setLoading(true);

    try {
      const addressToUse = selectedAddress || newAddress;

      if (!selectedAddress && newAddress.full_name) {
        const savedAddress = await dummyData.createAddress({
          ...newAddress,
          user_id: user?.id || '',
          is_default: false,
        });
        setSelectedAddress(savedAddress);
      }

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(
        estimatedDelivery.getDate() + (deliveryMethod === 'overnight' ? 1 : deliveryMethod === 'express' ? 3 : 7)
      );

      const order = await dummyData.createOrder({
        user_id: user?.id || '',
        total,
        status: 'pending',
        items: items.map((item) => ({
          id: `item_${Date.now()}_${Math.random()}`,
          order_id: '',
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.base_price,
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            description: '',
            category_id: null,
            base_price: item.product.base_price,
            images: item.product.images,
            tags: [],
            rating: 0,
            review_count: 0,
            stock_quantity: item.product.stock_quantity,
            variants: null,
            specifications: null,
            is_featured: false,
            is_new_arrival: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        })),
      });

      await clearCart();

      toast.success('Order placed successfully!');
      router.push(`/profile/orders`);
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  }

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <h2 className="text-xl font-semibold">Delivery Address</h2>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                {addresses.length > 0 && (
                  <RadioGroup value={selectedAddress?.id} onValueChange={(id) => setSelectedAddress(addresses.find(a => a.id === id))}>
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start gap-3 p-4 border rounded">
                        <RadioGroupItem value={address.id} id={address.id} />
                        <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                          <p className="font-semibold">{address.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.address_line1}, {address.city}, {address.state} {address.postal_code}
                          </p>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Or Add New Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input value={newAddress.full_name} onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label>Street Address</Label>
                      <Input value={newAddress.street_address} onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })} />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                    </div>
                    <div>
                      <Label>Postal Code</Label>
                      <Input value={newAddress.postal_code} onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })} />
                    </div>
                  </div>
                </div>

                <Button onClick={() => setStep(2)} className="w-full">Continue to Delivery</Button>
              </div>
            )}
          </Card>

          {step >= 2 && (
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <h2 className="text-xl font-semibold">Delivery Method</h2>
              </div>

              {step === 2 && (
                <div className="space-y-4">
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          <p className="font-semibold">Standard (5-7 days)</p>
                          <p className="text-sm text-muted-foreground">₹5.00</p>
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <p className="font-semibold">Express (2-3 days)</p>
                          <p className="text-sm text-muted-foreground">₹15.00</p>
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="overnight" id="overnight" />
                        <Label htmlFor="overnight" className="cursor-pointer">
                          <p className="font-semibold">Overnight</p>
                          <p className="text-sm text-muted-foreground">₹30.00</p>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <Button onClick={() => setStep(3)} className="w-full">Continue to Payment</Button>
                </div>
              )}
            </Card>
          )}

          {step >= 3 && (
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>

              {step === 3 && (
                <div className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center gap-3 p-4 border rounded">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="cursor-pointer">Credit / Debit Card</Label>
                    </div>
                    <div className="flex items-center gap-3 p-4 border rounded">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
                    </div>
                    <div className="flex items-center gap-3 p-4 border rounded">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                  <Button onClick={handlePlaceOrder} disabled={loading} className="w-full" size="lg">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Place Order
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>₹{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
