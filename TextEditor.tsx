import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, List, Image, AlignLeft, AlignCenter, AlignRight, Link } from 'lucide-react';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  };

  const applyFormat = (format: string) => {
    setSelectedFormat(selectedFormat === format ? null : format);
    
    // Ensure the editor has focus before applying formatting
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    
    switch (format) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'list':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'alignLeft':
        document.execCommand('justifyLeft', false);
        break;
      case 'alignCenter':
        document.execCommand('justifyCenter', false);
        break;
      case 'alignRight':
        document.execCommand('justifyRight', false);
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          document.execCommand('insertImage', false, imageUrl);
        }
        break;
    }
    
    // Trigger content change after formatting
    handleContentChange();
  };

  const formatButtons = [
    { format: 'bold', icon: <Bold className="w-5 h-5" />, tooltip: 'Bold' },
    { format: 'italic', icon: <Italic className="w-5 h-5" />, tooltip: 'Italic' },
    { format: 'list', icon: <List className="w-5 h-5" />, tooltip: 'Bullet List' },
    { format: 'image', icon: <Image className="w-5 h-5" />, tooltip: 'Insert Image' },
    { format: 'alignLeft', icon: <AlignLeft className="w-5 h-5" />, tooltip: 'Align Left' },
    { format: 'alignCenter', icon: <AlignCenter className="w-5 h-5" />, tooltip: 'Align Center' },
    { format: 'alignRight', icon: <AlignRight className="w-5 h-5" />, tooltip: 'Align Right' },
    { format: 'link', icon: <Link className="w-5 h-5" />, tooltip: 'Insert Link' },
  ];

  const isFormatActive = (format: string) => {
    switch (format) {
      case 'bold':
        return document.queryCommandState('bold');
      case 'italic':
        return document.queryCommandState('italic');
      case 'list':
        return document.queryCommandState('insertUnorderedList');
      case 'alignLeft':
        return document.queryCommandState('justifyLeft');
      case 'alignCenter':
        return document.queryCommandState('justifyCenter');
      case 'alignRight':
        return document.queryCommandState('justifyRight');
      default:
        return false;
    }
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
        {formatButtons.map((button) => (
          <button
            key={button.format}
            type="button"
            onMouseDown={(e) => e.preventDefault()} // Prevent editor from losing focus
            className={`p-2 rounded hover:bg-gray-200 transition-colors relative ${
              isFormatActive(button.format) ? 'bg-gray-200 text-[#1A365D]' : 'text-gray-600'
            }`}
            onClick={() => applyFormat(button.format)}
            title={button.tooltip}
          >
            {button.icon}
          </button>
        ))}
      </div>
      
      <div
        ref={editorRef}
        className="w-full p-4 min-h-[300px] focus:outline-none font-serif text-lg leading-relaxed"
        contentEditable
        onInput={handleContentChange}
        onBlur={handleContentChange}
      />
    </div>
  );
};

export default TextEditor;