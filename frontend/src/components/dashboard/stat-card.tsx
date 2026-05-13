'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  change?: string;
  trend?: 'up' | 'down';
  loading?: boolean;
}

const colorMap = {
  blue:   { bg: 'bg-blue-500/10',   icon: 'text-blue-500',   border: 'border-blue-500/20' },
  green:  { bg: 'bg-emerald-500/10', icon: 'text-emerald-500', border: 'border-emerald-500/20' },
  purple: { bg: 'bg-purple-500/10', icon: 'text-purple-500', border: 'border-purple-500/20' },
  orange: { bg: 'bg-orange-500/10', icon: 'text-orange-500', border: 'border-orange-500/20' },
  red:    { bg: 'bg-red-500/10',    icon: 'text-red-500',    border: 'border-red-500/20' },
};

export function StatCard({ title, value, icon: Icon, color, change, trend, loading }: StatCardProps) {
  const colors = colorMap[color];

  if (loading) {
    return (
      <div className="card-premium p-6">
        <div className="skeleton h-4 w-24 mb-4" />
        <div className="skeleton h-8 w-16 mb-2" />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card-premium p-6 group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.bg)}>
          <Icon className={cn('w-5 h-5', colors.icon)} />
        </div>
        {change && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            trend === 'up'
              ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20'
              : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
          )}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </motion.div>
  );
}
