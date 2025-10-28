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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, Upload, Filter, Download, Eye, FolderTree } from 'lucide-react';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: string;
  display_order: string;
  is_active: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    parent_id: '',
    display_order: '',
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedParent !== 'all') {
      if (selectedParent === 'parent') {
        filtered = filtered.filter(category => !category.parent_id);
      } else if (selectedParent === 'subcategory') {
        filtered = filtered.filter(category => category.parent_id);
      } else {
        filtered = filtered.filter(category => category.parent_id === selectedParent);
      }
    }

    if (selectedStatus !== 'all') {
      if (selectedStatus === 'active') {
        filtered = filtered.filter(category => category.is_active);
      } else if (selectedStatus === 'inactive') {
        filtered = filtered.filter(category => !category.is_active);
      }
    }

    setFilteredCategories(filtered);
  }, [categories, searchTerm, selectedParent, selectedStatus]);

  async function fetchData() {
    try {
      const categoriesData = await dummyData.getCategories();
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      parent_id: '',
      display_order: '',
      is_active: true,
    });
    setEditingCategory(null);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image_url: formData.image_url,
        parent_id: formData.parent_id || null,
        display_order: parseInt(formData.display_order) || 0,
        is_active: formData.is_active,
      };

      if (editingCategory) {
        await dummyData.updateCategory(editingCategory.id, categoryData);
        toast.success('Category updated successfully');
      } else {
        await dummyData.createCategory(categoryData);
        toast.success('Category created successfully');
      }

      fetchData();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.image_url,
      parent_id: category.parent_id || '',
      display_order: category.display_order.toString(),
      is_active: category.is_active ?? true,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const success = await dummyData.deleteCategory(categoryId);
      if (success) {
        toast.success('Category deleted successfully');
        fetchData();
      } else {
        toast.error('Cannot delete category with dependencies');
      }
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) {
      toast.error('No categories selected');
      return;
    }
    try {
      let deletedCount = 0;
      for (const id of selectedCategories) {
        const success = await dummyData.deleteCategory(id);
        if (success) deletedCount++;
      }
      toast.success(`${deletedCount} categories deleted successfully`);
      setSelectedCategories([]);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete selected categories');
    }
  };

  const handleBulkActivate = async () => {
    if (selectedCategories.length === 0) {
      toast.error('No categories selected');
      return;
    }
    try {
      await Promise.all(selectedCategories.map(id => {
        const category = categories.find(c => c.id === id);
        if (category) {
          return dummyData.updateCategory(id, { ...category, is_active: true });
        }
      }));
      toast.success(`${selectedCategories.length} categories activated successfully`);
      setSelectedCategories([]);
      fetchData();
    } catch (error) {
      toast.error('Failed to activate selected categories');
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedCategories.length === 0) {
      toast.error('No categories selected');
      return;
    }
    try {
      await Promise.all(selectedCategories.map(id => {
        const category = categories.find(c => c.id === id);
        if (category) {
          return dummyData.updateCategory(id, { ...category, is_active: false });
        }
      }));
      toast.success(`${selectedCategories.length} categories deactivated successfully`);
      setSelectedCategories([]);
      fetchData();
    } catch (error) {
      toast.error('Failed to deactivate selected categories');
    }
  };

  const handleToggleStatus = async (categoryId: string, isActive: boolean) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        await dummyData.updateCategory(categoryId, { ...category, is_active: isActive });
        toast.success(`Category ${isActive ? 'activated' : 'deactivated'} successfully`);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update category status');
    }
  };

  const [viewingCategory, setViewingCategory] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleView = (category: any) => {
    setViewingCategory(category);
    setIsViewDialogOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Slug', 'Description', 'Parent Category', 'Display Order', 'Active', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredCategories.map(category => {
        const parentCategory = categories.find(c => c.id === category.parent_id);
        return [
          `"${category.name}"`,
          `"${category.slug}"`,
          `"${category.description}"`,
          `"${parentCategory?.name || 'N/A'}"`,
          category.display_order,
          category.is_active ? 'Yes' : 'No',
          category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'categories.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryType = (category: any) => {
    if (!category.parent_id) {
      return <Badge variant="default">Parent Category</Badge>;
    }
    return <Badge variant="secondary">Subcategory</Badge>;
  };

  const getParentCategoryName = (parentId: string) => {
    const parent = categories.find(c => c.id === parentId);
    return parent?.name || 'N/A';
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
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent_id">Parent Category</Label>
                    <Select value={formData.parent_id} onValueChange={(value) => setFormData({ ...formData, parent_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Parent (Main Category)</SelectItem>
                        {categories.filter(c => !c.parent_id).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
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

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Category Details</DialogTitle>
            </DialogHeader>
            {viewingCategory && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{viewingCategory.name}</h3>
                      <p className="text-sm text-muted-foreground">{viewingCategory.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Slug</Label>
                        <p className="text-sm">{viewingCategory.slug}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Display Order</Label>
                        <p className="text-sm">{viewingCategory.display_order}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Parent Category</Label>
                        <p className="text-sm">{getParentCategoryName(viewingCategory.parent_id)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <Badge variant={viewingCategory.is_active ? "default" : "secondary"}>
                          {viewingCategory.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <div className="mt-1">
                        {getCategoryType(viewingCategory)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {viewingCategory.image_url && (
                      <div>
                        <Label className="text-sm font-medium">Image</Label>
                        <img
                          src={viewingCategory.image_url}
                          alt={viewingCategory.name}
                          className="w-full h-32 object-cover rounded mt-2"
                        />
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-medium">Created At</Label>
                      <p className="text-sm">
                        {viewingCategory.created_at ? new Date(viewingCategory.created_at).toLocaleString() : 'N/A'}
                      </p>
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
            placeholder="Search categories..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Type</label>
                <Select value={selectedParent} onValueChange={setSelectedParent}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="parent">Parent Categories</SelectItem>
                    <SelectItem value="subcategory">Subcategories</SelectItem>
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
            </div>
          </CardContent>
        </Card>
      )}

      {selectedCategories.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'} selected
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
            <CardTitle>Categories ({filteredCategories.length})</CardTitle>
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
                    checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories(filteredCategories.map(c => c.id));
                      } else {
                        setSelectedCategories([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {category.image_url && (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCategoryType(category)}
                  </TableCell>
                  <TableCell>
                    {getParentCategoryName(category.parent_id)}
                  </TableCell>
                  <TableCell>{category.display_order}</TableCell>
                  <TableCell>
                    <Switch
                      checked={category.is_active}
                      onCheckedChange={(checked) => handleToggleStatus(category.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(category)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
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
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This action cannot be undone if the category has subcategories or products.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)}>
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
