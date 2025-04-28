import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pen, BookOpen, User, Menu, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Write', path: '/editor', icon: <Pen className="w-5 h-5" /> },
    { label: 'Published', path: '/', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-[#1A365D] font-bold text-xl">
            PublishPro
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-[#1A365D]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'text-[#1A365D] font-medium bg-[#E6EEF4]'
                    : 'text-gray-600 hover:text-[#1A365D] hover:bg-[#F0F7FF]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile navigation */}
        <div 
          className={`md:hidden absolute left-0 right-0 bg-white shadow-md transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-60 py-2' : 'max-h-0'
          }`}
        >
          <div className="container mx-auto px-4 space-y-2 pb-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'text-[#1A365D] font-medium bg-[#E6EEF4]'
                    : 'text-gray-600 hover:text-[#1A365D] hover:bg-[#F0F7FF]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;