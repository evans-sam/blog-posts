import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { BlogService } from './blog/blog.service';
import { BlogModule } from './blog/blog.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PostModule, BlogModule, HttpModule],
  controllers: [AppController],
  providers: [AppService, BlogService],
})
export class AppModule {}
