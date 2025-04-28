import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import TextEditor from '../components/Editor/TextEditor';
import ImageUploader from '../components/Editor/ImageUploader';
import Button from '../components/UI/Button';
import { Save, Send, ArrowLeft } from 'lucide-react';

const EditorPage: React.FC = () => {
  const { id } = useParams();
  const { addPost, updatePost, publishPost, getPost } = usePosts();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (id) {
      const post = getPost(id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setCoverImage(post.coverImage || '');
      } else {
        navigate('/editor');
      }
    }
  }, [id, getPost, navigate]);

  const validateTitle = () => {
    if (!title.trim()) {
      alert('Please add a title to your story');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateTitle()) {
      return;
    }

    setIsSaving(true);
    
    try {
      if (id) {
        updatePost(id, { title, content, coverImage });
      } else {
        const newId = addPost({
          title,
          content,
          coverImage,
          published: false
        });
        // Navigate to edit page with the new ID
        navigate(`/editor/${newId}`, { replace: true });
      }
      
      setSaveMessage('Saved successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save your story. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validateTitle()) {
      return;
    }

    if (!content.trim()) {
      alert('Please add content to your story');
      return;
    }

    setIsPublishing(true);
    
    try {
      if (id) {
        await updatePost(id, { title, content, coverImage });
        await publishPost(id);
        navigate(`/post/${id}`);
      } else {
        const newId = addPost({
          title,
          content,
          coverImage,
          published: true
        });
        navigate(`/post/${newId}`);
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish your story. Please try again.');
      setIsPublishing(false);
    }
  };

  // Auto-save every 30 seconds if there are changes and we have a title
  useEffect(() => {
    let autoSaveTimer: number;
    
    if (id && title.trim()) {
      autoSaveTimer = window.setInterval(() => {
        updatePost(id, { title, content, coverImage });
        setSaveMessage('Auto-saved');
        setTimeout(() => setSaveMessage(''), 2000);
      }, 30000);
    }
    
    return () => {
      if (autoSaveTimer) clearInterval(autoSaveTimer);
    };
  }, [id, title, content, coverImage, updatePost]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-[#1A365D] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-sm text-green-600 animate-fade-in-out">
              {saveMessage}
            </span>
          )}
          
          <Button
            variant="outline"
            size="md"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </Button>
          
          <Button
            variant="primary"
            size="md"
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-1"
          >
            <Send className="w-4 h-4" />
            <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold focus:outline-none border-b border-gray-200 pb-2 transition-colors focus:border-[#1A365D]"
        />
        
        <ImageUploader 
          onImageSelect={setCoverImage} 
          defaultImage={coverImage}
        />
        
        <TextEditor 
          content={content} 
          onChange={setContent} 
        />
      </div>
    </div>
  );
};

export default EditorPage;