import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Rating } from '../ratings/rating.entity';
import { Store } from '../stores/store.entity';

export enum UserRole {
  ADMIN = 'admin',
  STORE_OWNER = 'store_owner',
  NORMAL = 'normal',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 400 })
  address: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NORMAL,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Store, (store) => store.owner)
  stores: Store[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];
}