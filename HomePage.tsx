import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import { Plus } from 'lucide-react';
import PostCard from '../components/PostCard';
import Button from '../components/UI/Button';

const HomePage: React.FC = () => {
  const { posts, drafts } = usePosts();
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A365D] mb-2">Your Stories</h1>
          <p className="text-gray-600">Manage your published stories and drafts</p>
        </div>
        
        <Link to="/editor" className="md:self-end mt-4 md:mt-0">
          <Button 
            variant="primary"
            size="md"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Story</span>
          </Button>
        </Link>
      </div>
      
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            className={`py-3 px-1 font-medium border-b-2 transition-colors ${
              activeTab === 'published'
                ? 'border-[#1A365D] text-[#1A365D]'
                : 'border-transparent text-gray-500 hover:text-[#1A365D]'
            }`}
            onClick={() => setActiveTab('published')}
          >
            Published ({posts.length})
          </button>
          
          <button
            className={`py-3 px-1 font-medium border-b-2 transition-colors ${
              activeTab === 'drafts'
                ? 'border-[#1A365D] text-[#1A365D]'
                : 'border-transparent text-gray-500 hover:text-[#1A365D]'
            }`}
            onClick={() => setActiveTab('drafts')}
          >
            Drafts ({drafts.length})
          </button>
        </div>
      </div>
      
      {activeTab === 'published' && (
        <>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600 mb-4">You haven't published any stories yet</h3>
              <Link to="/editor">
                <Button variant="primary">Write your first story</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}
      
      {activeTab === 'drafts' && (
        <>
          {drafts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600 mb-4">You don't have any drafts</h3>
              <Link to="/editor">
                <Button variant="primary">Start writing</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.map(draft => (
                <PostCard key={draft.id} post={draft} isDraft={true} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;