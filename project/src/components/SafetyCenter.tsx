import React, { useState } from 'react';
import { Shield, Heart, AlertTriangle, Phone, ExternalLink, Lock, Eye, Users, BookOpen, MessageCircle } from 'lucide-react';

export const SafetyCenter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('privacy');

  const categories = [
    { id: 'privacy', name: 'Privacy Protection', icon: Lock, color: 'blue' },
    { id: 'harassment', name: 'Harassment Support', icon: Heart, color: 'pink' },
    { id: 'legal', name: 'Legal Resources', icon: Shield, color: 'green' },
    { id: 'education', name: 'Digital Literacy', icon: BookOpen, color: 'purple' },
  ];

  const resources = {
    privacy: [
      {
        title: 'Immediate Steps if Your Photos Are Leaked',
        description: 'Step-by-step guide to protect yourself when intimate images are shared without consent',
        actions: [
          'Document everything - take screenshots of where your images appear',
          'Report to platform administrators immediately',
          'Contact law enforcement if applicable',
          'Seek support from trusted friends or professionals',
          'Consider legal action with specialized attorneys'
        ],
        urgency: 'high'
      },
      {
        title: 'Preventive Privacy Measures',
        description: 'Protect yourself before sharing personal content',
        actions: [
          'Use watermarks on personal photos',
          'Be selective about who you share intimate content with',
          'Understand the risks of cloud storage',
          'Regularly audit your social media privacy settings',
          'Use secure messaging apps with disappearing messages'
        ],
        urgency: 'medium'
      }
    ],
    harassment: [
      {
        title: '24/7 Crisis Support Hotlines',
        description: 'Immediate help when you need it most',
        actions: [
          'National Sexual Assault Hotline: 1-800-656-4673',
          'Crisis Text Line: Text HOME to 741741',
          'National Domestic Violence Hotline: 1-800-799-7233',
          'Cyber Civil Rights Initiative: cybercivilrights.org',
          'RAINN Online Chat: rainn.org'
        ],
        urgency: 'high'
      },
      {
        title: 'Emotional Support Resources',
        description: 'Professional help and peer support communities',
        actions: [
          'Find local counselors specializing in digital abuse',
          'Join support groups for survivors',
          'Access free mental health resources',
          'Connect with advocacy organizations',
          'Learn coping strategies and self-care techniques'
        ],
        urgency: 'medium'
      }
    ],
    legal: [
      {
        title: 'Know Your Legal Rights',
        description: 'Understanding laws that protect you from image-based abuse',
        actions: [
          '48 US states have non-consensual pornography laws',
          'Copyright law may protect your images',
          'Criminal charges may apply in your jurisdiction',
          'Civil lawsuits can seek damages and removal',
          'International laws vary - consult local experts'
        ],
        urgency: 'high'
      },
      {
        title: 'Finding Legal Help',
        description: 'Connect with attorneys who specialize in digital privacy',
        actions: [
          'Contact the Cyber Civil Rights Initiative for referrals',
          'Look for pro bono legal services in your area',
          'Consult with attorneys experienced in privacy law',
          'Document all evidence before contacting lawyers',
          'Understand the costs and timeline of legal action'
        ],
        urgency: 'medium'
      }
    ],
    education: [
      {
        title: 'Digital Safety Education',
        description: 'Learn to protect yourself in the digital age',
        actions: [
          'Understand how image recognition technology works',
          'Learn about metadata and how it can expose you',
          'Recognize deepfakes and manipulated content',
          'Understand the permanence of digital content',
          'Learn about secure communication tools'
        ],
        urgency: 'low'
      },
      {
        title: 'Teaching Others',
        description: 'Help friends and family stay safe online',
        actions: [
          'Share safety resources with loved ones',
          'Educate about consent in digital relationships',
          'Teach recognition of manipulation tactics',
          'Promote healthy digital boundaries',
          'Support comprehensive digital literacy education'
        ],
        urgency: 'low'
      }
    ]
  };

  const emergencyContacts = [
    { name: 'National Sexual Assault Hotline', number: '1-800-656-4673', available: '24/7' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
    { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', available: '24/7' },
    { name: 'Cyber Civil Rights Initiative', number: 'Visit cybercivilrights.org', available: 'Online Resources' },
  ];

  // WORKING BUTTON FUNCTIONS
  const handleEmergencyCall = (contact: any) => {
    if (contact.number.includes('1-800') || contact.number.includes('1-')) {
      // For phone numbers, try to initiate call
      window.location.href = `tel:${contact.number}`;
    } else if (contact.number.includes('Text')) {
      // For text services
      alert(`CRISIS TEXT LINE:\n\nText "HOME" to 741741\n\nThis will connect you with a trained crisis counselor who can provide immediate support and resources.`);
    } else {
      // For websites
      window.open('https://cybercivilrights.org', '_blank');
    }
  };

  const handleFindCommunities = () => {
    const communities = [
      '🤝 Cyber Civil Rights Initiative Support Groups',
      '💬 RAINN Online Support Communities',
      '🌐 Reddit: r/survivorsofabuse',
      '📱 7 Cups Online Emotional Support',
      '🏥 Local hospital support groups',
      '🎓 University counseling centers'
    ];
    
    alert(`SUPPORT COMMUNITIES:\n\n${communities.join('\n\n')}\n\nThese communities provide peer support from people who understand your experience.`);
  };

  const handleFindCounselors = () => {
    const counselorResources = [
      '🔍 Psychology Today Therapist Finder',
      '🏥 Local mental health centers',
      '📞 Employee Assistance Programs (EAP)',
      '🎓 University counseling services',
      '💰 Sliding scale fee therapists',
      '🌐 Online therapy platforms (BetterHelp, Talkspace)'
    ];
    
    alert(`PROFESSIONAL COUNSELING:\n\n${counselorResources.join('\n\n')}\n\nLook for therapists specializing in trauma, digital abuse, or sexual assault recovery.`);
  };

  const handleViewExternalResources = () => {
    const externalResources = [
      '🌐 Cyber Civil Rights Initiative: cybercivilrights.org',
      '🆘 RAINN: rainn.org',
      '📞 National Sexual Assault Hotline: 1-800-656-4673',
      '💬 Crisis Text Line: Text HOME to 741741',
      '⚖️ Legal Aid Society: legalaid.org',
      '🛡️ Electronic Frontier Foundation: eff.org'
    ];
    
    alert(`EXTERNAL RESOURCES:\n\n${externalResources.join('\n\n')}\n\nThese organizations provide specialized support for digital privacy and abuse issues.`);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-blue-300 bg-blue-50';
    }
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      pink: 'from-pink-500 to-pink-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Safety & Support Center</h1>
              <p className="text-white/90 text-lg">You're not alone. We're here to help protect your privacy and dignity.</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold">If you're in immediate danger, call emergency services (911)</span>
            </div>
            <p className="text-sm text-white/80">
              This center provides resources for digital privacy protection, harassment support, and legal guidance.
            </p>
          </div>
        </div>
      </div>

      {/* WORKING Emergency Contacts */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Phone className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">Emergency Support Contacts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-red-900">{contact.name}</h3>
                  <p className="text-red-700 font-mono text-lg">{contact.number}</p>
                  <p className="text-sm text-red-600">{contact.available}</p>
                </div>
                <button
                  onClick={() => handleEmergencyCall(contact)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Call or Access Resource"
                >
                  <Phone className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Support Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl transition-all ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${getCategoryColor(category.color)} text-white shadow-lg transform scale-105`
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <category.icon className="h-6 w-6 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">{category.name}</h3>
            </button>
          ))}
        </div>

        {/* Resource Content */}
        <div className="space-y-6">
          {resources[selectedCategory as keyof typeof resources].map((resource, index) => (
            <div key={index} className={`border-2 rounded-xl p-6 ${getUrgencyColor(resource.urgency)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{resource.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  resource.urgency === 'high' ? 'bg-red-200 text-red-800' :
                  resource.urgency === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {resource.urgency === 'high' ? 'URGENT' : 
                   resource.urgency === 'medium' ? 'IMPORTANT' : 'EDUCATIONAL'}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{resource.description}</p>
              <div className="space-y-2">
                {resource.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-600 mt-0.5">
                      {actionIndex + 1}
                    </div>
                    <p className="text-gray-700">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WORKING Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Support Communities</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Connect with others who understand your experience and can provide peer support.
          </p>
          <button 
            onClick={handleFindCommunities}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Find Communities
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Professional Counseling</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Access trained professionals who specialize in digital abuse and trauma recovery.
          </p>
          <button 
            onClick={handleFindCounselors}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Find Counselors
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ExternalLink className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">External Resources</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Links to trusted organizations, legal aid, and specialized support services.
          </p>
          <button 
            onClick={handleViewExternalResources}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Resources
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-3">
          <Lock className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Your Privacy is Protected</h3>
        </div>
        <p className="text-gray-700">
          All interactions with our safety center are confidential. We do not store personal information 
          or track your usage of these resources. Your safety and privacy are our top priorities.
        </p>
      </div>
    </div>
  );
};