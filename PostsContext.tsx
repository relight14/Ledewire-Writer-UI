import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post } from '../types';
import { useUser } from './UserContext';

interface PostsContextType {
  posts: Post[];
  drafts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => string;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  publishPost: (id: string) => void;
  getPost: (id: string) => Post | undefined;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Maximum number of posts to store in localStorage
const MAX_STORED_POSTS = 10;

export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const savedPosts = localStorage.getItem('posts');
      return savedPosts ? JSON.parse(savedPosts) : [];
    } catch (error) {
      console.error('Error loading posts from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      // Sort posts by date and keep only the most recent ones
      const sortedPosts = [...posts].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      const recentPosts = sortedPosts.slice(0, MAX_STORED_POSTS);
      localStorage.setItem('posts', JSON.stringify(recentPosts));
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
    }
  }, [posts]);

  const drafts = posts.filter(post => !post.published);
  const publishedPosts = posts.filter(post => post.published);

  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const timestamp = new Date().toISOString();
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      userId: user.id
    };
    
    setPosts(prev => [...prev, newPost]);
    return newPost.id;
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === id 
          ? { ...post, ...updates, updatedAt: new Date().toISOString() } 
          : post
      )
    );
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  const publishPost = (id: string) => {
    updatePost(id, { published: true });
  };

  const getPost = (id: string) => {
    return posts.find(post => post.id === id);
  };

  return (
    <PostsContext.Provider value={{ 
      posts: publishedPosts, 
      drafts, 
      addPost, 
      updatePost, 
      deletePost, 
      publishPost,
      getPost
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};