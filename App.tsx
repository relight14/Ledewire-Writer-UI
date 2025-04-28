import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { PostsProvider } from './context/PostsContext';
import NavBar from './components/Layout/NavBar';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <UserProvider>
      <PostsProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar />
            <div className="pt-16"> {/* Space for the fixed navbar */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="/editor/:id" element={<EditorPage />} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </PostsProvider>
    </UserProvider>
  );
}

export default App;