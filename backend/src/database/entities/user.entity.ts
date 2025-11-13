import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organizer } from './organizer.entity';
import { Order } from './order.entity';

export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  BUYER = 'buyer',
}

export enum OrganizerStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  dni?: string;

  @Column({ nullable: true })
  selfieUrl?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role!: UserRole;

  @Column({ type: 'enum', enum: OrganizerStatus, default: OrganizerStatus.PENDING })
  organizerStatus!: OrganizerStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Organizer, (organizer) => organizer.user)
  organizers!: Organizer[];

  @OneToMany(() => Order, (order) => order.buyer)
  orders!: Order[];
}
