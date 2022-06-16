import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [BlogModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
