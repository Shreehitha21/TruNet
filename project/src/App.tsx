import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { UploadContent } from './components/UploadContent';
import { UserProfile } from './components/UserProfile';
import { LeakScanner } from './components/LeakScanner';
import { NewsVerification } from './components/NewsVerification';
import { SafetyCenter } from './components/SafetyCenter';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Securing Your Digital Privacy</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Initializing advanced leak detection systems and AI verification engines...
          </p>
        </div>
      </div>
    );
  }

  // Show login form if user is not authenticated
  if (!user) {
    return <AuthForm onAuth={() => {
      console.log('Authentication successful, user should be logged in');
      // The user state will be updated by the auth hook
    }} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard />;
      case 'upload':
        return <UploadContent />;
      case 'scanner':
        return <LeakScanner />;
      case 'news':
        return <NewsVerification />;
      case 'safety':
        return <SafetyCenter />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;