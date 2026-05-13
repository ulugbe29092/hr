'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  employmentType: string;
  status: string;
  baseSalary: number;
  hireDate: string;
  kpiScore: number;
}

interface Props {
  employees: Employee[];
  loading: boolean;
  meta?: { total: number; page: number; totalPages: number };
  onPageChange: (page: number) => void;
}

const statusColors: Record<string, string> = {
  active: 'badge-active',
  inactive: 'badge-inactive',
  pending: 'badge-pending',
};

export function EmployeeTable({ employees, loading, meta, onPageChange }: Props) {
  if (loading) {
    return (
      <div className="card-premium overflow-hidden">
        <div className="p-4 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-40" />
                <div className="skeleton h-3 w-24" />
              </div>
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Employee', 'Job Title', 'Type', 'Status', 'Salary', 'KPI', 'Hire Date', ''].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees.map((emp, i) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {getInitials(`${emp.firstName} ${emp.lastName}`)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{emp.jobTitle}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 bg-muted rounded-lg capitalize">
                    {emp.employmentType?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[emp.status] || 'badge-inactive'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  ${Number(emp.baseSalary).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full max-w-[60px]">
                      <div
                        className="h-full bg-gradient-to-r from-nexus-500 to-purple-500 rounded-full"
                        style={{ width: `${emp.kpiScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{emp.kpiScore}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(emp.hireDate)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing {((meta.page - 1) * 20) + 1}–{Math.min(meta.page * 20, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  p === meta.page
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
