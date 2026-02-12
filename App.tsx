
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import Visualizer from './components/Visualizer';
import { CHAPTERS } from './constants';
import { UserProfile, Chapter } from './types';
import { personalizeContent } from './services/geminiService';

// Auth Screen Component
const AuthScreen: React.FC<{ onLogin: (profile: UserProfile) => void }> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    background: 'Beginner',
    hardware: '',
    software: '',
    interests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: formData.name,
      email: formData.email,
      background: formData.background,
      hardwareExperience: formData.hardware,
      softwareExperience: formData.software,
      specificInterests: formData.interests
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Join Panaversity</h2>
          <p className="text-slate-400 mt-2">Personalize your robotics learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="Zia Khan"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Professional Background</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                onChange={e => setFormData({...formData, background: e.target.value})}
              >
                <option>Undergrad Student</option>
                <option>Embedded Engineer</option>
                <option>Software Developer</option>
                <option>AI Researcher</option>
                <option>Mechanical Engineer</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Primary Interests / Focus Areas</label>
            <textarea 
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Legged Locomotion, Control Systems, Edge AI..."
              onChange={e => setFormData({...formData, interests: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hardware Experience</label>
            <input 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Jetson, Arduino"
              onChange={e => setFormData({...formData, hardware: e.target.value})}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-lg shadow-lg transition-all"
          >
            Start Learning
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-600 mt-6">
          Powered by Better-Auth & Panaversity Ecosystem
        </p>
      </div>
    </div>
  );
};

const TextbookView: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [currentChapterId, setCurrentChapterId] = useState(CHAPTERS[0].id);
  const [isUrdu, setIsUrdu] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [personalizedText, setPersonalizedText] = useState<string | null>(null);
  const [loadingPersonalization, setLoadingPersonalization] = useState(false);
  const [currentFocus, setCurrentFocus] = useState("");
  const [showFocusInput, setShowFocusInput] = useState(false);
  
  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('robo_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Chapter[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const chapter = CHAPTERS.find(c => c.id === currentChapterId) || CHAPTERS[0];

  useEffect(() => {
    setPersonalizedText(null);
    setIsUrdu(false);
    setIsPersonalized(false);
  }, [currentChapterId]);

  useEffect(() => {
    localStorage.setItem('robo_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Handle outside clicks for search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const filtered = CHAPTERS.filter(c => 
      c.title.toLowerCase().includes(query.toLowerCase()) || 
      c.content.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  const selectSearchResult = (id: string) => {
    setCurrentChapterId(id);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const toggleBookmark = () => {
    setBookmarks(prev => 
      prev.includes(currentChapterId) 
        ? prev.filter(id => id !== currentChapterId) 
        : [...prev, currentChapterId]
    );
  };

  const togglePersonalization = async () => {
    if (!isPersonalized) {
      setLoadingPersonalization(true);
      const backgroundStr = `${user.background}, HW: ${user.hardwareExperience}, SW: ${user.softwareExperience}`;
      const newContent = await personalizeContent(
        chapter.content, 
        backgroundStr, 
        user.specificInterests,
        currentFocus
      );
      setPersonalizedText(newContent);
      setLoadingPersonalization(false);
    }
    setIsPersonalized(!isPersonalized);
  };

  const getSnippet = (content: string, query: string) => {
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return content.substring(0, 100) + "...";
    const start = Math.max(0, index - 40);
    const end = Math.min(content.length, index + 60);
    return (start > 0 ? "..." : "") + content.substring(start, end) + "...";
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar 
        currentChapterId={currentChapterId} 
        onSelectChapter={setCurrentChapterId} 
        bookmarks={bookmarks}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-slate-500 font-medium text-sm hidden lg:inline">{chapter.module}</span>
              <span className="text-slate-700 hidden lg:inline">/</span>
              <span className="text-white font-semibold whitespace-nowrap">{chapter.title}</span>
              
              {/* Bookmark Toggle */}
              <button 
                onClick={toggleBookmark}
                className={`p-1.5 rounded-md transition-all hover:scale-110 active:scale-95 ${
                  bookmarks.includes(currentChapterId) ? 'text-amber-500' : 'text-slate-600 hover:text-slate-400'
                }`}
                title={bookmarks.includes(currentChapterId) ? "Remove Bookmark" : "Save Chapter"}
              >
                <svg className="w-5 h-5" fill={bookmarks.includes(currentChapterId) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1" ref={searchContainerRef}>
              <div className="relative group">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  placeholder="Search course content... (Ctrl+K)"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-1.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-11 left-0 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="max-h-[400px] overflow-y-auto p-2">
                    {searchResults.length > 0 ? (
                      searchResults.map(result => (
                        <button
                          key={result.id}
                          onClick={() => selectSearchResult(result.id)}
                          className="w-full text-left p-3 hover:bg-slate-800 rounded-lg transition-colors group border-b border-slate-800/50 last:border-0"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">{result.module}</span>
                            <span className="text-[10px] text-slate-600 font-mono">Chapter ID: {result.id}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{result.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                            {getSnippet(result.content, searchQuery)}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <svg className="w-8 h-8 text-slate-700 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-slate-500 text-sm">No matches found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            <div className="relative">
               <button 
                onClick={() => setShowFocusInput(!showFocusInput)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  currentFocus ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {currentFocus ? 'Lens Active' : 'Set Focus'}
              </button>
              
              {showFocusInput && (
                <div className="absolute top-10 right-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2">
                   <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Learning Focus</label>
                   <input 
                    type="text"
                    value={currentFocus}
                    onChange={(e) => setCurrentFocus(e.target.value)}
                    placeholder="e.g. 'Simplified for mechanical engineers'"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white mb-3 focus:outline-none focus:border-indigo-500"
                    onKeyDown={(e) => e.key === 'Enter' && setShowFocusInput(false)}
                   />
                   <div className="flex justify-between items-center">
                     <button 
                      onClick={() => {setCurrentFocus(""); setShowFocusInput(false);}}
                      className="text-[10px] text-slate-500 hover:text-red-400"
                     >
                       Clear Focus
                     </button>
                     <button 
                      onClick={() => setShowFocusInput(false)}
                      className="bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] font-bold px-3 py-1 rounded"
                     >
                       Save
                     </button>
                   </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsUrdu(!isUrdu)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isUrdu ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {isUrdu ? 'English' : 'Urdu'}
            </button>
            <button 
              onClick={togglePersonalization}
              disabled={loadingPersonalization}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isPersonalized ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 012-2 2 2 0 012 2v16m-10 0V3a2 2 0 012-2 2 2 0 012 2v18m-10 0V9a2 2 0 012-2 2 2 0 012 2v12" />
              </svg>
              {loadingPersonalization ? '...' : (isPersonalized ? 'Standard' : 'Adapt')}
            </button>
            <div className="h-6 w-px bg-slate-800 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 border border-slate-700">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto w-full p-8 md:p-16">
          <div className="prose prose-invert max-w-none">
            {isUrdu ? (
              <div dir="rtl" className="bg-emerald-950/20 border-r-4 border-emerald-500 p-8 rounded-xl shadow-inner mb-8">
                 <h2 className="text-3xl font-bold mb-4 text-emerald-100">مختصر خلاصہ</h2>
                 <p className="text-xl leading-relaxed text-slate-200">
                   {chapter.urduSummary || "اس باب کا اردو ترجمہ ابھی دستیاب نہیں ہے۔"}
                 </p>
                 <div className="mt-8 text-sm text-emerald-400 italic">
                   Powered by Google Gemini Language Models
                 </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-8">
                  {chapter.title}
                </h1>
                
                {isPersonalized && personalizedText ? (
                   <div className="bg-blue-900/10 border-l-4 border-blue-500 p-6 rounded-lg mb-8 animate-in fade-in slide-in-from-left-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.464 15.05a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM14.95 14.95a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414z" />
                          </svg>
                          Tailored Insights: {currentFocus || user.background}
                        </div>
                        <button 
                          onClick={() => {setIsPersonalized(false); togglePersonalization();}}
                          className="text-[10px] text-blue-400 underline hover:text-blue-300"
                        >
                          Refresh Adaptation
                        </button>
                      </div>
                      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg italic opacity-90 border-l-2 border-blue-500/30 pl-4">
                        {personalizedText}
                      </div>
                   </div>
                ) : (
                  <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {chapter.content}
                  </div>
                )}
                
                <Visualizer data={chapter.visualData} />
                
                {/* References/Lab Section */}
                <div className="mt-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold mb-1">Ready for the Lab?</h4>
                    <p className="text-slate-400 text-sm">Deploy the code for this chapter to your Jetson Orin Nano.</p>
                  </div>
                  <button className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/20 px-6 py-2 rounded-lg font-bold transition-all">
                    Open Workbench
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <footer className="mt-32 pt-8 border-t border-slate-800 text-slate-500 text-sm flex justify-between">
            <p>© 2025 Panaversity. AI-Native Textbook Project.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300">GitHub</a>
              <a href="#" className="hover:text-slate-300">Community</a>
            </div>
          </footer>
        </div>
      </main>

      <Chatbot />
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('robo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('robo_user', JSON.stringify(profile));
  };

  return (
    <Router>
      <div className="text-slate-200">
        {!user ? (
          <AuthScreen onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<TextbookView user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
