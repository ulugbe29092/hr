'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCheck, Building2, DollarSign,
  Package, ShoppingCart, BarChart3, Brain, Bell, CheckSquare,
  FileText, Settings, ChevronLeft, ChevronRight, Zap,
  TrendingUp, Calendar, Search, LogOut, UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const navItems = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { href: '/clients', icon: Building2, label: 'Clients' },
      { href: '/sales', icon: TrendingUp, label: 'Sales Pipeline' },
    ],
  },
  {
    label: 'HR Management',
    items: [
      { href: '/employees', icon: Users, label: 'Employees' },
      { href: '/attendance', icon: UserCheck, label: 'Attendance' },
      { href: '/payroll', icon: DollarSign, label: 'Payroll' },
      { href: '/leave', icon: Calendar, label: 'Leave' },
      { href: '/recruitment', icon: UserPlus, label: 'Recruitment' },
    ],
  },
  {
    label: 'ERP',
    items: [
      { href: '/finance', icon: DollarSign, label: 'Finance' },
      { href: '/inventory', icon: Package, label: 'Inventory' },
      { href: '/procurement', icon: ShoppingCart, label: 'Procurement' },
    ],
  },
  {
    label: 'Productivity',
    items: [
      { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
      { href: '/reports', icon: FileText, label: 'Reports' },
      { href: '/notifications', icon: Bell, label: 'Notifications' },
    ],
  },
  {
    label: 'AI',
    items: [
      { href: '/ai', icon: Brain, label: 'AI Assistant' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-card border-r border-border overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nexus-500 to-purple-600 flex items-center justify-center shrink-0 shadow-premium">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-bold text-foreground text-sm leading-none">NEXUS</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Enterprise Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-border">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-xs text-muted-foreground cursor-pointer hover:bg-accent transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <kbd className="ml-auto text-[10px] bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        {navItems.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'sidebar-item',
                      isActive && 'active',
                      collapsed && 'justify-center px-2',
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={cn('w-4 h-4 shrink-0', isActive && 'text-primary')} />
                    {!collapsed && <span>{item.label}</span>}
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user?.fullName}</p>
              <p className="text-[10px] text-muted-foreground truncate capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-card border border-border
                   flex items-center justify-center text-muted-foreground hover:text-foreground
                   hover:bg-accent transition-all shadow-sm z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
