import { Test, TestingModule } from '@nestjs/testing';
import {
  PostController,
  SortByValidationPipe,
  SortDirectionValidationPipe,
  TagsValidationPipe,
} from './post.controller';
import { PostService } from './post.service';
import { BlogModule } from '../blog/blog.module';
import { BadRequestException } from '@nestjs/common';

describe('PostController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BlogModule],
      controllers: [PostController],
      providers: [PostService],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  describe('posts controller', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return posts', async () => {
      const posts = await controller.getPosts(['tech'], 'id', 'asc');
      expect(posts).toBeDefined();
    });

    it('should require tags', async () => {
      expect(() => new TagsValidationPipe().transform(undefined)).toThrow(
        BadRequestException,
      );
    });

    it('should require valid sortBy', async () => {
      expect(() => new SortByValidationPipe().transform('invalid')).toThrow(
        BadRequestException,
      );
    });

    it('should require valid direction', async () => {
      expect(() =>
        new SortDirectionValidationPipe().transform('invalid'),
      ).toThrow(BadRequestException);
    });
  });
});
