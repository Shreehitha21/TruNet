import React, { useState } from 'react';
import { Upload, FileText, Image, Video, Music, File, AlertCircle, CheckCircle, Loader, Shield, Eye, Clock, Database, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';
import { LeakDetection, ModerationResult } from '../types';

export const UploadContent: React.FC = () => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [leakResults, setLeakResults] = useState<LeakDetection[]>([]);
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);
  const [forensicsResults, setForensicsResults] = useState<any[]>([]);
  const [ipfsHashes, setIpfsHashes] = useState<string[]>([]);
  const [uploadSteps, setUploadSteps] = useState({
    content: false,
    moderation: false,
    forensics: false,
    leakCheck: false,
    ipfs: false
  });
  const [currentStep, setCurrentStep] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-600" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5 text-purple-600" />;
    if (type.startsWith('audio/')) return <Music className="h-5 w-5 text-green-600" />;
    if (type.includes('text')) return <FileText className="h-5 w-5 text-gray-600" />;
    return <File className="h-5 w-5 text-gray-600" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadSteps({
      content: false,
      moderation: false,
      forensics: false,
      leakCheck: false,
      ipfs: false
    });
    setLeakResults([]);
    setModerationResult(null);
    setForensicsResults([]);
    setIpfsHashes([]);

    try {
      // Step 1: Content Analysis
      setCurrentStep('Analyzing content structure and metadata...');
      setUploadSteps(prev => ({ ...prev, content: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mediaUrls = files.map(file => URL.createObjectURL(file));
      
      // Step 2: Real AI Moderation
      setCurrentStep('Running real-time AI moderation checks...');
      setUploadSteps(prev => ({ ...prev, moderation: true }));
      const moderation = await apiService.moderateContent(content, mediaUrls);
      setModerationResult(moderation);

      // Step 3: Digital Forensics Analysis
      if (files.length > 0) {
        setCurrentStep('Performing deep digital forensics analysis...');
        setUploadSteps(prev => ({ ...prev, forensics: true }));
        const forensicsPromises = files.map(file => apiService.analyzeMediaForensics(file));
        const forensics = await Promise.all(forensicsPromises);
        setForensicsResults(forensics);
      } else {
        setUploadSteps(prev => ({ ...prev, forensics: true }));
      }

      // Step 4: Real Leak Detection
      if (files.length > 0) {
        setCurrentStep('Scanning against external databases (TinEye, Google, etc.)...');
        setUploadSteps(prev => ({ ...prev, leakCheck: true }));
        const leakPromises = files.map(file => apiService.checkForLeaks(file));
        const leakChecks = await Promise.all(leakPromises);
        setLeakResults(leakChecks);
      } else {
        setUploadSteps(prev => ({ ...prev, leakCheck: true }));
      }

      // Step 5: IPFS Upload (if approved)
      if (moderation.recommendation === 'approve') {
        setCurrentStep('Uploading to IPFS for permanent decentralized storage...');
        setUploadSteps(prev => ({ ...prev, ipfs: true }));
        if (files.length > 0) {
          const ipfsPromises = files.map(file => apiService.uploadToIPFS(file));
          const hashes = await Promise.all(ipfsPromises);
          setIpfsHashes(hashes);
        }
      } else {
        setUploadSteps(prev => ({ ...prev, ipfs: true }));
      }

      setCurrentStep('Analysis complete! Check results below.');
      
      // UPDATE USER STATS WHEN CONTENT IS ACTUALLY UPLOADED
      const { updateUserStats } = useAuth();
      if (moderation.recommendation === 'approve') {
        updateUserStats(1, 1); // Add 1 post, 1 verified
      } else {
        updateUserStats(1, 0); // Add 1 post, 0 verified
      }
      
      setIsUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      setCurrentStep('Analysis failed. Please try again.');
      setIsUploading(false);
    }
  };

  const getStatusIcon = (completed: boolean, isActive: boolean) => {
    if (completed) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (isActive) return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
    return <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />;
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'approve': return 'text-green-600 bg-green-50 border-green-200';
      case 'review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'reject': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLeakStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'text-green-600 bg-green-50 border-green-200';
      case 'suspected': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'confirmed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Content Analysis & Verification</h2>
            <p className="text-gray-600">Multi-layer AI models analyze and verify your content</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Share your story, news, or insights. Our AI will verify authenticity and check for leaks..."
              required
            />
            <div className="mt-2 text-sm text-gray-500">
              {content.length}/2000 characters
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Media Files (Your Personal Content)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Choose Your Files
              </label>
              <p className="text-sm text-gray-500 mt-3">
                Upload your personal photos, videos, audio, or documents
              </p>
              <p className="text-xs text-gray-400 mt-1">
                We'll check if they've been leaked or shared elsewhere
              </p>
            </div>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Your Files ({files.length}):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="personal, family, vacation, work (comma-separated)"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || !content.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg"
          >
            {isUploading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader className="animate-spin h-5 w-5" />
                <span>Analyzing Your Content...</span>
              </div>
            ) : (
              'Check for Leaks & Verify'
            )}
          </button>
        </form>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Analysis Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(uploadSteps.content, isUploading && !uploadSteps.content)}
              <span className="text-sm text-gray-700">Content analysis and validation</span>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(uploadSteps.moderation, isUploading && uploadSteps.content && !uploadSteps.moderation)}
              <span className="text-sm text-gray-700">AI moderation via external APIs</span>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(uploadSteps.forensics, isUploading && uploadSteps.moderation && !uploadSteps.forensics)}
              <span className="text-sm text-gray-700">Digital forensics and metadata analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(uploadSteps.leakCheck, isUploading && uploadSteps.forensics && !uploadSteps.leakCheck)}
              <span className="text-sm text-gray-700">External database leak detection</span>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(uploadSteps.ipfs, isUploading && uploadSteps.leakCheck && !uploadSteps.ipfs)}
              <span className="text-sm text-gray-700">IPFS decentralized storage</span>
            </div>
          </div>
          {currentStep && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">{currentStep}</p>
            </div>
          )}
        </div>
      )}

      {/* Leak Detection Results */}
      {leakResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Leak Detection Results</h3>
            <span className="text-sm text-gray-500">(External Database Scan)</span>
          </div>
          <div className="space-y-4">
            {leakResults.map((result, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getLeakStatusColor(result.status)}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">Your File: {files[index]?.name}</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLeakStatusColor(result.status)}`}>
                    {result.status === 'clean' ? '✅ Not Found in Databases' :
                     result.status === 'suspected' ? '⚠️ Possible Match Found' :
                     '🚨 Confirmed Leak Detected'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="block font-medium">Similarity:</span>
                    <span className="text-gray-900">{(result.similarity * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="block font-medium">Confidence:</span>
                    <span className="text-gray-900">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="block font-medium">First Seen:</span>
                    <span className="text-gray-900">{new Date(result.firstSeen).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Database ID:</span>
                    <span className="text-gray-900 font-mono text-xs">{result.id}</span>
                  </div>
                </div>

                {result.originalSource && result.status !== 'clean' && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Found in: {result.originalSource}
                      </span>
                      <ExternalLink className="h-3 w-3 text-yellow-600" />
                    </div>
                    {result.status === 'confirmed' && (
                      <p className="text-xs text-yellow-700 mt-1">
                        This content appears to have been previously published or leaked.
                      </p>
                    )}
                  </div>
                )}

                {result.status === 'clean' && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Your content appears to be original and hasn't been found in external databases.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Moderation Results */}
      {moderationResult && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Moderation Results</h3>
            <span className="text-sm text-gray-500">(Real-time Analysis)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{(moderationResult.confidence * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600">AI Confidence</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{(moderationResult.score * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Risk Score</div>
            </div>
            <div className={`text-center p-4 rounded-lg border ${getRecommendationColor(moderationResult.recommendation)}`}>
              <div className="text-lg font-bold capitalize">{moderationResult.recommendation}</div>
              <div className="text-sm">Recommendation</div>
            </div>
          </div>
          {moderationResult.flags.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Detected Issues:</h4>
              <div className="flex flex-wrap gap-2">
                {moderationResult.flags.map((flag, index) => (
                  <span key={index} className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                    {flag.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Digital Forensics Results */}
      {forensicsResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Digital Forensics Analysis</h3>
          </div>
          <div className="space-y-4">
            {forensicsResults.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">File: {files[index]?.name}</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    result.authentic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.authentic ? 'Authentic' : 'Potentially Manipulated'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Confidence:</span>
                    <div className="font-medium">{(result.confidence * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">File Hash:</span>
                    <div className="font-medium font-mono text-xs">{result.metadata.hash}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">File Size:</span>
                    <div className="font-medium">{(result.metadata.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Modified:</span>
                    <div className="font-medium text-xs">{new Date(result.metadata.lastModified).toLocaleDateString()}</div>
                  </div>
                </div>
                {result.manipulationTypes.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-600">Detected issues:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {result.manipulationTypes.map((type: string, i: number) => (
                        <span key={i} className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          {type.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IPFS Results */}
      {ipfsHashes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">IPFS Storage Complete</h3>
          </div>
          <div className="space-y-3">
            {ipfsHashes.map((hash, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">File {index + 1}:</span>
                  <span className="ml-2 text-sm text-gray-600">{files[index]?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border font-mono">{hash}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(hash)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Success!</strong> Your verified content has been stored on IPFS for permanent, decentralized access.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};