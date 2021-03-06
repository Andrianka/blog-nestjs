import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';
import { PostsService } from './posts.service';
import { Post as UserPost } from './post.entity';
import { PostResponse, CommentResponse } from './interfaces/post.interface';
import CreatePostDto from './dto/create-post.dto';
import UpdatePostDto from './dto/update-post.dto';

import JwtAuthenticationGuard from '../auth/guards/jwtAuth.guard';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  public async getPosts(): Promise<PostResponse[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  public async getPost(@Param('id') id): Promise<UserPost> {
    return this.postsService.findOne(id);
  }

  @Get(':id/comments')
  public async getPostWithComments(@Param('id') id): Promise<CommentResponse> {
    return this.postsService.findOneWithComments(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  public async create(
    @Body() postData: CreatePostDto,
    @Req() req: RequestWithUser,
  ): Promise<PostResponse> {
    return this.postsService.create(postData, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  public async update(
    @Param('id') id,
    @Body() postData: UpdatePostDto,
    @Req() req: RequestWithUser,
  ): Promise<PostResponse> {
    return this.postsService.update(id, postData, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  public async delete(
    @Param('id') id,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    return this.postsService.delete(id, req.user);
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthenticationGuard)
  public async createComment(
    @Param('id') id,
    @Body() postData: CreatePostDto,
    @Req() req: RequestWithUser,
  ): Promise<CommentResponse> {
    return this.postsService.createComment(id, postData, req.user);
  }
}
