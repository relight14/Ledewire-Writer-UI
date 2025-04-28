import React, { useState, ChangeEvent } from 'react';
import { useUser } from '../context/UserContext';
import Button from '../components/UI/Button';
import UserHeader from '../components/Layout/UserHeader';
import LoginForm from '../components/Auth/LoginForm';
import { Check } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useUser();
  
  if (!user) {
    return <LoginForm />;
  }
  
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    headerColor: user.headerColor,
    headerFont: user.headerFont,
    avatar: user.avatar || ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateUser(formData);
      setSaveMessage('Profile updated successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const headerFonts = [
    { value: 'serif', label: 'Serif' },
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'cursive', label: 'Cursive' },
  ];

  const headerColors = [
    { value: '#1A365D', label: 'Navy Blue' },
    { value: '#2D3748', label: 'Dark Gray' },
    { value: '#38A169', label: 'Green' },
    { value: '#805AD5', label: 'Purple' },
    { value: '#DD6B20', label: 'Orange' },
    { value: '#E53E3E', label: 'Red' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader user={formData} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#1A365D]">Edit Profile</h1>
            
            {saveMessage && (
              <div className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-1" />
                <span>{saveMessage}</span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt={formData.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="headerColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Header Color
                </label>
                <select
                  id="headerColor"
                  name="headerColor"
                  value={formData.headerColor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                >
                  {headerColors.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="headerFont" className="block text-sm font-medium text-gray-700 mb-1">
                  Header Font
                </label>
                <select
                  id="headerFont"
                  name="headerFont"
                  value={formData.headerFont}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                >
                  {headerFonts.map(font => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSaving}
                className="w-full md:w-auto"
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;