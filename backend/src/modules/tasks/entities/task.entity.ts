import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TaskStatus, TaskPriority } from '../../../common/enums/status.enum';

@Entity('tasks')
@Index(['tenantId', 'assignedTo'])
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo?: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'due_date', type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ name: 'project_id', nullable: true })
  projectId?: string;

  @Column({ name: 'parent_task_id', nullable: true })
  parentTaskId?: string;

  @Column({ name: 'estimated_hours', type: 'decimal', precision: 6, scale: 2, nullable: true })
  estimatedHours?: number;

  @Column({ name: 'actual_hours', type: 'decimal', precision: 6, scale: 2, default: 0 })
  actualHours: number;

  @Column({ name: 'progress', type: 'int', default: 0 })
  progress: number; // 0-100

  @Column({ name: 'kanban_order', default: 0 })
  kanbanOrder: number;

  @Column({ type: 'jsonb', name: 'tags', default: [] })
  tags: string[];

  @Column({ type: 'jsonb', name: 'attachments', default: [] })
  attachments: string[];

  @Column({ type: 'jsonb', name: 'checklist', default: [] })
  checklist: ChecklistItem[];

  @Column({ type: 'jsonb', name: 'watchers', default: [] })
  watchers: string[];

  @Column({ name: 'related_entity_id', nullable: true })
  relatedEntityId?: string;

  @Column({ name: 'related_entity_type', nullable: true })
  relatedEntityType?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: Date;
}
