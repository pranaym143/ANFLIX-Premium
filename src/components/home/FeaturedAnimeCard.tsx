import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, Info } from 'lucide-react';
import { getTrendingAnime } from '../../services/anilistService';
import { getStoredAnime } from '../../services/animeData';
import { Anime } from '../../types/anime';
import { AnimeImage } from '../common/AnimeImage';

export const FeaturedAnimeCard: React.FC = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Anime>(() => {
    const all = getStoredAnime();
    return all.find((a) => a.isFeatured) || all[0];
  });

  useEffect(() => {
    let isCancelled = false;

    async function loadFeatured() {
      try {
        const trending = await getTrendingAnime(3);
        if (trending && trending.length > 0 && !isCancelled) {
          // Select highest rated or trending top 1
          setFeatured(trending[0]);
        }
      } catch (err) {
        console.warn('Could not load trending anime for featured card:', err);
      }
    }

    loadFeatured();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl bg-[#0F1932] border border-[#1E2E54] p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-[#B8A2FF] fill-[#B8A2FF]" />
        <div>
          <h2 className="text-base font-bold text-white font-['Space_Grotesk'] leading-tight">
            Featured Anime
          </h2>
          <p className="text-xs text-[#7888A7]">Handpicked for you</p>
        </div>
      </div>

      {/* Wide Cinematic Card */}
      <div className="rounded-xl overflow-hidden border border-[#213560] bg-[#0A1224] relative group">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <AnimeImage
            src={featured.bannerImageUrl || featured.coverImageUrl || '/assets/reference/featured_poster.png'}
            alt={featured.title}
            fallbackTitle={featured.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1224] via-[#0A1224]/50 to-transparent pointer-events-none" />

          <div className="absolute bottom-3 left-3 right-3 z-10">
            <h3 className="text-lg font-bold text-white drop-shadow-md">
              {featured.title}
            </h3>
            {/* Genre tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {featured.genres.slice(0, 3).map((g, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1C2C54]/80 text-[#B8A2FF] border border-[#2D457F]/50 backdrop-blur-sm"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-[#A9B5CE] leading-relaxed line-clamp-2 mb-4">
            {featured.synopsis}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                const streamUrl =
                  featured.viewingSources?.[0]?.destinationUrl ||
                  `https://www.crunchyroll.com/search?q=${encodeURIComponent(featured.title)}`;
                window.open(streamUrl, '_blank');
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#648BFF] to-[#8975FF] hover:from-[#5277EC] hover:to-[#7663EE] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#648BFF]/25 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => navigate(`/anime/${featured.slug || featured.id}`)}
              className="py-2 px-4 rounded-xl border border-[#263C6D] hover:border-[#648BFF] text-[#A9B5CE] hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 bg-[#101C38] hover:bg-[#15254A] transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
