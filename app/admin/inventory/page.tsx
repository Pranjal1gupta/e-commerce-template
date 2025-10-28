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
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, Search, Edit, Download, AlertTriangle, Package, Upload, Settings, History, TrendingUp, BarChart3 } from 'lucide-react';

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isReorderAlertDialogOpen, setIsReorderAlertDialogOpen] = useState(false);
  const [bulkUpdates, setBulkUpdates] = useState<{ productId: string; newStock: number }[]>([]);
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>({});
  const [reorderThreshold, setReorderThreshold] = useState(10);
  const [inventoryStats, setInventoryStats] = useState<any>(null);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [isStockHistoryDialogOpen, setIsStockHistoryDialogOpen] = useState(false);
  const [isStockAdjustmentDialogOpen, setIsStockAdjustmentDialogOpen] = useState(false);
  const [selectedProductForAdjustment, setSelectedProductForAdjustment] = useState<any>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    if (selectedStockStatus !== 'all') {
      filtered = filtered.filter(product => {
        if (selectedStockStatus === 'in-stock') return product.stock_quantity > 10;
        if (selectedStockStatus === 'low-stock') return product.stock_quantity > 0 && product.stock_quantity <= 10;
        if (selectedStockStatus === 'out-of-stock') return product.stock_quantity === 0;
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedStockStatus]);

  async function fetchData() {
    try {
      const [productsData, categoriesData, lowStockData] = await Promise.all([
        dummyData.getProducts(),
        dummyData.getCategories(),
        dummyData.getLowStockProducts(10),
      ]);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
      setLowStockProducts(lowStockData);
    } catch (error) {
      toast.error('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  }

  const handleStockEdit = (productId: string, newStock: number) => {
    setEditingStock(prev => ({ ...prev, [productId]: newStock }));
  };

  const handleStockSave = async (productId: string) => {
    const newStock = editingStock[productId];
    if (newStock === undefined) return;

    try {
      await dummyData.updateStock(productId, newStock);
      toast.success('Stock updated successfully');
      setEditingStock(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const handleBulkUpdate = async () => {
    if (bulkUpdates.length === 0) return;

    try {
      await dummyData.bulkUpdateStock(bulkUpdates);
      toast.success(`Updated stock for ${bulkUpdates.length} products`);
      setBulkUpdates([]);
      setIsBulkDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const handleExportCSV = async () => {
    try {
      const csvData = await dummyData.exportInventory();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Inventory exported successfully');
    } catch (error) {
      toast.error('Failed to export inventory');
    }
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const updates: { productId: string; newStock: number }[] = [];

      for (const line of lines) {
        const [productId, stockStr] = line.split(',');
        if (productId && stockStr) {
          const newStock = parseInt(stockStr.trim());
          if (!isNaN(newStock)) {
            updates.push({ productId: productId.trim(), newStock });
          }
        }
      }

      if (updates.length > 0) {
        await dummyData.bulkUpdateStock(updates);
        toast.success(`Imported and updated stock for ${updates.length} products`);
        setIsImportDialogOpen(false);
        fetchData();
      } else {
        toast.error('No valid data found in CSV file');
      }
    } catch (error) {
      toast.error('Failed to import CSV');
    }
  };

  const handleReorderAlertSetup = async () => {
    try {
      await dummyData.setReorderThreshold(reorderThreshold);
      toast.success(`Reorder alert threshold set to ${reorderThreshold}`);
      setIsReorderAlertDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to set reorder alert threshold');
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock <= 10) return <Badge variant="secondary">Low Stock</Badge>;
    return <Badge variant="default">In Stock</Badge>;
  };

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock <= 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleStockAdjustment = async () => {
    if (!selectedProductForAdjustment || adjustmentQuantity === 0) return;

    try {
      await dummyData.adjustStock(selectedProductForAdjustment.id, adjustmentQuantity, adjustmentReason, 'admin');
      toast.success('Stock adjusted successfully');
      setIsStockAdjustmentDialogOpen(false);
      setSelectedProductForAdjustment(null);
      setAdjustmentQuantity(0);
      setAdjustmentReason('');
      fetchData();
    } catch (error) {
      toast.error('Failed to adjust stock');
    }
  };

  const handleViewStockHistory = async (productId: string) => {
    try {
      const history = await dummyData.getStockHistory(productId);
      setStockHistory(history);
      setIsStockHistoryDialogOpen(true);
    } catch (error) {
      toast.error('Failed to fetch stock history');
    }
  };

  const fetchInventoryStats = async () => {
    try {
      const stats = await dummyData.getInventoryStats();
      setInventoryStats(stats);
    } catch (error) {
      toast.error('Failed to fetch inventory stats');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
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
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Inventory CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="csv-file" className="block text-sm font-medium mb-2">
                    Select CSV file (format: product_id,stock_quantity)
                  </label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Bulk Update
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Stock Update</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter updates in format: product_id:new_stock (one per line)&#10;Example:&#10;prod_1:50&#10;prod_2:25"
                  value={bulkUpdates.map(u => `${u.productId}:${u.newStock}`).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(line => line.trim());
                    const updates = lines.map(line => {
                      const [productId, newStock] = line.split(':');
                      return { productId: productId?.trim(), newStock: parseInt(newStock?.trim()) };
                    }).filter(u => u.productId && !isNaN(u.newStock));
                    setBulkUpdates(updates);
                  }}
                  rows={10}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkUpdate} disabled={bulkUpdates.length === 0}>
                    Update Stock ({bulkUpdates.length} products)
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isReorderAlertDialogOpen} onOpenChange={setIsReorderAlertDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Reorder Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reorder Alert Setup</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Set reorder threshold (products below this level will trigger alerts)
                  </label>
                  <Input
                    type="number"
                    value={reorderThreshold}
                    onChange={(e) => setReorderThreshold(parseInt(e.target.value) || 10)}
                    min="1"
                    className="w-32"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsReorderAlertDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReorderAlertSetup}>
                    Set Threshold
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isStockHistoryDialogOpen} onOpenChange={setIsStockHistoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                Stock History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Stock History</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockHistory.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                        <TableCell className={entry.change > 0 ? 'text-green-600' : 'text-red-600'}>
                          {entry.change > 0 ? '+' : ''}{entry.change}
                        </TableCell>
                        <TableCell>{entry.reason}</TableCell>
                        <TableCell>{entry.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isStockAdjustmentDialogOpen} onOpenChange={setIsStockAdjustmentDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Adjust Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Stock Adjustment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedProductForAdjustment && (
                  <div>
                    <p className="font-medium">{selectedProductForAdjustment.name}</p>
                    <p className="text-sm text-gray-600">Current Stock: {selectedProductForAdjustment.stock_quantity}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Adjustment Quantity (use negative for reduction)
                  </label>
                  <Input
                    type="number"
                    value={adjustmentQuantity}
                    onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                    placeholder="e.g., 10 or -5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reason for Adjustment
                  </label>
                  <Textarea
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="e.g., Damaged goods, Restock, etc."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsStockAdjustmentDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleStockAdjustment} disabled={adjustmentQuantity === 0 || !adjustmentReason.trim()}>
                    Adjust Stock
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">0</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold">{products.filter(p => p.stock_quantity === 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">SKU: {product.id}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {product.stock_quantity} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
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
        <Select value={selectedStockStatus} onValueChange={setSelectedStockStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by stock status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product / SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Quantity</TableHead>
                <TableHead>Threshold Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">{product.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>
                    {categories.find(cat => cat.id === product.category_id)?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {editingStock[product.id] !== undefined ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editingStock[product.id]}
                            onChange={(e) => handleStockEdit(product.id, parseInt(e.target.value) || 0)}
                            className="w-20 h-8"
                            min="0"
                          />
                          <Button size="sm" onClick={() => handleStockSave(product.id)}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <span className={`font-medium ${getStockStatusColor(product.stock_quantity)}`}>
                          {product.stock_quantity}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.threshold || 10}</TableCell>
                  <TableCell>{getStockStatus(product.stock_quantity)}</TableCell>
                  <TableCell>{new Date(product.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProductForAdjustment(product);
                          setIsStockAdjustmentDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewStockHistory(product.id)}
                      >
                        <History className="h-4 w-4" />
                      </Button>
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
