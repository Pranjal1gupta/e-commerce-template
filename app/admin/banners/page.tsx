'use client';

import { useEffect, useState } from 'react';
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
import { Plus, Search, Edit, Trash2, Upload, Eye, Calendar, Image as ImageIcon } from 'lucide-react';

interface BannerFormData {
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  start_date: string;
  end_date: string;
  priority: string;
  is_active: boolean;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [filteredBanners, setFilteredBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    description: '',
    image_url: '',
    cta_text: '',
    cta_link: '',
    start_date: '',
    end_date: '',
    priority: '1',
    is_active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    let filtered = banners;

    if (searchTerm) {
      filtered = filtered.filter(banner =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      if (selectedStatus === 'active') {
        filtered = filtered.filter(banner => banner.is_active);
      } else if (selectedStatus === 'inactive') {
        filtered = filtered.filter(banner => !banner.is_active);
      }
    }

    setFilteredBanners(filtered);
  }, [banners, searchTerm, selectedStatus]);

  async function fetchBanners() {
    try {
      // For now, using dummy data. In a real app, this would be an API call
      const dummyBanners = [
        {
          id: '1',
          title: 'Summer Sale',
          description: 'Up to 50% off on summer collection',
          image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
          cta_text: 'Shop Now',
          cta_link: '/category/summer',
          start_date: '2024-06-01',
          end_date: '2024-08-31',
          priority: 1,
          is_active: true,
          created_at: '2024-05-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'New Arrivals',
          description: 'Check out our latest fashion trends',
          image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop',
          cta_text: 'Explore',
          cta_link: '/new-arrivals',
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          priority: 2,
          is_active: true,
          created_at: '2024-01-01T10:00:00Z',
        },
      ];
      setBanners(dummyBanners);
      setFilteredBanners(dummyBanners);
    } catch (error) {
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      cta_text: '',
      cta_link: '',
      start_date: '',
      end_date: '',
      priority: '1',
      is_active: true,
    });
    setEditingBanner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bannerData = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        cta_text: formData.cta_text,
        cta_link: formData.cta_link,
        start_date: formData.start_date,
        end_date: formData.end_date,
        priority: parseInt(formData.priority),
        is_active: formData.is_active,
      };

      if (editingBanner) {
        // Update banner logic would go here
        toast.success('Banner updated successfully');
      } else {
        // Create banner logic would go here
        toast.success('Banner created successfully');
      }

      fetchBanners();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save banner');
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image_url: banner.image_url,
      cta_text: banner.cta_text,
      cta_link: banner.cta_link,
      start_date: banner.start_date,
      end_date: banner.end_date,
      priority: banner.priority.toString(),
      is_active: banner.is_active,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (bannerId: string) => {
    try {
      // Delete banner logic would go here
      toast.success('Banner deleted successfully');
      fetchBanners();
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBanners.length === 0) {
      toast.error('No banners selected');
      return;
    }
    try {
      // Bulk delete logic would go here
      toast.success(`${selectedBanners.length} banners deleted successfully`);
      setSelectedBanners([]);
      fetchBanners();
    } catch (error) {
      toast.error('Failed to delete selected banners');
    }
  };

  const handleBulkActivate = async () => {
    if (selectedBanners.length === 0) {
      toast.error('No banners selected');
      return;
    }
    try {
      // Bulk activate logic would go here
      toast.success(`${selectedBanners.length} banners activated successfully`);
      setSelectedBanners([]);
      fetchBanners();
    } catch (error) {
      toast.error('Failed to activate selected banners');
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedBanners.length === 0) {
      toast.error('No banners selected');
      return;
    }
    try {
      // Bulk deactivate logic would go here
      toast.success(`${selectedBanners.length} banners deactivated successfully`);
      setSelectedBanners([]);
      fetchBanners();
    } catch (error) {
      toast.error('Failed to deactivate selected banners');
    }
  };

  const handleToggleStatus = async (bannerId: string, isActive: boolean) => {
    try {
      // Toggle status logic would go here
      toast.success(`Banner ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchBanners();
    } catch (error) {
      toast.error('Failed to update banner status');
    }
  };

  const [viewingBanner, setViewingBanner] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleView = (banner: any) => {
    setViewingBanner(banner);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Inactive</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
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
        <h1 className="text-3xl font-bold">Banners & Homepage Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 800x400px for optimal display
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta_text">CTA Text</Label>
                    <Input
                      id="cta_text"
                      value={formData.cta_text}
                      onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                      placeholder="Shop Now"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta_link">CTA Link</Label>
                    <Input
                      id="cta_link"
                      value={formData.cta_link}
                      onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                      placeholder="/category/summer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">High (1)</SelectItem>
                        <SelectItem value="2">Medium (2)</SelectItem>
                        <SelectItem value="3">Low (3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBanner ? 'Update' : 'Create'} Banner
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Banner Preview</DialogTitle>
            </DialogHeader>
            {viewingBanner && (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={viewingBanner.image_url}
                    alt={viewingBanner.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="text-3xl font-bold mb-2">{viewingBanner.title}</h2>
                      <p className="text-lg mb-4">{viewingBanner.description}</p>
                      {viewingBanner.cta_text && (
                        <Button variant="secondary" size="lg">
                          {viewingBanner.cta_text}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Title</Label>
                      <p className="text-sm">{viewingBanner.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm">{viewingBanner.description}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">CTA Text</Label>
                      <p className="text-sm">{viewingBanner.cta_text || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">CTA Link</Label>
                      <p className="text-sm">{viewingBanner.cta_link || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Start Date</Label>
                      <p className="text-sm">{new Date(viewingBanner.start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">End Date</Label>
                      <p className="text-sm">{new Date(viewingBanner.end_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <p className="text-sm">{viewingBanner.priority}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      {getStatusBadge(viewingBanner.is_active)}
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
            placeholder="Search banners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedBanners.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedBanners.length} banner{selectedBanners.length > 1 ? 's' : ''} selected
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
          <CardTitle>Banners ({filteredBanners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedBanners.length === filteredBanners.length && filteredBanners.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBanners(filteredBanners.map(b => b.id));
                      } else {
                        setSelectedBanners([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>CTA</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBanners.includes(banner.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBanners([...selectedBanners, banner.id]);
                        } else {
                          setSelectedBanners(selectedBanners.filter(id => id !== banner.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-16 h-10 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{banner.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {banner.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {banner.cta_text && (
                      <Badge variant="outline">{banner.cta_text}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{banner.priority}</TableCell>
                  <TableCell>{new Date(banner.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(banner.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Switch
                      checked={banner.is_active}
                      onCheckedChange={(checked) => handleToggleStatus(banner.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(banner)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}>
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
                            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{banner.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(banner.id)}>
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
