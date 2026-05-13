'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Download, Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { api } from '@/services/api';
import { StatCard } from '@/components/dashboard/stat-card';
import { EmployeeTable } from '@/components/employees/employee-table';
import { EmployeeModal } from '@/components/employees/employee-modal';
import toast from 'react-hot-toast';

const fetchEmployees = (page: number, search: string) =>
  api.get(`/employees?page=${page}&limit=20&search=${search}`).then((r: any) => r);

const fetchStats = () => api.get('/employees/stats').then((r: any) => r);

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['employees', page, search],
    queryFn: () => fetchEmployees(page, search),
  });

  const { data: stats } = useQuery({
    queryKey: ['employees', 'stats'],
    queryFn: fetchStats,
  });

  const employees = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your workforce</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600
                     text-white rounded-xl text-sm font-medium hover:from-nexus-600 hover:to-nexus-700
                     transition-all shadow-premium"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats?.total ?? 0} icon={Users} color="blue" />
        <StatCard title="Active" value={stats?.active ?? 0} icon={UserCheck} color="green" />
        <StatCard title="Inactive" value={stats?.inactive ?? 0} icon={UserX} color="red" />
        <StatCard title="Avg KPI Score" value="87%" icon={TrendingUp} color="purple" />
      </div>

      {/* Search & Filter */}
      <div className="card-premium p-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search employees..."
            className="w-full pl-9 pr-4 py-2 bg-muted rounded-xl text-sm border border-border
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:bg-accent transition-all">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:bg-accent transition-all ml-auto">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Table */}
      <EmployeeTable employees={employees} loading={isLoading} meta={meta} onPageChange={setPage} />

      {/* Modal */}
      {showModal && <EmployeeModal onClose={() => setShowModal(false)} onSuccess={() => {
        setShowModal(false);
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        toast.success('Employee added successfully');
      }} />}
    </div>
  );
}
