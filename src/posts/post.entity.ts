import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  public title: string;

  @Column('text')
  public content: string;

  @OneToMany(() => Comment, (comment) => comment.author)
  public comments?: Comment[];

  @ManyToOne(() => User, (author) => author.posts)
  public author: User;
}
