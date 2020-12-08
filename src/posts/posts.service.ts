import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreatePostDto from './dto/create-post.dto';
import UpdatePostDto from './dto/update-post.dto';

import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/users/user.entity';
import UpdateUserDto from 'src/users/dto/update-user.dto';
import UnauthorizedException from '../exceptions/productUnauthorized.exception';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: string): Promise<Post> {
    return this.postsRepository.findOne(id);
  }

  async create(userData: CreatePostDto, currentUser: User): Promise<Post> {
    const newPost = this.postsRepository.create(userData);
    newPost.author = currentUser;
    return newPost.save();
  }

  async update(id: string, postDto: UpdatePostDto): Promise<UpdateResult> {
    const post = this.findOne(id);
    if (post) {
      return await this.postsRepository.update(id, postDto);
    }
  }

  async delete(id: string, currentUser: User): Promise<DeleteResult> {
    const post = await this.findOne(id);
    if (!this.isOwner(post, currentUser)) throw new UnauthorizedException(id);
    return await this.postsRepository.delete(id);
  }

  private async isOwner(post: Post, currentUser: User): Promise<any> {
    return post.author === currentUser;
  }
}
