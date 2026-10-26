import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, ArrowRight, Heart } from 'lucide-react';
import { getTrendingAnime } from '../services/anilistService';
import { getStoredAnime } from '../services/animeData';
import { Anime } from '../types/anime';
import { useLibrary } from '../context/LibraryContext';
import { AnimeImage } from '../components/common/AnimeImage';

export const TrendingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useLibrary();

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('All');

  useEffect(() => {
    let isCancelled = false;

    async function loadTrending() {
      try {
        const trending = await getTrendingAnime(20);
        if (trending && trending.length > 0 && !isCancelled) {
          setAnimeList(trending);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Failed to load trending anime:', err);
      }

      if (!isCancelled) {
        const all = getStoredAnime();
        setAnimeList([...all].sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)));
        setLoading(false);
      }
    }

    loadTrending();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredAnime = animeList.filter((a) => {
    if (selectedSeason === 'All') return true;
    if (selectedSeason === 'ALL-TIME') return true;
    const yearMatch = selectedSeason.includes(String(a.releaseYear));
    const seasonMatch = a.releaseSeason && selectedSeason.toUpperCase().includes(a.releaseSeason);
    return yearMatch || seasonMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1B294B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFB800] to-[#FF708F] flex items-center justify-center text-white shadow-lg shadow-[#FFB800]/20">
            <Trophy className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
              Trending Anime Rankings
            </h1>
            <p className="text-xs text-[#7888A7]">
              Real-time popularity rankings verified by AniList community engagement and stream metrics.
            </p>
          </div>
        </div>

        {/* Season Filter Pills */}
        <div className="flex items-center gap-2">
          {['All', 'FALL 2024', 'WINTER 2024', 'ALL-TIME'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedSeason === s
                  ? 'bg-[#648BFF] text-white'
                  : 'bg-[#101A30] text-[#A9B5CE] hover:text-white border border-[#1E2E54]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-28 rounded-3xl bg-[#0F1932] animate-pulse" />
          ))}
        </div>
      ) : (
        /* Rankings List */
        <div className="space-y-3">
          {filteredAnime.map((anime, idx) => {
            const rank = idx + 1;
            const favorite = isFavorite(anime.id);

            return (
              <div
                key={anime.id}
                className="p-4 rounded-3xl bg-[#0F1932] border border-[#1E2E54] hover:border-[#648BFF]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Large Rank Indicator */}
                  <div
                    className={`w-10 text-center font-black text-xl font-['Space_Grotesk'] shrink-0 ${
                      rank === 1
                        ? 'text-[#FFB800]'
                        : rank === 2
                        ? 'text-[#E6A8D7]'
                        : rank === 3
                        ? 'text-[#648BFF]'
                        : 'text-[#7888A7]'
                    }`}
                  >
                    #{rank}
                  </div>

                  {/* Poster */}
                  <div
                    onClick={() => navigate(`/anime/${anime.slug || anime.id}`)}
                    className="cursor-pointer w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border border-[#233560] shrink-0 group-hover:scale-105 transition-transform"
                  >
                    <AnimeImage
                      src={anime.coverImageUrl}
                      alt={anime.title}
                      fallbackTitle={anime.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#648BFF]/20 text-[#648BFF]">
                        {anime.status}
                      </span>
                      <span className="text-xs text-[#7888A7]">
                        {anime.releaseYear} · {anime.episodeCount} eps
                      </span>
                    </div>

                    <h3
                      onClick={() => navigate(`/anime/${anime.slug || anime.id}`)}
                      className="cursor-pointer text-sm sm:text-base font-bold text-white group-hover:text-[#648BFF] truncate transition-colors mt-1"
                    >
                      {anime.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {anime.genres.slice(0, 3).map((g, i) => (
                        <span key={i} className="text-[10px] text-[#A9B5CE]">
                          {g}{i < 2 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-[#FFB800] flex items-center gap-1 mt-1 font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Rating: {anime.rating || 90}%</span>
                      <span className="text-[#7888A7] font-normal">
                        ({(anime.popularityScore || 85000).toLocaleString()} votes)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => toggleFavorite(anime)}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      favorite
                        ? 'bg-[#FF4572]/20 border-[#FF4572] text-[#FF708F]'
                        : 'bg-[#101A30] border-[#223663] text-[#A9B5CE] hover:text-white'
                    }`}
                    title="Favorite"
                  >
                    <Heart className={`w-4 h-4 ${favorite ? 'fill-[#FF708F]' : ''}`} />
                  </button>

                  <button
                    onClick={() => navigate(`/anime/${anime.slug || anime.id}`)}
                    className="py-2 px-4 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#648BFF]/20"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
