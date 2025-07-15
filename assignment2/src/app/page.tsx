'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Zap, Brain, FileText, Globe, AlertCircle } from 'lucide-react';

type NullableString = string | null;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export default function Home() {
  /* ─── State ─── */
  const [url, setUrl] = useState('');
  const [content, setContent] = useState<NullableString>(null);
  const [summaryEn, setSummaryEn] = useState<NullableString>(null);
  const [summaryUrdu, setSummaryUrdu] = useState<NullableString>(null);
  const [error, setError] = useState<NullableString>(null);
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  /* ─── Interactive particle system ─── */
  useEffect(() => {
    const colors = isDarkMode 
      ? ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B']
      : ['#1E40AF', '#7C3AED', '#0891B2', '#059669', '#D97706'];
    const particleArray: Particle[] = [];

    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    for (let i = 0; i < 30; i++) {
      particleArray.push({
        x: Math.random() * windowWidth,
        y: Math.random() * windowHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    setParticles(particleArray);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isDarkMode]);

  /* ─── Typing effect for URL input ─── */
  useEffect(() => {
    if (url.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timer);
    }
  }, [url]);

  /* ─── Real demo links ─── */
  const predefined = [
    {
      title: 'HubSpot – AI Marketing',
      url: 'https://blog.hubspot.com/marketing/future-of-ai-marketing',
      gradient: isDarkMode ? 'from-emerald-500/20 to-teal-500/20' : 'from-emerald-200/60 to-teal-200/60',
      icon: <Brain className="w-5 h-5" />
    },
    {
      title: 'FreeCodeCamp – JS Closures',
      url: 'https://www.freecodecamp.org/news/javascript-closure/',
      gradient: isDarkMode ? 'from-blue-500/20 to-purple-500/20' : 'from-blue-200/60 to-purple-200/60',
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: 'Cursor – AI-First Code Editor',
      url: 'https://www.cursor.so/',
      gradient: isDarkMode ? 'from-pink-500/20 to-rose-500/20' : 'from-pink-200/60 to-rose-200/60',
      icon: <Zap className="w-5 h-5" />
    }
  ];

  /* ─── Real fetch function with working API call ─── */
  const fetchSummary = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    
    // Validate URL
    try {
      new URL(targetUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);
    setContent(null);
    setSummaryEn(null);
    setSummaryUrdu(null);
    setProcessingStep('');

    try {
      // Step 1: Processing
      setProcessingStep('🔍 Scraping web content...');
      
      const res = await fetch('/api/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      
      // Step 2: AI Analysis
      setProcessingStep('🤖 Generating AI summaries...');
      
      const data = await res.json();

      setContent(data.content ?? null);
      setSummaryEn(data.summaryEn ?? null);
      setSummaryUrdu(data.summary ?? null); 
      
      setProcessingStep('✅ Analysis complete!');
      setTimeout(() => setProcessingStep(''), 2000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      setProcessingStep('');
    } finally {
      setLoading(false);
    }
  };

  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    textTertiary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    card: isDarkMode ? 'bg-gray-800/50' : 'bg-white/90 shadow-xl shadow-purple-100/50',
    border: isDarkMode ? 'border-gray-700/50' : 'border-purple-200/30',
    input: isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-purple-200 shadow-lg shadow-purple-100/50',
    gradient: isDarkMode ? 'from-blue-600 via-purple-600 to-pink-600' : 'from-blue-500 via-purple-500 to-pink-500'
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} relative overflow-hidden transition-all duration-500`}>
      {/* Dynamic gradient background */}
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-teal-900/10' : 'bg-gradient-to-br from-blue-200/40 via-purple-200/40 to-pink-200/40'}`}></div>
      
      {/* Animated mesh background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? "#3B82F6" : "#3B82F6"} stopOpacity={isDarkMode ? "0.2" : "0.4"} />
              <stop offset="50%" stopColor={isDarkMode ? "#8B5CF6" : "#8B5CF6"} stopOpacity={isDarkMode ? "0.1" : "0.3"} />
              <stop offset="100%" stopColor={isDarkMode ? "#06B6D4" : "#EC4899"} stopOpacity={isDarkMode ? "0.05" : "0.2"} />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDarkMode ? "#8B5CF6" : "#10B981"} stopOpacity={isDarkMode ? "0.1" : "0.3"} />
              <stop offset="100%" stopColor={isDarkMode ? "#EC4899" : "#F59E0B"} stopOpacity={isDarkMode ? "0.05" : "0.2"} />
            </linearGradient>
          </defs>
          <path d="M0,200 Q300,100 600,200 T1200,200 L1200,0 L0,0 Z" fill="url(#grad1)" className="animate-pulse" />
          <path d="M0,400 Q300,350 600,400 T1200,400 L1200,200 L0,200 Z" fill="url(#grad2)" className="animate-pulse" style={{ animationDelay: '1s' }} />
        </svg>
      </div>

      {/* Interactive particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle, i) => {
          const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
          const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
          
          return (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${(particle.x / windowWidth) * 100}%`,
                top: `${(particle.y / windowHeight) * 100}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                transform: `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() * 0.001 + i) * 0.3})`,
                animation: `float ${3 + i * 0.1}s ease-in-out infinite alternate`
              }}
            />
          );
        })}
      </div>

      {/* Mouse follower effect */}
      <div 
        className={`fixed pointer-events-none z-10 w-96 h-96 rounded-full opacity-5 bg-gradient-to-r ${themeClasses.gradient} blur-3xl transition-all duration-300`}
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Theme toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-full ${themeClasses.card} ${themeClasses.border} border backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header with unique layout */}
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left side - Brand */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-r ${themeClasses.gradient} rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300`}>
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-5xl font-black ${themeClasses.text}`}>
                  Neural<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">AI</span>
                </h1>
                <p className={`text-xl ${themeClasses.textSecondary} mt-2`}>Intelligent Blog Summarizer</p>
              </div>
            </div>

            {/* Right side - Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${themeClasses.text}`}>15K+</div>
                <div className={`text-sm ${themeClasses.textTertiary}`}>Articles Processed</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${themeClasses.text}`}>2</div>
                <div className={`text-sm ${themeClasses.textTertiary}`}>Languages</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${themeClasses.text}`}>AI</div>
                <div className={`text-sm ${themeClasses.textTertiary}`}>Powered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="container mx-auto px-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
            {/* Left column - Input and demos */}
            <div className="lg:col-span-5 space-y-6">
              {/* Input section */}
              <div className={`${themeClasses.card} ${themeClasses.border} border backdrop-blur-xl rounded-3xl p-8 shadow-xl`}>
                <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center gap-3`}>
                  <Globe className="w-6 h-6" />
                  Enter URL
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/blog-post"
                      className={`w-full px-4 py-4 ${themeClasses.input} rounded-xl ${themeClasses.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg ${isTyping ? 'ring-2 ring-blue-400' : ''}`}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${themeClasses.gradient} rounded-full flex items-center justify-center`}>
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => fetchSummary(url)}
                    disabled={loading || !url.trim()}
                    className={`w-full bg-gradient-to-r ${themeClasses.gradient} hover:opacity-90 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 text-white`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Brain className="w-5 h-5" />
                        <span>Generate Summary</span>
                        <Zap className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                  
                  {/* Processing step indicator */}
                  {loading && processingStep && (
                    <div className="flex items-center justify-center gap-3 text-blue-500">
                      <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="text-sm">{processingStep}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick demos */}
              <div className={`${themeClasses.card} ${themeClasses.border} border backdrop-blur-xl rounded-3xl p-8 shadow-xl`}>
                <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>Quick Demos</h3>
                <div className="space-y-3">
                  {predefined.map((item) => (
                    <button
                      key={item.url}
                      onClick={() => {
                        setUrl(item.url);
                        fetchSummary(item.url);
                      }}
                      disabled={loading}
                      className={`w-full group relative bg-gradient-to-r ${item.gradient} p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-left`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                          {item.icon}
                        </div>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {item.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status indicator */}
              <div className={`${themeClasses.card} ${themeClasses.border} border backdrop-blur-xl rounded-3xl p-8 shadow-xl`}>
                <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${loading ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                      <span className={`${themeClasses.text} font-medium`}>Web Scraper</span>
                    </div>
                    <span className={`text-sm ${loading ? 'text-blue-500' : 'text-green-500'}`}>
                      {loading ? 'Processing...' : 'Ready'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${loading ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                      <span className={`${themeClasses.text} font-medium`}>AI Service</span>
                    </div>
                    <span className={`text-sm ${loading ? 'text-blue-500' : 'text-green-500'}`}>
                      {loading ? 'Analyzing...' : 'Online'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Results */}
            <div className="lg:col-span-7 space-y-6">
              {/* Content section */}
              {content && (
                <div className={`${themeClasses.card} ${themeClasses.border} border backdrop-blur-xl rounded-3xl p-8 shadow-xl`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg`}>
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold ${themeClasses.text}`}>Extracted Content</h3>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-100/50'} rounded-xl p-6 max-h-80 overflow-y-auto`}>
                    <p className={`${themeClasses.textSecondary} leading-relaxed whitespace-pre-wrap`}>
                      {content}
                    </p>
                  </div>
                </div>
              )}

              {/* Summaries section */}
              <div className={`${themeClasses.card} ${themeClasses.border} border backdrop-blur-xl rounded-3xl p-8 shadow-xl`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg`}>
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold ${themeClasses.text}`}>AI Analysis</h3>
                </div>

                {summaryEn && (
                  <div className="mb-8">
                    <h4 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center gap-2`}>
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      English Summary
                    </h4>
                    <div className={`${isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300'} rounded-xl p-6 border`}>
                      <p className={`${themeClasses.textSecondary} leading-relaxed whitespace-pre-wrap`}>
                        {summaryEn}
                      </p>
                    </div>
                  </div>
                )}

                {summaryUrdu && (
                  <div>
                    <h4 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center gap-2`}>
                      <span className="w-3 h-3 bg-pink-500 rounded-full"></span>
                      اردو خلاصہ
                    </h4>
                    <div className={`${isDarkMode ? 'bg-pink-500/10 border-pink-500/20' : 'bg-gradient-to-r from-pink-100 to-rose-200 border-pink-300'} rounded-xl p-6 border`}>
                      <p className={`${themeClasses.textSecondary} leading-relaxed whitespace-pre-wrap text-right`} dir="rtl">
                        {summaryUrdu}
                      </p>
                    </div>
                  </div>
                )}

                {!summaryEn && !summaryUrdu && !loading && (
                  <div className="text-center py-16">
                    <div className={`w-24 h-24 bg-gradient-to-r ${themeClasses.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                      <Brain className="w-12 h-12 text-white" />
                    </div>
                    <p className={`${themeClasses.textSecondary} text-lg`}>Ready to analyze your content</p>
                    <p className={`${themeClasses.textTertiary} text-sm mt-2`}>Enter a URL to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error with better styling */}
        {error && (
          <div className="container mx-auto px-6 pb-8">
            <div className={`bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 shadow-xl`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-red-400">Error Detected</h3>
              </div>
              <p className="text-red-300 text-lg">{error}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
