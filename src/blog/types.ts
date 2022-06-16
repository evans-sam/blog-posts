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

export const HATCHWAYS_API = 'https://api.hatchways.io/assessment/blog/posts';
