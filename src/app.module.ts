import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { BlogService } from './blog/blog.service';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [PostModule, BlogModule],
  controllers: [AppController],
  providers: [AppService, BlogService],
})
export class AppModule {}
