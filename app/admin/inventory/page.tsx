'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { sampleAssets } from '@/lib/data';
import type { Asset, AssetCategory, AssetStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Search,
  Plus,
  Package,
  Speaker,
  Lightbulb,
  Cable,
  Sparkles,
  AlertTriangle,
  Wrench,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const categoryIcons: Record<AssetCategory, React.ReactNode> = {
  speakers: <Speaker className="w-5 h-5" />,
  lights: <Lightbulb className="w-5 h-5" />,
  mixers: <Package className="w-5 h-5" />,
  cables: <Cable className="w-5 h-5" />,
  effects: <Sparkles className="w-5 h-5" />,
  other: <Package className="w-5 h-5" />,
};

const statusColors: Record<AssetStatus, string> = {
  available: 'bg-green-500/20 text-green-500',
  'in-use': 'bg-blue-500/20 text-blue-500',
  maintenance: 'bg-yellow-500/20 text-yellow-500',
  retired: 'bg-red-500/20 text-red-500',
};

const categories: AssetCategory[] = [
  'speakers',
  'lights',
  'mixers',
  'cables',
  'effects',
  'other',
];

export default function InventoryPage() {
  const [assets, setAssets] = useState<Asset[]>([]); // Start empty
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    category: 'speakers',
    status: 'available',
    quantity: 1,
    available: 1,
  });

  // Fetch Assets on Mount
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const { fetchAssetsAction } = await import('@/app/actions/inventory-actions');
      const result = await fetchAssetsAction();
      if (result.success && result.data) {
        setAssets(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.model?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStats = () => {
    const total = assets.reduce((sum, a) => sum + (a.quantity || 0), 0);
    const available = assets.reduce((sum, a) => sum + (a.available || 0), 0);
    const inUse = total - available;
    const needsService = assets.filter(
      (a) => a.nextServiceDate && new Date(a.nextServiceDate) <= new Date()
    ).length;
    return { total, available, inUse, needsService };
  };

  const stats = getStats();

  const handleAddAsset = async () => {
    if (newAsset.name && newAsset.category) {
      try {
        const { addAssetAction } = await import('@/app/actions/inventory-actions');
        const result = await addAssetAction(newAsset);

        if (result.success && result.data) {
          setAssets(prev => [...prev, result.data!]);
          setIsAddDialogOpen(false);
          setNewAsset({
            category: 'speakers',
            status: 'available',
            quantity: 1,
            available: 1,
          });
        } else {
          alert('Failed to add asset: ' + result.error);
        }
      } catch (e) {
        console.error(e);
        alert('Error adding asset');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.available}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Use</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.inUse}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needs Service</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.needsService}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="capitalize">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Equipment Name *</Label>
                  <Input
                    id="name"
                    value={newAsset.name || ''}
                    onChange={(e) =>
                      setNewAsset((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., JBL EON 615"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={newAsset.brand || ''}
                      onChange={(e) =>
                        setNewAsset((prev) => ({
                          ...prev,
                          brand: e.target.value,
                        }))
                      }
                      placeholder="e.g., JBL"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={newAsset.model || ''}
                      onChange={(e) =>
                        setNewAsset((prev) => ({
                          ...prev,
                          model: e.target.value,
                        }))
                      }
                      placeholder="e.g., EON 615"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={newAsset.category}
                    onValueChange={(value) =>
                      setNewAsset((prev) => ({
                        ...prev,
                        category: value as AssetCategory,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      value={newAsset.quantity || 1}
                      onChange={(e) =>
                        setNewAsset((prev) => ({
                          ...prev,
                          quantity: parseInt(e.target.value) || 1,
                          available: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      value={newAsset.purchasePrice || ''}
                      onChange={(e) =>
                        setNewAsset((prev) => ({
                          ...prev,
                          purchasePrice: parseInt(e.target.value) || undefined,
                        }))
                      }
                      placeholder="Optional"
                      className="mt-2"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddAsset}
                  className="w-full bg-primary text-primary-foreground"
                >
                  Add Equipment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
          <TabsTrigger
            value="all"
            onClick={() => setCategoryFilter('all')}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              onClick={() => setCategoryFilter(cat)}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize"
            >
              {categoryIcons[cat]}
              <span className="ml-2">{cat}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Equipment Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => {
          const needsService =
            asset.nextServiceDate && new Date(asset.nextServiceDate) <= new Date();
          return (
            <Card
              key={asset.id}
              className={cn(
                'bg-card border-border hover:border-primary/50 transition-colors',
                needsService && 'border-yellow-500/50'
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {categoryIcons[asset.category]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {asset.name}
                      </h3>
                      {asset.brand && (
                        <p className="text-sm text-muted-foreground">
                          {asset.brand} {asset.model}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className={statusColors[asset.status]}>
                    {asset.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Qty</span>
                    <span className="text-foreground">{asset.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <span
                      className={cn(
                        asset.available === 0
                          ? 'text-red-500'
                          : 'text-green-500'
                      )}
                    >
                      {asset.available}
                    </span>
                  </div>
                  {asset.purchasePrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Value</span>
                      <span className="text-foreground">
                        ₹{asset.purchasePrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {needsService && (
                  <div className="mt-4 p-2 bg-yellow-500/10 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-yellow-500">Service due</span>
                  </div>
                )}

                {asset.nextServiceDate && !needsService && (
                  <div className="mt-4 text-xs text-muted-foreground">
                    Next service:{' '}
                    {new Date(asset.nextServiceDate).toLocaleDateString('en-IN')}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No equipment found matching your criteria
        </div>
      )}
    </div>
  );
}
