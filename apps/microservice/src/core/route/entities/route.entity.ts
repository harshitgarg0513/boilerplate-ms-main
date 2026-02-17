import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../team/entities/user.entity';

@Entity('route')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column()
  distributor_id: number;

  @Column()
  sales_rep: number;

  @Column({ default: 0 })
  is_available: boolean;

  @Column({ type: 'datetime', nullable: true })
  updated_date: Date;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ type: 'datetime', nullable: true })
  deleted_date: Date;

  @Column({ nullable: true })
  deleted_by: number;

  @Column({ default: 0 })
  has_geo_sequencing: boolean;

  @ManyToOne(() => User, user => user.routes)
  @JoinColumn({ name: 'sales_rep' })
  salesRep: User;
}
