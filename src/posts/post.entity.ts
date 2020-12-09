import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  public title: string;

  @Column('text')
  public content: string;

  @ManyToOne(() => Post, (post) => post.comments)
  public parent: Post;

  @OneToMany(() => Post, (post) => post.parent)
  public comments?: Post[];

  @ManyToOne(() => User, (author) => author.posts)
  public author: User;
}
