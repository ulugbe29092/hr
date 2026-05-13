'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Building2, Users, DollarSign, TrendingUp, Globe, Phone, Mail } from 'lucide-react';
import { api } from '@/services/api';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency, getInitials } from '@/lib/utils';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['clients', page, search],
    queryFn: () => api.get(`/clients?page=${page}&limit=20&search=${search}`).then((r: any) => r),
  });

  const { data: stats } = useQuery({
    queryKey: ['clients', 'stats'],
    queryFn: () => api.get('/clients/stats').then((r: any) => r),
  });

  const clients = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your customer relationships</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600 text-white rounded-xl text-sm font-medium hover:from-nexus-600 hover:to-nexus-700 transition-all shadow-premium">
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Clients" value={stats?.total ?? 0} icon={Building2} color="blue" />
        <StatCard title="Active" value={stats?.active ?? 0} icon={Users} color="green" />
        <StatCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue ?? 0)} icon={DollarSign} color="purple" />
        <StatCard title="New This Month" value="12" icon={TrendingUp} color="orange" change="+20%" trend="up" />
      </div>

      <div className="card-premium p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search clients..."
            className="w-full pl-9 pr-4 py-2 bg-muted rounded-xl text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)
        ) : (
          clients.map((client: any, i: number) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-premium p-5 hover:shadow-card-hover cursor-pointer group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {getInitials(client.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{client.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{client.industry || client.type}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${client.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                  {client.status}
                </span>
              </div>

              <div className="space-y-2">
                {client.email && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phoneNumber && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{client.phoneNumber}</span>
                  </div>
                )}
                {client.website && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">{client.website}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(client.totalRevenue || 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Deals</p>
                  <p className="text-sm font-semibold text-foreground">{client.totalDeals || 0}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
