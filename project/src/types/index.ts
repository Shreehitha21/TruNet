export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  reputation: number;
  verified: boolean;
  joinDate: string;
  totalPosts: number;
  totalVerified: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  mediaUrls: string[];
  mediaType: 'text' | 'image' | 'video' | 'audio' | 'document';
  timestamp: string;
  verified: boolean;
  aiModerationScore: number;
  leakStatus: 'clean' | 'suspected' | 'confirmed';
  ipfsHash?: string;
  likes: number;
  shares: number;
  comments: number;
  tags: string[];
}

export interface LeakDetection {
  id: string;
  originalSource?: string;
  similarity: number;
  confidence: number;
  firstSeen: string;
  status: 'clean' | 'suspected' | 'confirmed';
}

export interface ModerationResult {
  score: number;
  flags: string[];
  recommendation: 'approve' | 'review' | 'reject';
  confidence: number;
}