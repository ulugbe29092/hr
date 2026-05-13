'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { UserCheck, Clock, AlertTriangle, LogOut, QrCode } from 'lucide-react';
import { api } from '@/services/api';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatDate } from '@/lib/utils';

export default function AttendancePage() {
  const { data: todayStats } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: () => api.get('/attendance/today').then((r: any) => r),
    refetchInterval: 60000,
  });

  const { data: records, isLoading } = useQuery({
    queryKey: ['attendance', 'records'],
    queryFn: () => api.get('/attendance?limit=20').then((r: any) => r),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground text-sm mt-0.5">QR · GPS · Face ID tracking</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600 text-white rounded-xl text-sm font-medium hover:from-nexus-600 hover:to-nexus-700 transition-all shadow-premium">
          <QrCode className="w-4 h-4" />
          Generate QR
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Checked In Today" value={todayStats?.checkedIn ?? 0} icon={UserCheck} color="green" />
        <StatCard title="Late Arrivals" value={todayStats?.late ?? 0} icon={AlertTriangle} color="orange" />
        <StatCard title="Checked Out" value={todayStats?.checkedOut ?? 0} icon={LogOut} color="blue" />
        <StatCard title="Absent" value="8" icon={Clock} color="red" />
      </div>

      <div className="card-premium overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Today's Attendance Log</h3>
          <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Employee', 'Check In', 'Check Out', 'Hours', 'Method', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : (
                records?.data?.map((r: any, i: number) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{r.employeeId}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{r.workHours ? `${r.workHours}h` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-muted rounded-lg capitalize">{r.method}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${r.isLate ? 'badge-pending' : 'badge-active'}`}>
                        {r.isLate ? `Late ${r.lateMinutes}m` : 'On Time'}
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
