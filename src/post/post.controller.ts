import {
  ArgumentMetadata,
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  Injectable,
  PipeTransform,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from '../blog/types';

export type SortBy = keyof Pick<Post, 'id' | 'reads' | 'likes' | 'popularity'>;

export type SortDirection = 'desc' | 'asc';

@Injectable()
export class TagsValidationPipe implements PipeTransform<string, string[]> {
  transform(value: string, metadata: ArgumentMetadata): string[] {
    if (!value)
      throw new BadRequestException({ error: 'Tags parameter is required' });

    return value.split(',');
  }
}

@Injectable()
export class SortByValidationPipe implements PipeTransform<string, SortBy> {
  transform(value: string, metadata: ArgumentMetadata): SortBy {
    if (!['id', 'reads', 'likes', 'popularity'].includes(value))
      throw new BadRequestException({ error: 'sortBy parameter is invalid' });

    return value as SortBy;
  }
}

@Injectable()
export class SortDirectionValidationPipe
  implements PipeTransform<string, SortDirection>
{
  transform(value: string, metadata: ArgumentMetadata): SortDirection {
    if (!['desc', 'asc'].includes(value))
      throw new BadRequestException({
        error: 'direction parameter is invalid',
      });

    return value as SortDirection;
  }
}

@Controller('/api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getPosts(
    @Query('tags', TagsValidationPipe)
    tags: string[],
    @Query('sortBy', new DefaultValuePipe('id'), SortByValidationPipe)
    sortBy: string,
    @Query(
      'direction',
      new DefaultValuePipe('asc'),
      SortDirectionValidationPipe,
    )
    direction: string,
  ) {
    return await this.postService.getPosts({
      tags,
      sortBy: sortBy as SortBy,
      direction: direction as SortDirection,
    });
  }
}
