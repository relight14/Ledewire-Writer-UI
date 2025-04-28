import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import { useUser } from '../context/UserContext';
import UserHeader from '../components/Layout/UserHeader';
import Button from '../components/UI/Button';
import { Edit, ArrowLeft } from 'lucide-react';

const PostPage: React.FC = () => {
  const { id } = useParams();
  const { getPost } = usePosts();
  const { user } = useUser();
  const navigate = useNavigate();
  const [post, setPost] = useState(id ? getPost(id) : undefined);
  
  useEffect(() => {
    if (id) {
      const foundPost = getPost(id);
      if (foundPost) {
        setPost(foundPost);
        // Update page title
        document.title = `${foundPost.title} | PublishPro`;
      } else {
        navigate('/');
      }
    }
    
    return () => {
      // Reset title when unmounting
      document.title = 'PublishPro';
    };
  }, [id, getPost, navigate]);

  if (!post) {
    return <div>Loading...</div>;
  }

  // Format the date nicely
  const formattedDate = new Date(post.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader user={user} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-[#1A365D] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to stories</span>
          </button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/editor/${post.id}`)}
            className="flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        </div>
        
        {post.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-md">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        
        <h1 className="text-4xl font-bold mb-4 text-[#1A365D]">{post.title}</h1>
        
        <div className="text-gray-500 mb-8">
          Published on {formattedDate}
        </div>
        
        <article className="prose prose-lg max-w-none">
          <div 
            className="whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </div>
  );
};

export default PostPage;