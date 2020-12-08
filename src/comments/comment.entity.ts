import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';

@Entity('comment')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  //   @Column({ name: 'author_id' })
  //   @Exclude()
  //   public authorId: string;

  @ManyToOne(() => Post, (post) => post.comments)
  public post: Post;

  @ManyToOne(() => User, (author) => author.comments)
  public author: User;
}
