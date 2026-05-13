import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Status } from '../../../common/enums/status.enum';

@Entity('products')
@Index(['tenantId', 'sku'], { unique: true })
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ unique: true })
  sku: string;

  @Column({ nullable: true })
  barcode?: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId?: string;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ name: 'cost_price', type: 'decimal', precision: 12, scale: 2, default: 0 })
  costPrice: number;

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ name: 'min_stock_level', type: 'int', default: 0 })
  minStockLevel: number;

  @Column({ name: 'max_stock_level', type: 'int', nullable: true })
  maxStockLevel?: number;

  @Column({ name: 'reorder_point', type: 'int', default: 0 })
  reorderPoint: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ name: 'warehouse_location', nullable: true })
  warehouseLocation?: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @Column({ type: 'jsonb', name: 'images', default: [] })
  images: string[];

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @Column({ name: 'supplier_id', nullable: true })
  supplierId?: string;

  @Column({ name: 'weight', type: 'decimal', precision: 8, scale: 3, nullable: true })
  weight?: number;

  @Column({ type: 'jsonb', name: 'attributes', default: {} })
  attributes: Record<string, any>;

  @Column({ name: 'is_trackable', default: true })
  isTrackable: boolean;
}

@Entity('stock_movements')
@Index(['tenantId', 'productId', 'createdAt'])
export class StockMovement extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'movement_type' })
  movementType: 'in' | 'out' | 'adjustment' | 'transfer';

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'previous_stock', type: 'int' })
  previousStock: number;

  @Column({ name: 'new_stock', type: 'int' })
  newStock: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 12, scale: 2, nullable: true })
  unitCost?: number;

  @Column({ name: 'reference_id', nullable: true })
  referenceId?: string;

  @Column({ name: 'reference_type', nullable: true })
  referenceType?: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ nullable: true })
  notes?: string;
}
