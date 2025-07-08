import React from 'react';
import { Heart, Share2, MessageCircle, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const getLeakStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'text-green-600 bg-green-50';
      case 'suspected': return 'text-yellow-600 bg-yellow-50';
      case 'confirmed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getLeakStatusIcon = (status: string) => {
    switch (status) {
      case 'clean': return <CheckCircle className="h-4 w-4" />;
      case 'suspected': return <AlertTriangle className="h-4 w-4" />;
      case 'confirmed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
            alt={post.author.username}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{post.author.username}</h3>
              {post.author.verified && (
                <CheckCircle className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(post.timestamp)}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {post.verified && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
              Verified
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getLeakStatusColor(post.leakStatus)}`}>
            {getLeakStatusIcon(post.leakStatus)}
            <span className="capitalize">{post.leakStatus}</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-900 mb-3">{post.content}</p>
        
        {post.mediaUrls.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {post.mediaUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Media ${index + 1}`}
                className="rounded-lg max-h-64 w-full object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
            <Heart className="h-5 w-5" />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
            <Share2 className="h-5 w-5" />
            <span>{post.shares}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>AI Score: {(post.aiModerationScore * 100).toFixed(0)}%</span>
          {post.ipfsHash && (
            <span className="text-blue-600">IPFS</span>
          )}
        </div>
      </div>
    </div>
  );
};