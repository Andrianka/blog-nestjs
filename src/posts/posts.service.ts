import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreatePostDto from './dto/create-post.dto';
import UpdatePostDto from './dto/update-post.dto';

import { DeleteResult, Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/users/user.entity';
import PostUnathorizedException from '../exceptions/postUnauthorized.exception';
import PostNotFoundException from '../exceptions/postNotFound.exception';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    try {
      return await this.postsRepository.findOne(id);
    } catch (error) {
      throw new PostNotFoundException(id);
    }
  }

  async create(createPostDto: CreatePostDto, currentUser: User): Promise<Post> {
    const newPost = this.postsRepository.create(createPostDto);
    newPost.author = currentUser;
    return newPost.save();
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    currentUser: User,
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (post && this.isOwner(post, currentUser)) {
      await this.postsRepository.update(id, updatePostDto);
      return this.postsRepository.findOne(id);
    }
    throw new PostUnathorizedException(id);
  }

  async delete(id: string, currentUser: User): Promise<DeleteResult> {
    const post = await this.findOne(id);
    if (!this.isOwner(post, currentUser))
      throw new PostUnathorizedException(id);
    return await this.postsRepository.delete(id);
  }

  private async isOwner(post: Post, currentUser: User): Promise<any> {
    return post.author === currentUser;
  }
}
