'use client';

import { useEffect, useState } from 'react';
import { dummyData } from '@/lib/dummy-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, Upload, Filter, Download, Eye } from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  category_id: string;
  subcategory_id: string;
  tags: string;
  sku: string;
  brand: string;
  base_price: string;
  actual_MRP: string;
  discounted_price: string;
  percentage_discount: string;
  tax_percentage: string;
  offer_label: string;
  images: string[];
  video_url: string;
  variants: string;
  specifications: string;
  is_active: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_hot_deal: boolean;
  has_offer: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  stock_quantity: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    subcategory_id: '',
    tags: '',
    sku: '',
    brand: '',
    base_price: '',
    actual_MRP: '',
    discounted_price: '',
    percentage_discount: '',
    tax_percentage: '',
    offer_label: '',
    images: [] as string[],
    video_url: '',
    variants: '',
    specifications: '',
    is_active: true,
    is_featured: false,
    is_new_arrival: false,
    is_hot_deal: false,
    has_offer: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    stock_quantity: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      if (selectedStatus === 'active') {
        filtered = filtered.filter(product => product.is_active);
      } else if (selectedStatus === 'inactive') {
        filtered = filtered.filter(product => !product.is_active);
      }
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      filtered = filtered.filter(product => product.base_price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter(product => product.base_price <= max);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedStatus, minPrice, maxPrice]);

  async function fetchData() {
    try {
      const [productsData, categoriesData] = await Promise.all([
        dummyData.getProducts(),
        dummyData.getCategories(),
      ]);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      subcategory_id: '',
      tags: '',
      sku: '',
      brand: '',
      base_price: '',
      actual_MRP: '',
      discounted_price: '',
      percentage_discount: '',
      tax_percentage: '',
      offer_label: '',
      images: [],
      video_url: '',
      variants: '',
      specifications: '',
      is_active: true,
      is_featured: false,
      is_new_arrival: false,
      is_hot_deal: false,
      has_offer: false,
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      stock_quantity: '',
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const productData = {
        name: formData.name,
        slug,
        description: formData.description,
        category_id: formData.category_id,
        base_price: parseFloat(formData.base_price),
        actual_MRP: formData.actual_MRP ? parseFloat(formData.actual_MRP) : undefined,
        discounted_price: formData.discounted_price ? parseFloat(formData.discounted_price) : undefined,
        percentage_discount: formData.percentage_discount ? parseFloat(formData.percentage_discount) : undefined,
        tax_percentage: formData.tax_percentage ? parseFloat(formData.tax_percentage) : undefined,
        offer_label: formData.offer_label || undefined,
        images: formData.images,
        video_url: formData.video_url || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        stock_quantity: parseInt(formData.stock_quantity),
        variants: formData.variants ? JSON.parse(formData.variants) : {},
        specifications: formData.specifications ? JSON.parse(formData.specifications) : {},
        is_featured: formData.is_featured,
        is_new_arrival: formData.is_new_arrival,
        is_hot_deal: formData.is_hot_deal,
        has_offer: formData.has_offer,
        rating: 0,
        review_count: 0,
        sku: formData.sku || undefined,
        brand: formData.brand || undefined,
        is_active: formData.is_active,
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
        meta_keywords: formData.meta_keywords || undefined,
      };

      if (editingProduct) {
        await dummyData.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await dummyData.createProduct(productData);
        toast.success('Product created successfully');
      }

      fetchData();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category_id: product.category_id || '',
      subcategory_id: product.subcategory_id || '',
      tags: product.tags.join(', '),
      sku: product.sku || '',
      brand: product.brand || '',
      base_price: product.base_price.toString(),
      actual_MRP: product.actual_MRP?.toString() || '',
      discounted_price: product.discounted_price?.toString() || '',
      percentage_discount: product.percentage_discount?.toString() || '',
      tax_percentage: product.tax_percentage?.toString() || '',
      offer_label: product.offer_label || '',
      images: product.images,
      video_url: product.video_url || '',
      variants: product.variants ? JSON.stringify(product.variants) : '',
      specifications: product.specifications ? JSON.stringify(product.specifications) : '',
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      is_new_arrival: product.is_new_arrival ?? false,
      is_hot_deal: product.is_hot_deal ?? false,
      has_offer: product.has_offer ?? false,
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      meta_keywords: product.meta_keywords || '',
      stock_quantity: product.stock_quantity.toString(),
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await dummyData.deleteProduct(productId);
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('No products selected');
      return;
    }
    try {
      await Promise.all(selectedProducts.map(id => dummyData.deleteProduct(id)));
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete selected products');
    }
  };

  const handleBulkActivate = async () => {
    if (selectedProducts.length === 0) {
      toast.error('No products selected');
      return;
    }
    try {
      await Promise.all(selectedProducts.map(id => {
        const product = products.find(p => p.id === id);
        if (product) {
          return dummyData.updateProduct(id, { ...product, is_active: true });
        }
      }));
      toast.success(`${selectedProducts.length} products activated successfully`);
      setSelectedProducts([]);
      fetchData();
    } catch (error) {
      toast.error('Failed to activate selected products');
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedProducts.length === 0) {
      toast.error('No products selected');
      return;
    }
    try {
      await Promise.all(selectedProducts.map(id => {
        const product = products.find(p => p.id === id);
        if (product) {
          return dummyData.updateProduct(id, { ...product, is_active: false });
        }
      }));
      toast.success(`${selectedProducts.length} products deactivated successfully`);
      setSelectedProducts([]);
      fetchData();
    } catch (error) {
      toast.error('Failed to deactivate selected products');
    }
  };

  const handleToggleStatus = async (productId: string, isActive: boolean) => {
    try {
      const product = products.find(p => p.id === productId);
      if (product) {
        await dummyData.updateProduct(productId, { ...product, is_active: isActive });
        toast.success(`Product ${isActive ? 'activated' : 'deactivated'} successfully`);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleView = (product: any) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Price', 'Stock', 'Status', 'Active'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => [
        `"${product.name}"`,
        `"${categories.find(cat => cat.id === product.category_id)?.name || 'N/A'}"`,
        product.base_price,
        product.stock_quantity,
        product.stock_quantity === 0 ? 'Out of Stock' : product.stock_quantity < 10 ? 'Low Stock' : 'In Stock',
        product.is_active ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'products.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock < 10) return <Badge variant="secondary">Low Stock</Badge>;
    return <Badge variant="default">In Stock</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="base_price">Regular Price (₹)</Label>
                      <Input
                        id="base_price"
                        type="number"
                        step="0.01"
                        value={formData.base_price}
                        onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discounted_price">Discount Price (₹)</Label>
                      <Input
                        id="discounted_price"
                        type="number"
                        step="0.01"
                        value={formData.discounted_price}
                        onChange={(e) => setFormData({ ...formData, discounted_price: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax_percentage">Tax Percentage (%)</Label>
                      <Input
                        id="tax_percentage"
                        type="number"
                        step="0.01"
                        value={formData.tax_percentage}
                        onChange={(e) => setFormData({ ...formData, tax_percentage: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offer_label">Offer Label</Label>
                      <Input
                        id="offer_label"
                        value={formData.offer_label}
                        onChange={(e) => setFormData({ ...formData, offer_label: e.target.value })}
                        placeholder="e.g., Hot Deal, Flash Sale"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="images">Images (URLs)</Label>
                    <Textarea
                      id="images"
                      value={formData.images.join('\n')}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').filter(url => url.trim()) })}
                      placeholder="Enter image URLs, one per line"
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">Upload multiple images with preview and reorder functionality would be implemented here</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video_url">Video URL</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="Optional video URL"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="variants">Variants (JSON)</Label>
                    <Textarea
                      id="variants"
                      value={formData.variants}
                      onChange={(e) => setFormData({ ...formData, variants: e.target.value })}
                      placeholder='{"color": ["red", "blue"], "size": ["S", "M", "L"]}'
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">Advanced variant management with custom attributes, prices, and stock would be implemented here</p>
                  </div>
                </TabsContent>

                <TabsContent value="other" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">Stock Quantity</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                      />
                      <Label htmlFor="is_featured">Featured Product</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_new_arrival"
                        checked={formData.is_new_arrival}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_new_arrival: checked })}
                      />
                      <Label htmlFor="is_new_arrival">New Arrival</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_hot_deal"
                        checked={formData.is_hot_deal}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_hot_deal: checked })}
                      />
                      <Label htmlFor="is_hot_deal">Hot Deal</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="has_offer"
                        checked={formData.has_offer}
                        onCheckedChange={(checked) => setFormData({ ...formData, has_offer: checked })}
                      />
                      <Label htmlFor="has_offer">Has Offer</Label>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-sm font-medium">SEO Settings (Optional)</h4>
                    <div className="space-y-2">
                      <Label htmlFor="meta_title">Meta Title</Label>
                      <Input
                        id="meta_title"
                        value={formData.meta_title}
                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meta_description">Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        value={formData.meta_description}
                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meta_keywords">Meta Keywords</Label>
                      <Input
                        id="meta_keywords"
                        value={formData.meta_keywords}
                        onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Update' : 'Create'} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            {viewingProduct && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{viewingProduct.name}</h3>
                      <p className="text-sm text-muted-foreground">{viewingProduct.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">SKU</Label>
                        <p className="text-sm">{viewingProduct.sku || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Brand</Label>
                        <p className="text-sm">{viewingProduct.brand || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <p className="text-sm">{categories.find(cat => cat.id === viewingProduct.category_id)?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Stock Quantity</Label>
                        <p className="text-sm">{viewingProduct.stock_quantity}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Regular Price</Label>
                        <p className="text-sm">₹{viewingProduct.base_price.toFixed(2)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Discount Price</Label>
                        <p className="text-sm">{viewingProduct.discounted_price ? `₹${viewingProduct.discounted_price.toFixed(2)}` : 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Tax Percentage</Label>
                        <p className="text-sm">{viewingProduct.tax_percentage ? `${viewingProduct.tax_percentage}%` : 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Offer Label</Label>
                        <p className="text-sm">{viewingProduct.offer_label || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {viewingProduct.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="flex gap-2">
                        <Badge variant={viewingProduct.is_active ? "default" : "secondary"}>
                          {viewingProduct.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {viewingProduct.is_featured && <Badge variant="default">Featured</Badge>}
                        {viewingProduct.is_new_arrival && <Badge variant="default">New Arrival</Badge>}
                        {viewingProduct.is_hot_deal && <Badge variant="destructive">Hot Deal</Badge>}
                        {viewingProduct.has_offer && <Badge variant="secondary">Has Offer</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Images</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {viewingProduct.images.map((image: string, index: number) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${viewingProduct.name} ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>

                    {viewingProduct.video_url && (
                      <div>
                        <Label className="text-sm font-medium">Video URL</Label>
                        <p className="text-sm text-blue-600 underline">
                          <a href={viewingProduct.video_url} target="_blank" rel="noopener noreferrer">
                            {viewingProduct.video_url}
                          </a>
                        </p>
                      </div>
                    )}

                    {viewingProduct.variants && Object.keys(viewingProduct.variants).length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Variants</Label>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(viewingProduct.variants, null, 2)}
                        </pre>
                      </div>
                    )}

                    {viewingProduct.specifications && Object.keys(viewingProduct.specifications).length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Specifications</Label>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(viewingProduct.specifications, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div className="space-y-2 border-t pt-4">
                      <Label className="text-sm font-medium">SEO Settings</Label>
                      <div>
                        <Label className="text-xs">Meta Title</Label>
                        <p className="text-sm">{viewingProduct.meta_title || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Meta Description</Label>
                        <p className="text-sm">{viewingProduct.meta_description || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Meta Keywords</Label>
                        <p className="text-sm">{viewingProduct.meta_keywords || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Price</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Price</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedProducts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkActivate}>
                  Activate
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
                  Deactivate
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedProducts(filteredProducts.map(p => p.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {categories.find(cat => cat.id === product.category_id)?.name || 'N/A'}
                  </TableCell>
                  <TableCell>₹{product.base_price.toFixed(2)}</TableCell>
                  <TableCell>
                    {product.discounted_price ? `₹${product.discounted_price.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.is_active}
                      onCheckedChange={(checked) => handleToggleStatus(product.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(product)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
