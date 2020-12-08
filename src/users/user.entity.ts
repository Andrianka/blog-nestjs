import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Comment } from '../comments/comment.entity';
import { Post } from '../posts/post.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @OneToMany(() => Post, (post) => post.author)
  public posts?: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  public comments?: Comment[];
}
