import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Image as ImageIcon,
  Flame,
  ChevronRight,
  Play,
  Sparkles,
  Compass,
} from 'lucide-react';
import { AnimeImage } from '../common/AnimeImage';

export const QuickToolsPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Quick Tools Box */}
      <div className="rounded-2xl bg-[#0F1932] border border-[#1E2E54] p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-4 h-4 text-[#648BFF]" />
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            Quick Tools
          </h2>
        </div>

        <div className="space-y-2">
          {/* Tool 1: Search by Image */}
          <button
            onClick={() => navigate('/search/image')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0A1224]/80 hover:bg-[#142345] border border-[#1C2C52] text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#B8A2FF]/15 text-[#B8A2FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#B8A2FF] transition-colors">
                  Search by Image
                </div>
                <div className="text-[10px] text-[#7888A7]">Upload screenshot & identify</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#7888A7] group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Tool 2: Trending Anime */}
          <button
            onClick={() => navigate('/trending')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0A1224]/80 hover:bg-[#142345] border border-[#1C2C52] text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF4572]/15 text-[#FF708F] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#FF708F] transition-colors">
                  Trending Anime
                </div>
                <div className="text-[10px] text-[#7888A7]">Top ranked charts & popular</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#7888A7] group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Tool 3: Latest Updates */}
          <button
            onClick={() => navigate('/updates')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0A1224]/80 hover:bg-[#142345] border border-[#1C2C52] text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#648BFF]/15 text-[#648BFF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#648BFF] transition-colors">
                  Daily Updates
                </div>
                <div className="text-[10px] text-[#7888A7]">New anime & announcements</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#7888A7] group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Tool 4: Discover Feed */}
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0A1224]/80 hover:bg-[#142345] border border-[#1C2C52] text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#10B981] transition-colors">
                  Explore Catalog
                </div>
                <div className="text-[10px] text-[#7888A7]">Filter by genre & year</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#7888A7] group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Atmospheric "Good Anime Good Vibes" Card */}
      <div
        onClick={() => navigate('/anime/solo-leveling')}
        className="cursor-pointer group relative rounded-2xl overflow-hidden border border-[#223663] bg-[#0E172C] aspect-[16/8] flex items-center justify-center shadow-xl"
      >
        <AnimeImage
          src="/assets/reference/good_anime_vibes_banner.png"
          alt="Anime Vibe"
          fallbackTitle="Good Anime Good Vibes"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1C] via-[#0E172C]/40 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
          <div className="text-sm font-black italic text-white tracking-wide font-serif">
            Good Anime Good Vibes
          </div>
        </div>
      </div>
    </div>
  );
};
