import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Flame } from 'lucide-react';
import { getPopularThisWeek } from '../../services/anilistService';
import { getStoredAnime } from '../../services/animeData';
import { Anime } from '../../types/anime';
import { AnimeImage } from '../common/AnimeImage';

export const PopularThisWeek: React.FC = () => {
  const navigate = useNavigate();
  const [popularList, setPopularList] = useState<Anime[]>([]);

  useEffect(() => {
    let isCancelled = false;

    async function loadPopular() {
      try {
        const remote = await getPopularThisWeek(5);
        if (remote && remote.length >= 3 && !isCancelled) {
          setPopularList(remote.slice(0, 5));
          return;
        }
      } catch (err) {
        console.warn('Failed to fetch popular from AniList, using reference set:', err);
      }

      if (!isCancelled) {
        const all = getStoredAnime();
        const topFive = [
          all.find((a) => a.id === 'solo-leveling') || all[0],
          all.find((a) => a.id === 'one-piece') || all[5] || all[1],
          all.find((a) => a.id === 'jujutsu-kaisen') || all[4] || all[2],
          all.find((a) => a.id === 'demon-slayer') || all[6] || all[3],
          all.find((a) => a.id === 'chainsaw-man') || all[3] || all[4],
        ].filter(Boolean);
        setPopularList(topFive);
      }
    }

    loadPopular();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl bg-[#0F1932] border border-[#1E2E54] p-5 shadow-xl mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FFB800]/15 text-[#FFB800] flex items-center justify-center">
            <Crown className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            Popular This Week
          </h2>
        </div>
      </div>

      {/* Numbered Rows List */}
      <div className="space-y-2.5">
        {popularList.map((anime, index) => {
          const rank = index + 1;
          return (
            <div
              key={anime.id}
              onClick={() => navigate(`/anime/${anime.slug || anime.id}`)}
              className="group cursor-pointer flex items-center gap-3 p-2 rounded-xl bg-[#0A1224]/70 hover:bg-[#142345] border border-transparent hover:border-[#283E70] transition-all"
            >
              {/* Rank Number */}
              <div
                className={`w-6 text-center font-black text-sm ${
                  rank === 1
                    ? 'text-[#FFB800]'
                    : rank === 2
                    ? 'text-[#E6A8D7]'
                    : rank === 3
                    ? 'text-[#648BFF]'
                    : 'text-[#7888A7]'
                }`}
              >
                {rank}
              </div>

              {/* Poster Thumbnail */}
              <div className="w-10 h-12 rounded-md overflow-hidden shrink-0 border border-[#1E2E54] group-hover:scale-105 transition-transform">
                <AnimeImage
                  src={anime.coverImageUrl}
                  alt={anime.title}
                  fallbackTitle={anime.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white group-hover:text-[#648BFF] truncate transition-colors">
                  {anime.title}
                </h4>
                <div className="text-[11px] text-[#7888A7] mt-0.5 truncate">
                  {anime.genres.slice(0, 2).join(' · ')} · {anime.releaseYear}
                </div>
              </div>

              {/* Flame Trend Indicator */}
              <div className="p-1.5 text-[#FF5A79]">
                <Flame className="w-4 h-4 fill-current" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
