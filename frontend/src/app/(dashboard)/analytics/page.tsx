'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Activity, BarChart3 } from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency } from '@/lib/utils';

const kpiData = [
  { subject: 'Revenue', A: 85 },
  { subject: 'Employees', A: 92 },
  { subject: 'Sales', A: 78 },
  { subject: 'Attendance', A: 94 },
  { subject: 'Satisfaction', A: 88 },
  { subject: 'Growth', A: 76 },
];

const heatmapData = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day, hour, value: Math.floor(Math.random() * 100),
  })),
).flat();

export default function AnalyticsPage() {
  const { data: overview } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsService.getOverview,
    refetchInterval: 30000,
  });

  const { data: kpi } = useQuery({
    queryKey: ['analytics', 'kpi'],
    queryFn: analyticsService.getKpi,
  });

  const revenueData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    revenue: Math.floor(Math.random() * 100000 + 50000),
    target: 80000,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Business intelligence & KPI monitoring</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
          <Activity className="w-3 h-3" />
          Live Data
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={overview?.totalEmployees ?? 0} icon={Users} color="blue" />
        <StatCard title="Monthly Revenue" value={formatCurrency(overview?.monthlyRevenue ?? 0)} icon={DollarSign} color="green" change={`${kpi?.revenueGrowth > 0 ? '+' : ''}${kpi?.revenueGrowth?.toFixed(1) ?? 0}%`} trend={kpi?.revenueGrowth >= 0 ? 'up' : 'down'} />
        <StatCard title="Win Rate" value={`${kpi?.winRate?.toFixed(0) ?? 0}%`} icon={Target} color="purple" />
        <StatCard title="Active Deals" value={overview?.activeSalesDeals ?? 0} icon={TrendingUp} color="orange" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue vs Target */}
        <div className="xl:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Revenue vs Target</h3>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* KPI Radar */}
        <div className="card-premium p-6">
          <h3 className="font-semibold text-foreground mb-4">KPI Overview</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={kpiData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
              <Radar name="KPI" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Heatmap */}
      <div className="card-premium p-6">
        <h3 className="font-semibold text-foreground mb-4">Attendance Heatmap (Weekly)</h3>
        <div className="flex gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, d) => (
            <div key={day} className="flex-1">
              <p className="text-[10px] text-muted-foreground text-center mb-1">{day}</p>
              <div className="grid grid-rows-8 gap-0.5">
                {Array.from({ length: 8 }, (_, h) => {
                  const val = Math.floor(Math.random() * 100);
                  return (
                    <div
                      key={h}
                      className="h-4 rounded-sm transition-all hover:scale-110"
                      style={{
                        background: `rgba(99, 102, 241, ${val / 100})`,
                        opacity: val < 10 ? 0.1 : 1,
                      }}
                      title={`${val}% attendance`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-xs text-muted-foreground">Low</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
            <div key={o} className="w-4 h-4 rounded-sm" style={{ background: `rgba(99, 102, 241, ${o})` }} />
          ))}
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  );
}
