'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';
import { StatCard } from '@/components/dashboard/stat-card';
import { cn } from '@/lib/utils';

const COLUMNS = [
  { key: 'todo', label: 'To Do', color: 'bg-gray-400' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { key: 'review', label: 'Review', color: 'bg-amber-500' },
  { key: 'done', label: 'Done', color: 'bg-emerald-500' },
];

const priorityColors: Record<string, string> = {
  urgent: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  high: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
  medium: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  low: 'text-gray-500 bg-gray-50 dark:bg-gray-800',
};

// Mock tasks for demo
const mockTasks = {
  todo: [
    { id: '1', title: 'Design new onboarding flow', priority: 'high', dueDate: '2024-12-20', progress: 0 },
    { id: '2', title: 'Update employee handbook', priority: 'medium', dueDate: '2024-12-25', progress: 0 },
  ],
  in_progress: [
    { id: '3', title: 'Q4 financial report', priority: 'urgent', dueDate: '2024-12-15', progress: 65 },
    { id: '4', title: 'Sales pipeline cleanup', priority: 'high', dueDate: '2024-12-18', progress: 40 },
  ],
  review: [
    { id: '5', title: 'New hire contracts', priority: 'high', dueDate: '2024-12-14', progress: 90 },
  ],
  done: [
    { id: '6', title: 'November payroll', priority: 'urgent', dueDate: '2024-12-01', progress: 100 },
    { id: '7', title: 'Team performance reviews', priority: 'medium', dueDate: '2024-12-05', progress: 100 },
  ],
};

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Kanban task management</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600 text-white rounded-xl text-sm font-medium hover:from-nexus-600 hover:to-nexus-700 transition-all shadow-premium">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={Object.values(mockTasks).flat().length} icon={CheckSquare} color="blue" />
        <StatCard title="In Progress" value={mockTasks.in_progress.length} icon={Clock} color="orange" />
        <StatCard title="In Review" value={mockTasks.review.length} icon={AlertCircle} color="purple" />
        <StatCard title="Completed" value={mockTasks.done.length} icon={CheckCircle2} color="green" />
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {COLUMNS.map((col) => {
          const tasks = mockTasks[col.key as keyof typeof mockTasks] || [];
          return (
            <div key={col.key} className="flex-shrink-0 w-72">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn('w-2 h-2 rounded-full', col.color)} />
                <span className="text-sm font-semibold text-foreground">{col.label}</span>
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{tasks.length}</span>
              </div>
              <div className="space-y-2 min-h-[300px] bg-muted/30 rounded-xl p-2">
                {tasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-xl p-3 cursor-pointer hover:shadow-card-hover transition-all"
                  >
                    <p className="text-sm font-medium text-foreground mb-2">{task.title}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize', priorityColors[task.priority])}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
                    </div>
                    {task.progress > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-muted rounded-full">
                          <div
                            className="h-full bg-gradient-to-r from-nexus-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{task.progress}%</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
