import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('org_structure')
export class OrgStructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ancestor: number;

  @Column()
  descendant: number;

  @Column({ default: 0 })
  length: number;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ type: 'tinyint', default: 0 })
  isAvailable: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updateDate: Date;
}
