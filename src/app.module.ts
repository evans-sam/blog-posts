import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { BlogService } from './blog/blog.service';

@Module({
  imports: [PostModule],
  controllers: [AppController],
  providers: [AppService, BlogService],
})
export class AppModule {}
