'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, Users, TrendingUp, CheckCircle, Plus, Download } from 'lucide-react';
import { api } from '@/services/api';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatCurrency } from '@/lib/utils';

export default function PayrollPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: stats } = useQuery({
    queryKey: ['payroll', 'stats', currentYear, currentMonth],
    queryFn: () => api.get(`/payroll/stats?year=${currentYear}&month=${currentMonth}`).then((r: any) => r),
  });

  const { data: payrolls, isLoading } = useQuery({
    queryKey: ['payroll', 'list'],
    queryFn: () => api.get('/payroll?limit=20').then((r: any) => r),
  });

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    pending: 'badge-pending',
    approved: 'badge-active',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'badge-error',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payroll</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Salary, bonuses & tax management</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:bg-accent transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600 text-white rounded-xl text-sm font-medium hover:from-nexus-600 hover:to-nexus-700 transition-all shadow-premium">
            <Plus className="w-4 h-4" />
            Generate Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Net Salary" value={formatCurrency(stats?.totalNetSalary ?? 0)} icon={DollarSign} color="green" />
        <StatCard title="Total Gross" value={formatCurrency(stats?.totalGrossSalary ?? 0)} icon={TrendingUp} color="blue" />
        <StatCard title="Total Tax" value={formatCurrency(stats?.totalTax ?? 0)} icon={DollarSign} color="red" />
        <StatCard title="Employees Paid" value={stats?.count ?? 0} icon={CheckCircle} color="purple" />
      </div>

      <div className="card-premium overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Payroll Records</h3>
          <span className="text-xs text-muted-foreground">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Employee', 'Period', 'Base Salary', 'Bonus', 'Deductions', 'Net Salary', 'Status', ''].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-16" /></td>
                    ))}
                  </tr>
                ))
              ) : (
                payrolls?.data?.map((p: any, i: number) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{p.employeeId}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.month}/{p.year}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{formatCurrency(p.baseSalary)}</td>
                    <td className="px-4 py-3 text-sm text-emerald-500">+{formatCurrency(p.bonus)}</td>
                    <td className="px-4 py-3 text-sm text-red-500">-{formatCurrency(p.deductions + p.taxAmount)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">{formatCurrency(p.netSalary)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[p.status] || ''}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.status === 'draft' && (
                        <button className="text-xs text-primary hover:underline">Approve</button>
                      )}
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
