import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  Injectable,
  PipeTransform,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiQuery } from '@nestjs/swagger';
import { SortBy, SortDirection } from '../blog/types';

@Injectable()
export class TagsValidationPipe implements PipeTransform<string, string[]> {
  transform(value: string): string[] {
    if (!value)
      throw new BadRequestException({ error: 'Tags parameter is required' });

    return value.split(',').map((tag) => tag.trim());
  }
}

@Injectable()
export class SortByValidationPipe implements PipeTransform<string, SortBy> {
  transform(value: string): SortBy {
    if (!(value in SortBy))
      throw new BadRequestException({ error: 'sortBy parameter is invalid' });

    return value as SortBy;
  }
}

@Injectable()
export class SortDirectionValidationPipe
  implements PipeTransform<string, SortDirection>
{
  transform(value: string): SortDirection {
    if (!(value in SortDirection))
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
  @ApiQuery({ name: 'tags', required: true })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: SortBy,
  })
  @ApiQuery({
    name: 'direction',
    required: false,
    enum: SortDirection,
  })
  async getPosts(
    @Query('tags', TagsValidationPipe)
    tags: string[],
    @Query('sortBy', new DefaultValuePipe(SortBy.id), SortByValidationPipe)
    sortBy?: SortBy,
    @Query(
      'direction',
      new DefaultValuePipe(SortDirection.asc),
      SortDirectionValidationPipe,
    )
    direction?: SortDirection,
  ) {
    return await this.postService.getPosts({
      tags,
      sortBy: sortBy as SortBy,
      direction: direction as SortDirection,
    });
  }
}
