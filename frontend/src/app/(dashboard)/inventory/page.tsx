'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, DollarSign, TrendingDown, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/services/api';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency } from '@/lib/utils';

export default function InventoryPage() {
  const [search, setSearch] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['inventory', 'products', search],
    queryFn: () => api.get(`/inventory/products?search=${search}`).then((r: any) => r),
  });

  const { data: stats } = useQuery({
    queryKey: ['inventory', 'stats'],
    queryFn: () => api.get('/inventory/products/stats').then((r: any) => r),
  });

  const { data: lowStock } = useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: () => api.get('/inventory/products/low-stock').then((r: any) => r),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Warehouse & stock management</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600 text-white rounded-xl text-sm font-medium hover:from-nexus-600 hover:to-nexus-700 transition-all shadow-premium">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats?.total ?? 0} icon={Package} color="blue" />
        <StatCard title="Low Stock" value={stats?.lowStock ?? 0} icon={AlertTriangle} color="orange" />
        <StatCard title="Inventory Value" value={formatCurrency(stats?.totalValue ?? 0)} icon={DollarSign} color="green" />
        <StatCard title="Out of Stock" value="3" icon={TrendingDown} color="red" />
      </div>

      {/* Low Stock Alerts */}
      {lowStock?.length > 0 && (
        <div className="card-premium p-4 border-l-4 border-amber-500">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-foreground text-sm">Low Stock Alerts ({lowStock.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p: any) => (
              <span key={p.id} className="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 rounded-full">
                {p.name} — {p.stockQuantity} left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card-premium p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Product', 'SKU', 'Stock', 'Min Level', 'Unit Price', 'Value', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-16" /></td>
                    ))}
                  </tr>
                ))
              ) : (
                products?.data?.map((p: any, i: number) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        {p.warehouseLocation && <p className="text-xs text-muted-foreground">{p.warehouseLocation}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{p.sku}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${p.stockQuantity <= p.minStockLevel ? 'text-amber-500' : 'text-foreground'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.minStockLevel}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{formatCurrency(p.unitPrice)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{formatCurrency(p.stockQuantity * p.costPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        p.stockQuantity === 0 ? 'badge-error' :
                        p.stockQuantity <= p.minStockLevel ? 'badge-pending' : 'badge-active'
                      }`}>
                        {p.stockQuantity === 0 ? 'Out of Stock' : p.stockQuantity <= p.minStockLevel ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
