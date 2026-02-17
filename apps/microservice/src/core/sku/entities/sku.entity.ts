import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sku')
export class Sku {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @Column({ type: 'int', nullable: true })
  category: number;

  @Column({ type: 'tinyint', default: 0 })
  available_for_loyalty: number;

  @Column({ type: 'int' })
  point_value: number;

  @Column({ type: 'varchar', length: 15 })
  uom: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  alt_uom: string;

  @Column({ type: 'decimal', precision: 10, scale: 5, nullable: true })
  conversion_rate: number;

  @Column({ type: 'int', nullable: true })
  brand_id: number;

  @Column({ type: 'int' })
  company: number;

  @Column({ type: 'tinyint', default: 0 })
  is_available: number;

  @Column({ type: 'varchar', length: 32 })
  sap_id: string;

  @Column({ type: 'enum', enum: ['sku', 'artifacts', 'posm'], default: 'sku' })
  type: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  detail_description: string;

  @Column({ type: 'int', nullable: true })
  created_by: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({ type: 'int', nullable: true })
  updated_by: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_date: Date;

  @Column({ type: 'int', nullable: true })
  deleted_by: number;

  @Column({ type: 'datetime', nullable: true })
  deleted_date: Date;

  @Column({ type: 'enum', enum: ['serial', 'batch', 'disabled'], default: 'disabled', nullable: true })
  process_type: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  alt_uom1: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  alt_uom2: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  alt_uom3: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  alt_uom4: string;

  @Column({ type: 'decimal', precision: 10, scale: 5, nullable: true })
  conversion_rate1: number;

  @Column({ type: 'decimal', precision: 10, scale: 5, nullable: true })
  conversion_rate2: number;

  @Column({ type: 'decimal', precision: 10, scale: 5, nullable: true })
  conversion_rate3: number;

  @Column({ type: 'decimal', precision: 10, scale: 5, nullable: true })
  conversion_rate4: number;

  @Column({ type: 'varchar', length: 12000, nullable: true })
  custom_fields: string;

  @Column({ type: 'int', nullable: true })
  group_id: number;
}
