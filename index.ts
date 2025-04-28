export interface Post {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  headerColor: string;
  headerFont: string;
}