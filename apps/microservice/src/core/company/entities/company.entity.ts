import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../../team/entities/user.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  street: string;

  @Column({ type: 'varchar', length: 50 })
  city: string;

  @Column({ type: 'varchar', length: 50 })
  country: string;

  @Column({ type: 'varchar', length: 6 })
  pincode: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  landline: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  mobile: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  fax: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  contact_person: string;

  @Column({ type: 'varchar', length: 10 })
  pan: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customer_executive_email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customer_executive_phone: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  customer_executive_name: string;

  @Column({ type: 'int', default: 50 })
  max_users_license: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remarks: string;

  @Column({ type: 'tinyint', default: 0 })
  is_available: number;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @Column({ type: 'int', nullable: true })
  remaining_license_user: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  num_scorecard_kpi: number;

  @Column({ type: 'int', nullable: true })
  remaining_scorecard_kpi: number;

  @Column({ type: 'int', default: 0 })
  num_schedule_alert: number;

  @Column({ type: 'int', default: 0 })
  remaining_schedule_alert: number;

  @Column({ type: 'varchar', length: 63, unique: true, nullable: true })
  s3_bucket_name: string;

  @Column({ type: 'int' })
  industry: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  segment: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  historical_data_age: string;

  @Column({ type: 'tinyint', default: 3, nullable: true })
  signup_step: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  created_date: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  updated_date: Date;

  @Column({ type: 'int' })
  subscription: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  channel_partner: string;

  @Column({ type: 'int', default: 10000, nullable: true })
  rate_limit: number;

  @Column({ type: 'varchar', length: 32, nullable: true })
  timezone: string;

  @Column({ type: 'tinyint', default: 0 })
  has_splash_screen: number;

  @Column({ type: 'varchar', length: 7, nullable: true })
  splash_bg: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  display_name_team_app: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  display_name_customer_app: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_customer_app: string;

  @Column({ type: 'text', nullable: true })
  customer_app_welcome_message: string;

  @OneToMany(type => User, user => user.companyObj)
  users: User[];
}
