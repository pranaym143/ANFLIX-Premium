import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Flame,
  Search,
  Bookmark,
  Heart,
  Image as ImageIcon,
  Sparkles,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Compass,
  X,
} from 'lucide-react';
import { ALL_FILTER_GENRES } from '../../services/anilistService';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const navigate = useNavigate();
  const [genresExpanded, setGenresExpanded] = useState(false);

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const handleSelectGenre = (genre: string) => {
    navigate(`/filter?genre=${encodeURIComponent(genre)}`);
    handleNavClick();
  };

  return (
    <aside
      className="sidebar-menu-section w-[248px] shrink-0 border-r border-[#1B294B] flex flex-col h-full select-none relative z-30 overflow-hidden bg-[#070D1C]"
    >
      {/* Background Cover Image: Moonlit Sakura Temple Overlook */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dqpsyh7yu/image/upload/v1792836775/Moonlit_Sakura_Temple_Overlook_yq9e86.png')`,
          }}
        />
        {/* Transparent scrim with zero blur to let the Moonlit Sakura Temple artwork show through with high clarity in BOTH dark and light mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070D1C]/60 via-[#070D1C]/40 to-[#070D1C]/65 pointer-events-none" />
      </div>

      {/* Brand Header */}
      <div className="relative z-10 h-16 flex items-center justify-between px-5 border-b border-[#172545]/40 bg-[#070D1C]/35">
        <NavLink
          to="/"
          onClick={handleNavClick}
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#648BFF] via-[#8975FF] to-[#E6A8D7] flex items-center justify-center shadow-lg shadow-[#648BFF]/25 font-black text-white text-lg tracking-tighter">
            <span className="transform -skew-x-6">A</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-wider text-white font-['Space_Grotesk']">
                AN<span className="text-[#648BFF]">.</span>FLIX
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#7888A7] font-medium">
              Watch · Discover · Explore
            </p>
          </div>
        </NavLink>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-[#7888A7] hover:text-white rounded-lg hover:bg-[#152342] cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Scrollable Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          <NavLink
            to="/"
            end
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#648BFF]/20 to-[#B8A2FF]/10 text-white border border-[#648BFF]/30 shadow-sm shadow-[#648BFF]/10'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-[#648BFF]" />
              <span className="text-white font-medium">Home</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/60" />
          </NavLink>

          <NavLink
            to="/updates"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#648BFF]/20 to-[#B8A2FF]/10 text-white border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Flame className="w-4 h-4 text-[#FF708F]" />
              <span className="text-white font-medium">Latest Updates</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FF4572]/20 text-[#FF708F] border border-[#FF4572]/30">
              NEW
            </span>
          </NavLink>

          {/* Advanced Filter NavLink */}
          <NavLink
            to="/filter"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#648BFF]/20 to-[#B8A2FF]/10 text-white border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-[#89A8FF]" />
              <span className="text-white font-medium">Anime Filter</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#648BFF]/20 text-[#648BFF] border border-[#648BFF]/30">
              FILTER
            </span>
          </NavLink>

          {/* Expandable Genre Accordion for Sidebar & Mobile */}
          <div>
            <button
              type="button"
              onClick={() => setGenresExpanded((prev) => !prev)}
              aria-expanded={genresExpanded}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                genresExpanded
                  ? 'bg-[#142347] text-white border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-[#648BFF]" />
                <span className="text-white font-medium">Browse Genres</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#7888A7] transition-transform duration-200 ${
                  genresExpanded ? 'rotate-180 text-[#648BFF]' : ''
                }`}
              />
            </button>

            {genresExpanded && (
              <div className="mt-1.5 p-2 rounded-xl bg-[#091124]/90 border border-[#1E2E54] grid grid-cols-2 gap-1 max-h-56 overflow-y-auto scrollbar-thin animate-in fade-in slide-in-from-top-1 duration-150">
                {ALL_FILTER_GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleSelectGenre(g)}
                    className="px-2 py-1.5 rounded-lg text-[11px] text-[#A9B5CE] hover:text-white hover:bg-[#162548] text-left truncate transition-colors cursor-pointer"
                  >
                    • {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/search"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#648BFF]/20 to-[#B8A2FF]/10 text-white border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-[#B8A2FF]" />
              <span className="text-white font-medium">Search Anime</span>
            </div>
          </NavLink>

          <NavLink
            to="/library"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#648BFF]/20 to-[#B8A2FF]/10 text-white border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4 text-[#648BFF]" />
              <span className="text-white font-medium">My Library</span>
            </div>
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#648BFF]/20 to-[#B8A2FF]/10 text-white border border-[#648BFF]/30'
                  : 'text-[#A9B5CE] hover:text-white hover:bg-[#131F3A]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-[#E6A8D7]" />
              <span className="text-white font-medium">Favorites</span>
            </div>
          </NavLink>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1B294B]/70 my-2" />

        {/* Quick Access */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-[#7888A7]">
            Quick Access
          </p>

          <button
            onClick={() => {
              navigate('/search/image');
              handleNavClick();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[#A9B5CE] hover:text-white hover:bg-[#131F3A] transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4 text-[#648BFF]" />
              <span className="text-white font-medium">Search by Image</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>
      </div>

      {/* Bottom Atmosphere & Quote Widget */}
      <div className="relative z-10 p-3.5 border-t border-[#172545]/40 bg-gradient-to-t from-[#070D1C]/70 to-transparent">
        <div className="relative rounded-2xl overflow-hidden p-3.5 border border-[#1E2D52]/60 bg-[#0E172C]/50 shadow-lg">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#B8A2FF] via-[#648BFF]/40 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#B8A2FF]">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-white">ANIME REALM</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1C2B4D]/70 text-[#A9B5CE] font-mono">
                v2.4
              </span>
            </div>

            <p className="text-[11px] text-[#A9B5CE] italic leading-relaxed font-serif">
              &ldquo;The real power comes from within. Discover infinite worlds.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
