import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlogService } from './blog.service';

export const HATCHWAYS_API = 'https://api.hatchways.io/assessment/blog/posts';

@Module({
  imports: [HttpModule],
  providers: [BlogService],
})
export class BlogModule {}
