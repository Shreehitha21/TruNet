import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const checkAuth = () => {
      const savedUser = localStorage.getItem('trunet-user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('User loaded from storage:', parsedUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('trunet-user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    console.log('🔐 Processing login...');
    
    // Validate credentials
    if (!email || !password) {
      throw new Error('Please provide both email and password');
    }

    // Create user profile
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: email.split('@')[0] || 'user',
      email,
      avatar: '',
      reputation: 100,
      verified: false,
      joinDate: new Date().toISOString().split('T')[0],
      totalPosts: 0,
      totalVerified: 0
    };
    
    // Save user session
    localStorage.setItem('trunet-user', JSON.stringify(mockUser));
    setUser(mockUser);
    console.log('✅ Login successful');
    
    return mockUser;
  };

  const signup = async (username: string, email: string, password: string): Promise<User> => {
    console.log('📝 Creating account...');
    
    // Validate inputs
    if (!username || !email || !password) {
      throw new Error('Please fill in all required fields');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create new user account
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      avatar: '',
      reputation: 100,
      verified: false,
      joinDate: new Date().toISOString().split('T')[0],
      totalPosts: 0,
      totalVerified: 0
    };
    
    // Save user session
    localStorage.setItem('trunet-user', JSON.stringify(mockUser));
    setUser(mockUser);
    console.log('✅ Account created successfully');
    
    return mockUser;
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    localStorage.removeItem('trunet-user');
    window.location.reload();
  };

  // Update user statistics when actions are performed
  const updateUserStats = (newPosts: number, newVerified: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        totalPosts: user.totalPosts + newPosts,
        totalVerified: user.totalVerified + newVerified,
        reputation: user.reputation + (newVerified * 10)
      };
      setUser(updatedUser);
      localStorage.setItem('trunet-user', JSON.stringify(updatedUser));
    }
  };

  return { user, login, signup, logout, loading, updateUserStats };
};