import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Button from '../UI/Button';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  defaultImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, defaultImage }) => {
  const [image, setImage] = useState<string | undefined>(defaultImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
        onImageSelect(result);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(undefined);
    onImageSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full mb-6">
      <p className="text-sm font-medium text-gray-700 mb-2">Cover Image</p>
      
      {!image ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragging ? 'border-[#1A365D] bg-[#E6EEF4]' : 'border-gray-300 hover:border-[#1A365D] hover:bg-[#F0F7FF]'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG or WEBP (max 5MB)
          </p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={image} 
            alt="Cover" 
            className="w-full h-48 object-cover"
          />
          <button
            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-opacity"
            onClick={removeImage}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;