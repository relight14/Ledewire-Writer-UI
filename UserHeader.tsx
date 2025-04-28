import React from 'react';
import { User } from '../../types';

interface UserHeaderProps {
  user: User;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const headerStyle = {
    backgroundColor: user.headerColor || '#1A365D',
    fontFamily: user.headerFont || 'serif'
  };

  return (
    <header 
      className="w-full py-8 px-4 flex flex-col items-center justify-center text-white transition-all duration-300 ease-in-out"
      style={headerStyle}
    >
      <div className="container mx-auto max-w-3xl text-center">
        {user.avatar && (
          <div className="mb-4 inline-block">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 transition-transform duration-300 hover:scale-105">{user.name}</h1>
        {user.bio && (
          <p className="text-lg opacity-90 max-w-xl mx-auto">{user.bio}</p>
        )}
      </div>
    </header>
  );
};

export default UserHeader;