export interface BlogResponse {
  posts: Post[];
}

export interface Post {
  author: string;
  authorId: number;
  id: number;
  likes: number;
  popularity: number;
  reads: number;
  tags: string[];
}

export enum SortBy {
  id = 'id',
  reads = 'reads',
  likes = 'likes',
  popularity = 'popularity',
}

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export const HATCHWAYS_API = 'https://api.hatchways.io/assessment/blog/posts';
