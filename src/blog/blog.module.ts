import { CacheModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BlogService } from './blog.service';

@Module({
  imports: [HttpModule, CacheModule.register()],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
