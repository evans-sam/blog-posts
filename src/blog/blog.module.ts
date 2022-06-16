import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlogService } from './blog.service';

@Module({
  imports: [HttpModule],
  providers: [BlogService],
})
export class BlogModule {}
