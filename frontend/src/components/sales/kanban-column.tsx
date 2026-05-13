'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DollarSign, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Deal {
  id: string;
  title: string;
  amount: number;
  clientId: string;
  winProbability: number;
  expectedCloseDate?: string;
  priority: string;
}

interface Stage {
  key: string;
  label: string;
  color: string;
}

function DealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={cn(
        'bg-card border border-border rounded-xl p-3 cursor-grab active:cursor-grabbing shadow-card hover:shadow-card-hover transition-all',
        isDragging && 'opacity-50 rotate-2 shadow-premium',
      )}
    >
      <p className="text-sm font-medium text-foreground mb-2 line-clamp-2">{deal.title}</p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
        <DollarSign className="w-3 h-3" />
        <span className="font-medium text-foreground">${Number(deal.amount).toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-nexus-500" />
          <span className="text-[10px] text-muted-foreground">{deal.winProbability}% win</span>
        </div>
        <span className={cn(
          'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
          deal.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
          deal.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
          'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        )}>
          {deal.priority}
        </span>
      </div>
    </div>
  );
}

export function KanbanColumn({ stage, deals, loading }: { stage: Stage; deals: Deal[]; loading: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });
  const totalValue = deals.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="flex-shrink-0 w-72">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', stage.color)} />
          <span className="text-sm font-semibold text-foreground">{stage.label}</span>
          <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{deals.length}</span>
        </div>
        <span className="text-xs text-muted-foreground">${(totalValue / 1000).toFixed(0)}K</span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[400px] rounded-xl p-2 space-y-2 transition-colors',
          isOver ? 'bg-primary/5 border-2 border-dashed border-primary/30' : 'bg-muted/30',
        )}
      >
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))
        ) : (
          <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
            {deals.map((deal) => <DealCard key={deal.id} deal={deal} />)}
          </SortableContext>
        )}

        {!loading && deals.length === 0 && (
          <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}
