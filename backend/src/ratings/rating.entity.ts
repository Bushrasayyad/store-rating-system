import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';

@Entity('ratings')
@Unique(['userId', 'storeId'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Store, (store) => store.ratings)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column()
  storeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
