'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { Plus, TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';
import { api } from '@/services/api';
import { StatCard } from '@/components/dashboard/stat-card';
import { KanbanColumn } from '@/components/sales/kanban-column';
import toast from 'react-hot-toast';

const PIPELINE_STAGES = [
  { key: 'lead', label: 'Lead', color: 'bg-gray-500' },
  { key: 'contact', label: 'Contact', color: 'bg-blue-500' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-amber-500' },
  { key: 'won', label: 'Won', color: 'bg-emerald-500' },
  { key: 'lost', label: 'Lost', color: 'bg-red-500' },
];

export default function SalesPage() {
  const queryClient = useQueryClient();

  const { data: kanban, isLoading } = useQuery({
    queryKey: ['sales', 'kanban'],
    queryFn: () => api.get('/sales/kanban').then((r: any) => r),
  });

  const { data: stats } = useQuery({
    queryKey: ['sales', 'stats'],
    queryFn: () => api.get('/sales/stats').then((r: any) => r),
  });

  const moveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/sales/${id}/move`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
    onError: () => toast.error('Failed to move deal'),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    moveMutation.mutate({ id: active.id as string, status: over.id as string });
  };

  const totalDeals = stats?.byStatus?.reduce((sum: number, s: any) => sum + parseInt(s.count), 0) || 0;
  const totalValue = stats?.byStatus?.reduce((sum: number, s: any) => sum + parseFloat(s.totalAmount || '0'), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Drag & drop deals across stages</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600 text-white rounded-xl text-sm font-medium hover:from-nexus-600 hover:to-nexus-700 transition-all shadow-premium">
          <Plus className="w-4 h-4" />
          New Deal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Deals" value={totalDeals} icon={Target} color="blue" />
        <StatCard title="Pipeline Value" value={`$${(totalValue / 1000).toFixed(0)}K`} icon={DollarSign} color="green" />
        <StatCard title="Win Rate" value={`${stats?.winRate?.toFixed(0) || 0}%`} icon={TrendingUp} color="purple" />
        <StatCard title="Weighted Pipeline" value={`$${((stats?.weightedPipeline || 0) / 1000).toFixed(0)}K`} icon={BarChart3} color="orange" />
      </div>

      {/* Kanban Board */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {PIPELINE_STAGES.map((stage) => (
            <KanbanColumn
              key={stage.key}
              stage={stage}
              deals={kanban?.[stage.key] || []}
              loading={isLoading}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
