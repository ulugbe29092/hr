'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, DollarSign, Clock, Activity, BarChart3, Target, Briefcase,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { analyticsService } from '@/services/analytics.service';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { AiInsightCard } from '@/components/dashboard/ai-insight-card';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const pipelineData = [
  { name: 'Lead', value: 35 },
  { name: 'Contact', value: 25 },
  { name: 'Negotiation', value: 20 },
  { name: 'Won', value: 15 },
  { name: 'Lost', value: 5 },
];

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  income: Math.floor(Math.random() * 80000 + 40000),
  expense: Math.floor(Math.random() * 40000 + 20000),
}));

export default function DashboardPage() {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsService.getOverview,
    refetchInterval: 30000,
  });

  const { data: kpi } = useQuery({
    queryKey: ['analytics', 'kpi'],
    queryFn: analyticsService.getKpi,
    refetchInterval: 60000,
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome back — here&apos;s what&apos;s happening today
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
          <Activity className="w-3 h-3" />
          Live
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={overview?.totalEmployees ?? 0}
          icon={Users}
          color="blue"
          change="+12%"
          trend="up"
          loading={overviewLoading}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${((overview?.monthlyRevenue ?? 0) / 1000).toFixed(1)}K`}
          icon={DollarSign}
          color="green"
          change={`${(kpi?.revenueGrowth ?? 0) >= 0 ? '+' : ''}${(kpi?.revenueGrowth ?? 0).toFixed(1)}%`}
          trend={(kpi?.revenueGrowth ?? 0) >= 0 ? 'up' : 'down'}
          loading={overviewLoading}
        />
        <StatCard
          title="Active Deals"
          value={overview?.activeSalesDeals ?? 0}
          icon={Briefcase}
          color="purple"
          change="+5"
          trend="up"
          loading={overviewLoading}
        />
        <StatCard
          title="Attendance Today"
          value={overview?.attendanceToday ?? 0}
          icon={Clock}
          color="orange"
          change="94%"
          trend="up"
          loading={overviewLoading}
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div variants={item} className="xl:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Income vs Expenses</p>
            </div>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
              />
              <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" name="Expense" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Sales Pipeline</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Deal distribution</p>
            </div>
            <Target className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pipelineData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pipelineData.map((entry, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-medium">{entry.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div variants={item}><RecentActivity /></motion.div>
        <motion.div variants={item}><AiInsightCard /></motion.div>
      </div>
    </motion.div>
  );
}
