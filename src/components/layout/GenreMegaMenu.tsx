import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  SlidersHorizontal,
  X,
  Compass,
  ArrowRight,
  Flame,
  Star,
} from 'lucide-react';
import { BALANCED_GENRE_COLUMNS } from '../../services/anilistService';

interface GenreMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenreMegaMenu: React.FC<GenreMegaMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when user presses Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Read current active genre from URL if on filter page
  const searchParams = new URLSearchParams(location.search);
  const activeGenre = location.pathname.startsWith('/filter') ? searchParams.get('genre') : null;

  if (!isOpen) return null;

  const handleGenreClick = (genre: string) => {
    onClose();
    navigate(`/filter?genre=${encodeURIComponent(genre)}`);
  };

  const handleOpenFilterPage = () => {
    onClose();
    navigate('/filter');
  };

  return (
    <div className="fixed inset-x-0 top-16 z-50 flex justify-center px-4 pt-2 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
      {/* Mega Menu Container */}
      <div
        ref={menuRef}
        role="dialog"
        aria-label="Genre Mega Menu"
        className="pointer-events-auto w-full max-w-4xl bg-[#091124]/95 backdrop-blur-xl border border-[#1E2F56] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/10"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2A4E] bg-[#0E1830]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#648BFF]/20 to-[#B8A2FF]/20 border border-[#648BFF]/30 flex items-center justify-center text-[#648BFF]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide font-['Space_Grotesk']">
                  Anime Genre Directory
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#172545] text-[#8EA6D8] border border-[#20345F]">
                  28 Verified Categories
                </span>
              </div>
              <p className="text-[11px] text-[#7888A7]">
                Explore curated storylines, demographics, and themes from the AniList network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenFilterPage}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#142244] hover:bg-[#1E3060] text-xs font-semibold text-[#8EA6D8] hover:text-white border border-[#20345F] transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#648BFF]" />
              <span>Advanced Filter</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#7888A7] hover:text-white rounded-xl hover:bg-[#152342] transition-colors cursor-pointer"
              aria-label="Close genre menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Balanced Columns Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
          {BALANCED_GENRE_COLUMNS.map((column, colIdx) => (
            <div key={colIdx} className="space-y-1">
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#5A6D94] border-b border-[#15223E] mb-1">
                {colIdx === 0 && 'Core & Action'}
                {colIdx === 1 && 'Adventure & Lore'}
                {colIdx === 2 && 'Drama & Mystery'}
                {colIdx === 3 && 'Sci-Fi & Powers'}
              </div>
              {column.map((genre) => {
                const isActive = activeGenre?.toLowerCase() === genre.toLowerCase();
                return (
                  <button
                    key={genre}
                    onClick={() => handleGenreClick(genre)}
                    className={`w-full group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#1C2F5C] text-white font-semibold border border-[#648BFF]/40 shadow-xs'
                        : 'text-[#9CB0D4] hover:text-white hover:bg-[#121E38]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isActive
                            ? 'bg-[#648BFF]'
                            : 'bg-[#314670] group-hover:bg-[#648BFF]'
                        }`}
                      />
                      <span className="truncate">{genre}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-transparent group-hover:text-[#648BFF] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Mega Menu Footer */}
        <div className="px-6 py-3 border-t border-[#172545]/70 bg-[#070D1C]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#7888A7] flex-wrap justify-center sm:justify-start">
            <span className="text-[11px] font-semibold text-[#A9B5CE]">Top Picks:</span>
            {['Action', 'Romance', 'Fantasy', 'Isekai', 'Sci-Fi'].map((topGenre) => (
              <button
                key={topGenre}
                onClick={() => handleGenreClick(topGenre)}
                className="text-[11px] text-[#648BFF] hover:underline cursor-pointer"
              >
                {topGenre}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenFilterPage}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#648BFF] to-[#8975FF] hover:from-[#5277EC] hover:to-[#7663EC] px-3.5 py-1.5 rounded-xl shadow-md shadow-[#648BFF]/20 transition-all cursor-pointer"
          >
            <span>Multi-Filter Experience</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
