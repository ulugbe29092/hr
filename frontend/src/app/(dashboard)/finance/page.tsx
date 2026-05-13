'use client';

import { useQuery } from '@tanstack/react-query';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Plus, Download } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { api } from '@/services/api';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency } from '@/lib/utils';

export default function FinancePage() {
  const { data: dashboard } = useQuery({
    queryKey: ['finance', 'dashboard'],
    queryFn: () => api.get('/finance/dashboard').then((r: any) => r),
  });

  const { data: trend } = useQuery({
    queryKey: ['finance', 'trend'],
    queryFn: () => api.get('/finance/trend?months=12').then((r: any) => r),
  });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['finance', 'transactions'],
    queryFn: () => api.get('/finance/transactions?limit=10').then((r: any) => r),
  });

  const trendData = trend?.reduce((acc: any[], item: any) => {
    const existing = acc.find((a) => a.month === item.month);
    if (existing) {
      existing[item.type] = parseFloat(item.total);
    } else {
      acc.push({ month: item.month, [item.type]: parseFloat(item.total) });
    }
    return acc;
  }, []) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Income, expenses & accounting</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:bg-accent transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600 text-white rounded-xl text-sm font-medium hover:from-nexus-600 hover:to-nexus-700 transition-all shadow-premium">
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Income" value={formatCurrency(dashboard?.totalIncome || 0)} icon={TrendingUp} color="green" change="+18%" trend="up" />
        <StatCard title="Total Expense" value={formatCurrency(dashboard?.totalExpense || 0)} icon={TrendingDown} color="red" change="+5%" trend="up" />
        <StatCard title="Net Profit" value={formatCurrency(dashboard?.netProfit || 0)} icon={DollarSign} color="blue" change="+12%" trend="up" />
        <StatCard title="This Month" value={formatCurrency(dashboard?.monthlyIncome || 0)} icon={PieChart} color="purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card-premium p-6">
          <h3 className="font-semibold text-foreground mb-4">Income vs Expense Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incG)" name="Income" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expG)" name="Expense" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="card-premium p-6">
          <h3 className="font-semibold text-foreground mb-4">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dashboard?.byCategory?.filter((c: any) => c.type === 'expense').slice(0, 6) || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
              <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card-premium overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
          <button className="text-xs text-primary hover:underline">View all</button>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-40" />
                  <div className="skeleton h-3 w-24" />
                </div>
                <div className="skeleton h-5 w-20" />
              </div>
            ))
          ) : (
            transactions?.data?.map((t: any) => (
              <div key={t.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {t.type === 'income'
                    ? <TrendingUp className="w-5 h-5 text-emerald-500" />
                    : <TrendingDown className="w-5 h-5 text-red-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{t.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{t.category} · {new Date(t.date).toLocaleDateString()}</p>
                </div>
                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
