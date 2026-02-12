
import React from 'react';
import { CHAPTERS } from '../constants';

interface SidebarProps {
  currentChapterId: string;
  onSelectChapter: (id: string) => void;
  bookmarks: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentChapterId, onSelectChapter, bookmarks }) => {
  const bookmarkedChapters = CHAPTERS.filter(c => bookmarks.includes(c.id));

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          RoboAcademy
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Physical AI Course</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Bookmarks Section */}
        {bookmarkedChapters.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-1">
            <h3 className="text-[10px] font-bold text-amber-500 uppercase px-3 mb-2 flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              My Bookmarks
            </h3>
            <ul className="space-y-1">
              {bookmarkedChapters.map(chapter => (
                <li key={`bookmark-${chapter.id}`}>
                  <button
                    onClick={() => onSelectChapter(chapter.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
                      currentChapterId === chapter.id 
                        ? 'bg-amber-500/10 text-amber-400 font-medium' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    <span className="truncate">{chapter.title}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mx-3 mt-4 mb-2 border-t border-slate-800/50"></div>
          </div>
        )}

        {/* Standard Modules */}
        {["Introduction", "Module 1", "Module 2", "Module 3"].map(moduleName => (
          <div key={moduleName}>
            <h3 className="text-xs font-bold text-slate-500 uppercase px-3 mb-2">{moduleName}</h3>
            <ul className="space-y-1">
              {CHAPTERS.filter(c => c.module === moduleName).map(chapter => (
                <li key={chapter.id}>
                  <button
                    onClick={() => onSelectChapter(chapter.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
                      currentChapterId === chapter.id 
                        ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    <span className="truncate">{chapter.title}</span>
                    {bookmarks.includes(chapter.id) && (
                      <svg className="w-3 h-3 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-slate-300 font-medium">Lab Status: Ready</span>
          </div>
          <button className="text-[10px] w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 rounded transition-colors">
            Connect to Edge Kit
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
