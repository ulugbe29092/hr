import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('departments')
@Tree('closure-table')
export class Department extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'head_id', nullable: true })
  headId?: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId?: string;

  @Column({ name: 'employee_count', default: 0 })
  employeeCount: number;

  @Column({ name: 'budget', type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget?: number;

  @Column({ name: 'color', nullable: true })
  color?: string;

  @Column({ name: 'icon', nullable: true })
  icon?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @TreeChildren()
  children: Department[];

  @TreeParent()
  parent: Department;
}
