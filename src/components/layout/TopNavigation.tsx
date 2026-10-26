import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Flame,
  Search,
  Bookmark,
  Sun,
  Moon,
  Bell,
  Menu,
  Check,
  Heart,
  History,
  Settings,
  ChevronRight,
  ChevronDown,
  Compass,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useTheme } from '../../context/ThemeContext';
import { getStoredAnime } from '../../services/animeData';
import { searchAnime } from '../../services/anilistService';
import { Anime } from '../../types/anime';
import { AnimeImage } from '../common/AnimeImage';
import { GenreMegaMenu } from './GenreMegaMenu';

interface TopNavigationProps {
  onOpenMobileMenu: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    addSearchHistory,
  } = useLibrary();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Anime[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showGenreMenu, setShowGenreMenu] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  // Debounced search suggestions
  useEffect(() => {
    let isCancelled = false;
    const cleanQuery = searchQuery.trim();

    if (!cleanQuery) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      // First show local instant results
      const all = getStoredAnime();
      const q = cleanQuery.toLowerCase();
      const matchedLocal = all.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.genres.some((g) => g.toLowerCase().includes(q)) ||
          a.alternativeTitles.some((t) => t.toLowerCase().includes(q))
      );

      if (!isCancelled) {
        setSuggestions(matchedLocal.slice(0, 5));
      }

      // If user typed at least 2 chars, fetch live from AniList
      if (cleanQuery.length >= 2) {
        try {
          const remote = await searchAnime(cleanQuery, undefined, 1, 5);
          if (!isCancelled && remote.length > 0) {
            setSuggestions(remote.slice(0, 5));
          }
        } catch {
          // ignore, keep local
        }
      }
    }, 180);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Click outside to dismiss menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setShowToolsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    addSearchHistory(searchQuery.trim());

    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setShowSuggestions(false);
  };

  return (
    <>
    <header
      className={`h-16 shrink-0 backdrop-blur-md border-b px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-40 transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-white/95 border-[#E2E8F0] text-[#0F172A] shadow-xs'
          : 'bg-[#0A1224]/90 border-[#1B294B] text-[#F4F5FF]'
      }`}
    >
      {/* Mobile Menu Button & Desktop Nav Links */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#A9B5CE] hover:text-white rounded-xl hover:bg-[#131F3A]"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Top Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#1C2C54] text-white shadow-sm border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <Home className="w-3.5 h-3.5 text-[#648BFF]" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/updates"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#1C2C54] text-white shadow-sm border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <Flame className="w-3.5 h-3.5 text-[#FF708F]" />
            <span>Updates</span>
          </NavLink>

          {/* Genre Mega Menu Trigger */}
          <button
            type="button"
            onClick={() => setShowGenreMenu((prev) => !prev)}
            aria-expanded={showGenreMenu}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              showGenreMenu
                ? 'bg-[#1C2C54] text-white shadow-sm border border-[#648BFF]/40'
                : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#648BFF]" />
            <span>Genre</span>
            <ChevronDown
              className={`w-3 h-3 text-[#7888A7] transition-transform duration-200 ${
                showGenreMenu ? 'rotate-180 text-[#648BFF]' : ''
              }`}
            />
          </button>

          {/* Advanced Filter Page Link */}
          <NavLink
            to="/filter"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#1C2C54] text-white shadow-sm border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#89A8FF]" />
            <span>Filter</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#1C2C54] text-white shadow-sm border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <Search className="w-3.5 h-3.5 text-[#B8A2FF]" />
            <span>Search</span>
          </NavLink>


          <NavLink
            to="/library"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#1C2C54] text-white shadow-sm border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <Bookmark className="w-3.5 h-3.5 text-[#648BFF]" />
            <span>Library</span>
          </NavLink>
        </nav>
      </div>

      {/* Global Search Bar */}
      <div ref={searchContainerRef} className="flex-1 max-w-lg relative">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search anime, characters, or genres..."
            className="w-full h-10 pl-4 pr-11 bg-[#101A30] border border-[#1E2E54] focus:border-[#648BFF] rounded-full text-xs sm:text-sm text-white placeholder-[#7888A7] focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 w-7 h-7 rounded-full bg-[#1A284D] hover:bg-[#648BFF] text-[#A9B5CE] hover:text-white flex items-center justify-center transition-all"
            aria-label="Submit search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Live Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-12 left-0 right-0 bg-[#0F1932] border border-[#213560] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase text-[#7888A7] tracking-wider">
              Matching Titles
            </div>
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/anime/${item.slug || item.id}`);
                  setShowSuggestions(false);
                }}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#18264A] text-left transition-colors group"
              >
                <div className="w-9 h-12 rounded-md overflow-hidden shrink-0 shadow-sm">
                  <AnimeImage
                    src={item.coverImageUrl}
                    alt={item.title}
                    fallbackTitle={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate group-hover:text-[#648BFF]">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#7888A7] truncate">
                    {item.genres.slice(0, 2).join(' · ')} · {item.releaseYear}
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7888A7] group-hover:text-white" />
              </button>
            ))}
            <div className="border-t border-[#1B2B4E] mt-1 pt-1">
              <button
                onClick={handleSearchSubmit}
                className="w-full py-1.5 text-center text-xs font-semibold text-[#648BFF] hover:underline"
              >
                View all results for &ldquo;{searchQuery}&rdquo; &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Theme Toggle, Notifications, Public Quick Menu */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm ${
            theme === 'dark'
              ? 'bg-[#101A30] hover:bg-[#172545] border border-[#1E2E54] text-[#B8A2FF] hover:text-white'
              : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#EAB308] hover:text-[#CA8A04]'
          }`}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-[#B8A2FF] transition-transform hover:rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-[#EAB308] transition-transform hover:rotate-45" />
          )}
        </button>

        {/* Public Notifications / Release Alerts */}
        <div ref={notifMenuRef} className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            title="Release Alerts & Updates"
            className="w-9 h-9 rounded-full bg-[#101A30] hover:bg-[#172545] border border-[#1E2E54] text-[#A9B5CE] hover:text-white flex items-center justify-center transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF4572] text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#0E172C] border border-[#213560] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1B2B4E]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
                    Release Alerts
                  </span>
                  {unreadNotificationCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#648BFF]/20 text-[#648BFF] font-semibold">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#648BFF] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.destinationPath) {
                        navigate(n.destinationPath);
                        setShowNotifMenu(false);
                      }
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                      n.read ? 'bg-[#111C33]/50 hover:bg-[#14223E]' : 'bg-[#18284C] hover:bg-[#1E325E] border-l-2 border-[#648BFF]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-white leading-tight">{n.title}</h4>
                      <span className="text-[9px] text-[#7888A7] shrink-0">
                        {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A9B5CE] mt-1 leading-normal">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1B2B4E] mt-2 pt-2 text-center">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setShowNotifMenu(false);
                  }}
                  className="text-xs text-[#648BFF] font-semibold hover:underline"
                >
                  View All Updates &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Public Quick Tools & Local Settings Button (Replacing login/profile) */}
        <div ref={toolsMenuRef} className="relative">
          <button
            onClick={() => setShowToolsMenu(!showToolsMenu)}
            title="Quick Tools & Preferences"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#101A30] hover:bg-[#172545] border border-[#1E2E54] text-xs font-semibold text-[#A9B5CE] hover:text-white transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#648BFF]" />
            <span className="hidden sm:inline">Preferences</span>
          </button>

          {showToolsMenu && (
            <div className="absolute right-0 top-12 w-60 bg-[#0E172C] border border-[#213560] rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold text-white uppercase tracking-wider border-b border-[#1B2B4E] mb-1">
                Local Discovery Tools
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    navigate('/library');
                    setShowToolsMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[#A9B5CE] hover:text-white hover:bg-[#152445] text-left transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#648BFF]" />
                  <span>Local Watchlist</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/favorites');
                    setShowToolsMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[#A9B5CE] hover:text-white hover:bg-[#152445] text-left transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-[#FF708F]" />
                  <span>Saved Favorites</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/history');
                    setShowToolsMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[#A9B5CE] hover:text-white hover:bg-[#152445] text-left transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-[#B8A2FF]" />
                  <span>Viewing History</span>
                </button>


                <div className="border-t border-[#1B2B4E] my-1" />

                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowToolsMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[#A9B5CE] hover:text-white hover:bg-[#152445] text-left transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#7888A7]" />
                  <span>Preferences &amp; Storage</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Genre Mega Menu Dropdown */}
    <GenreMegaMenu isOpen={showGenreMenu} onClose={() => setShowGenreMenu(false)} />
    </>
  );
};
