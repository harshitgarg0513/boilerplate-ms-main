import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Route } from '../../route/entities/route.entity';
import { Company } from '../../company/entities/company.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Auto-incrementing primary key

  @Column({ length: 50 })
  empRoleID: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200 })
  avatar: string;

  @Column({ length: 100, nullable: true, unique: true })
  email: string;

  @Column({ type: 'tinyint', default: 0, nullable: true })
  verified_email_status: boolean;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255, nullable: true })
  password_hash: string;

  @Column({ type: 'datetime', nullable: true })
  password_reset_date: Date;

  @Column({ length: 255, nullable: true })
  password_salt: string;

  @Column({ length: 32, nullable: true })
  password_reset_token: string;

  @Column({ length: 13, nullable: true })
  mobile: string;

  @Column({ length: 3 })
  role: string;

  @Column({ nullable: true })
  designation: number;

  @Column({ nullable: true })
  reportsTo: number;

  @Column()
  company: number;

  @Column({ nullable: true })
  battery: number;

  @Column({ length: 32, nullable: true })
  os_version: string;

  @Column({ type: 'date', nullable: true })
  company_doj: Date;

  @Column({ type: 'date', nullable: true })
  company_dol: Date;

  @Column({ length: 16, nullable: true })
  tracker_token: string;

  @Column({ type: 'datetime', nullable: true })
  lastLogin: Date;

  @Column({ type: 'tinyint', default: 0 })
  is_available: boolean;

  @Column({ length: 45, nullable: true })
  play_service_version: string;

  @Column({ default: 0 })
  deactiveStatus: number;

  @Column({ nullable: true })
  distributor: number;

  @Column({ nullable: true })
  retailer: number;

  @Column({ nullable: true })
  linked_entity: number;

  @Column({ length: 255, nullable: true })
  device_id: string;

  @Column({ length: 512, nullable: true })
  device_model: string;

  @Column({ length: 200, nullable: true })
  gcm_token_id: string;

  @Column({ length: 512, nullable: true })
  fcm_token_id: string;

  @Column({ length: 50 })
  token: string;

  @Column({ type: 'datetime' })
  tokenDate: Date;

  @Column({ type: 'datetime' })
  CreatedDate: Date;

  @Column({ type: 'datetime' })
  DeletedDate: Date;

  @Column({ nullable: true })
  deleted_by: number;

  @Column({ nullable: true })
  allowance: number;

  @Column({ nullable: true })
  allowance_updated_at: number;

  @Column({ nullable: true })
  old_user_id: number;

  @Column({ type: 'tinyint', default: 0 })
  check_delete: boolean;

  @Column({ type: 'tinyint', default: 0 })
  available_for_delivery: boolean;

  @Column({ length: 512, nullable: true })
  freshchat_token: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  sync_time: Date;

  @Column({ type: 'tinyint', default: 0, nullable: true })
  terms_accepted: boolean;

  @Column({ type: 'tinyint', default: 0, nullable: true })
  verified_mobile_status: boolean;

  @Column({ length: 64, nullable: true })
  team_cluster: string;

  @Column({ type: 'tinyint', default: 0 })
  allow_delivery_on_dispatch: boolean;

  @Column({ type: 'tinyint', default: 1 })
  is_self_inventory: boolean;

  @OneToMany(type => Route, route => route.salesRep)
  routes: Route[];

  @ManyToOne(() => Company, company => company.users)
  @JoinColumn({ name: 'company' })
  companyObj: Promise<Company>;
}
