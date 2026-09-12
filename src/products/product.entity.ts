import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Review } from '../reviews/reviews.entity.js';
import { User } from '../users/user.entity.js';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  image: string;
  @Column()
  description: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Relation<Review>[];

  @ManyToOne(() => User, (user) => user.products)
  user: Relation<User>;
}
