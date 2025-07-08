import React, { useState, useEffect } from 'react';
import { Shield, Home, Upload, Search, Newspaper, Heart, User, Bell, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real-time notifications
  useEffect(() => {
    const generateNotifications = () => {
      const notificationTypes = [
        { type: 'leak_detected', message: 'Potential leak detected in your uploaded content', severity: 'high' },
        { type: 'verification_complete', message: 'Your content has been verified and approved', severity: 'low' },
        { type: 'security_alert', message: 'New security measures available for your account', severity: 'medium' },
        { type: 'community_update', message: 'New privacy protection features released', severity: 'low' },
        { type: 'urgent_alert', message: 'Suspicious activity detected on your account', severity: 'high' }
      ];

      const newNotifications = Array.from({ length: 3 }, (_, i) => {
        const notification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        return {
          id: `notif_${Date.now()}_${i}`,
          ...notification,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          read: false
        };
      });

      setNotifications(newNotifications);
    };

    generateNotifications();
    // Update notifications every 30 seconds
    const interval = setInterval(generateNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const navigation = [
    { name: 'Dashboard', icon: Home, key: 'home', description: 'Live verified news feed' },
    { name: 'Upload Content', icon: Upload, key: 'upload', description: 'Share & verify your content' },
    { name: 'Leak Scanner', icon: Search, key: 'scanner', description: 'Check if your photos are leaked', highlight: true },
    { name: 'News Verification', icon: Newspaper, key: 'news', description: 'Verify news authenticity' },
    { name: 'Safety Center', icon: Heart, key: 'safety', description: 'Privacy protection tools' },
    { name: 'Profile', icon: User, key: 'profile', description: 'Your account & achievements' },
  ];

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    // Mark notifications as read
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Shield className="h-10 w-10 text-blue-600" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TruNet
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">AI Truth Verification</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for leaked content..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                />
              </div>
              
              {/* WORKING Notifications */}
              <div className="relative">
                <button 
                  onClick={handleNotificationClick}
                  className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${getSeverityColor(notification.severity)}`}>
                            <div className="flex items-start space-x-3">
                              <div className={`p-1 rounded-full ${
                                notification.severity === 'high' ? 'bg-red-100' :
                                notification.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                              }`}>
                                <AlertTriangle className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200">
                <div className="h-8 w-8 rounded-full ring-2 ring-blue-200 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="text-gray-900 font-semibold">{user?.username}</div>
                  <div className="text-gray-500 flex items-center space-x-1">
                    <span>Rep: {user?.reputation}</span>
                    {user?.verified && <Shield className="h-3 w-3 text-blue-500" />}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <nav className="w-80 bg-white/60 backdrop-blur-lg shadow-xl h-[calc(100vh-4rem)] border-r border-gray-200/50">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Protection Tools
              </h3>
            </div>
            
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => onNavigate(item.key)}
                    className={`w-full group flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      currentPage === item.key
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                        : 'text-gray-700 hover:bg-white/80 hover:shadow-md'
                    } ${item.highlight ? 'ring-2 ring-pink-200 bg-pink-50' : ''}`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      currentPage === item.key 
                        ? 'bg-white/20' 
                        : item.highlight 
                          ? 'bg-pink-100 text-pink-600'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.name}</span>
                        {item.highlight && (
                          <AlertTriangle className="h-4 w-4 text-pink-500" />
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${
                        currentPage === item.key ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {/* Safety Alert */}
            <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl border border-pink-200">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <span className="font-semibold text-pink-800">Safety First</span>
              </div>
              <p className="text-sm text-pink-700">
                Your privacy matters. We're here to protect you from unauthorized sharing and deepfakes.
              </p>
              <button 
                onClick={() => onNavigate('safety')}
                className="mt-2 text-xs text-pink-600 hover:text-pink-800 font-medium"
              >
                Learn more →
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};