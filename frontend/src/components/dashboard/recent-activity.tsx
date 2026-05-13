'use client';

import { motion } from 'framer-motion';
import { UserPlus, DollarSign, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const activities = [
  { icon: UserPlus, color: 'text-blue-500 bg-blue-500/10', title: 'New employee added', desc: 'Sarah Johnson joined Engineering', time: '2m ago' },
  { icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10', title: 'Deal closed', desc: 'Acme Corp — $45,000', time: '15m ago' },
  { icon: CheckCircle, color: 'text-purple-500 bg-purple-500/10', title: 'Payroll processed', desc: 'November 2024 — 142 employees', time: '1h ago' },
  { icon: AlertCircle, color: 'text-amber-500 bg-amber-500/10', title: 'Low stock alert', desc: 'Product SKU-0042 below minimum', time: '2h ago' },
  { icon: Clock, color: 'text-red-500 bg-red-500/10', title: 'Leave request', desc: 'John Doe — 3 days vacation', time: '3h ago' },
];

export function RecentActivity() {
  return (
    <div className="card-premium p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <button className="text-xs text-primary hover:underline">View all</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.desc}</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
