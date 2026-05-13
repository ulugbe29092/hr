'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Sun, Moon, Settings, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-accent rounded-xl text-sm text-muted-foreground cursor-pointer transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search anything...</span>
          <kbd className="ml-auto text-xs bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Settings */}
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
          <Settings className="w-4 h-4" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-border cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-foreground leading-none">{user?.fullName}</p>
            <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{user?.role?.replace('_', ' ')}</p>
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
