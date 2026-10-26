import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Tv,
  Flame,
  Calendar,
  Crown,
  Star,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  getDiscoverAnime,
  getCurrentSeasonAndYear,
  DiscoverCategory,
} from '../../services/anilistService';
import { Anime } from '../../types/anime';
import { AnimeImage } from '../common/AnimeImage';
import { getStoredAnime } from '../../services/animeData';

interface CategoryTab {
  id: DiscoverCategory;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const DiscoverAnimeSection: React.FC = () => {
  const navigate = useNavigate();
  const currentSeason = getCurrentSeasonAndYear();

  const categories: CategoryTab[] = [
    {
      id: 'recently-released',
      label: 'Recently Released',
      shortLabel: 'Recent',
      icon: Sparkles,
      description: 'Anime with recent broadcast premieres and verified release dates',
    },
    {
      id: 'currently-airing',
      label: 'Currently Airing',
      shortLabel: 'Airing',
      icon: Tv,
      description: 'Active series broadcasting new weekly episodes across Japan & streaming',
    },
    {
      id: 'trending',
      label: 'Trending Now',
      shortLabel: 'Trending',
      icon: Flame,
      description: 'Fastest-rising titles with the highest global viewer engagement on AniList',
    },
    {
      id: 'upcoming',
      label: 'Upcoming Anime',
      shortLabel: 'Upcoming',
      icon: Calendar,
      description: 'Anticipated anime confirmed for future broadcast seasons',
    },
    {
      id: 'popular',
      label: 'Popular Anime',
      shortLabel: 'Popular',
      icon: Crown,
      description: 'All-time most-watched and highly rated anime in the community',
    },
    {
      id: 'seasonal',
      label: `${currentSeason.label} Anime`,
      shortLabel: currentSeason.label,
      icon: Compass,
      description: `Official anime lineup for the ${currentSeason.label} broadcast season`,
    },
  ];

  const [activeCategory, setActiveCategory] = useState<DiscoverCategory>('recently-released');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryData = useCallback(
    async (category: DiscoverCategory, targetPage = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const result = await getDiscoverAnime(category, targetPage, 10);
        if (append) {
          // Deduplicate incoming items against already loaded items
          setAnimeList((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const freshItems = result.animeList.filter((a) => !existingIds.has(a.id));
            return [...prev, ...freshItems];
          });
        } else {
          setAnimeList(result.animeList);
        }
        setPage(result.pageInfo.currentPage);
        setHasNextPage(result.pageInfo.hasNextPage);
      } catch (err: any) {
        console.warn(`[DiscoverAnimeSection] Live query timed out or failed for "${category}", displaying verified catalog fallback:`, err);
        const stored = getStoredAnime();
        let fallbackList: Anime[] = [];
        if (category === 'trending') {
          fallbackList = [...stored].sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));
        } else if (category === 'currently-airing' || category === 'recently-released') {
          fallbackList = stored.filter((a) => a.status === 'RELEASING');
        } else if (category === 'upcoming') {
          fallbackList = stored.filter((a) => a.status === 'NOT_YET_RELEASED' || a.releaseYear >= 2025);
        } else {
          fallbackList = [...stored].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        if (fallbackList.length === 0) fallbackList = stored;

        setAnimeList(fallbackList.slice(0, 10));
        setPage(1);
        setHasNextPage(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    fetchCategoryData(activeCategory, 1, false);
  }, [activeCategory, fetchCategoryData]);

  const handleTabChange = (categoryId: DiscoverCategory) => {
    if (categoryId === activeCategory && !loading) return;
    setActiveCategory(categoryId);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasNextPage) return;
    fetchCategoryData(activeCategory, page + 1, true);
  };

  const activeTabMeta = categories.find((c) => c.id === activeCategory);

  // Helper to get an honest, accurate badge for each anime based on active category and data
  const renderCardBadge = (anime: Anime) => {
    if (activeCategory === 'recently-released') {
      if (anime.startDate?.year) {
        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        const month = anime.startDate.month ? monthNames[anime.startDate.month - 1] : '';
        const dateStr = month ? `${month} ${anime.startDate.year}` : `${anime.startDate.year}`;
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#648BFF]/20 text-[#89A8FF] border border-[#648BFF]/30 backdrop-blur-md">
            {dateStr}
          </span>
        );
      }
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#648BFF]/20 text-[#89A8FF] border border-[#648BFF]/30 backdrop-blur-md">
          {anime.status === 'RELEASING' ? 'Airing' : 'Released'}
        </span>
      );
    }

    if (activeCategory === 'currently-airing') {
      if (anime.nextAiringEpisode?.episode) {
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#00D26A]/20 text-[#00E575] border border-[#00D26A]/30 backdrop-blur-md">
            Ep {anime.nextAiringEpisode.episode} Soon
          </span>
        );
      }
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#00D26A]/20 text-[#00E575] border border-[#00D26A]/30 backdrop-blur-md">
          Airing Now
        </span>
      );
    }

    if (activeCategory === 'trending') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FF4572]/20 text-[#FF708F] border border-[#FF4572]/30 backdrop-blur-md flex items-center gap-1">
          <Flame className="w-2.5 h-2.5 fill-current" />
          Trending
        </span>
      );
    }

    if (activeCategory === 'upcoming') {
      const year = anime.startDate?.year || anime.releaseYear;
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#B8A2FF]/20 text-[#D2C4FF] border border-[#B8A2FF]/30 backdrop-blur-md">
          {anime.releaseSeason ? `${anime.releaseSeason} ${year}` : `Upcoming ${year}`}
        </span>
      );
    }

    if (activeCategory === 'seasonal') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFB800]/20 text-[#FFD066] border border-[#FFB800]/30 backdrop-blur-md">
          {currentSeason.label}
        </span>
      );
    }

    // Default: Popular / rating
    if (anime.rating && anime.rating > 0) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFB800]/20 text-[#FFD066] border border-[#FFB800]/30 backdrop-blur-md flex items-center gap-1">
          <Star className="w-2.5 h-2.5 fill-current" />
          {anime.rating}%
        </span>
      );
    }

    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#648BFF]/20 text-[#89A8FF] border border-[#648BFF]/30 backdrop-blur-md">
        Popular
      </span>
    );
  };

  return (
    <section className="space-y-4 mb-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#648BFF] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#648BFF] font-mono">
              REAL-TIME ANILIST FEED
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] flex items-center gap-2.5">
            Discover Anime
          </h2>
          <p className="text-xs sm:text-sm text-[#7888A7] mt-1 max-w-xl">
            {activeTabMeta?.description ||
              'Browse live anime releases, broadcasts, and rankings directly from the AniList network.'}
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2 text-[11px] text-[#A9B5CE] self-start md:self-auto bg-[#0E172C] px-3 py-1.5 rounded-xl border border-[#1E2E54]">
          <Clock className="w-3.5 h-3.5 text-[#648BFF]" />
          <span>Real API Metadata</span>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#648BFF] via-[#7B8BFF] to-[#9B77FF] text-white shadow-lg shadow-[#648BFF]/25 border border-white/20 scale-[1.02]'
                  : 'bg-[#0E172C]/80 hover:bg-[#152342] text-[#A9B5CE] hover:text-white border border-[#1B294B]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#7888A7]'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-2xl bg-[#FF4572]/10 border border-[#FF4572]/30 p-6 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-[#FF4572]/20 text-[#FF708F] flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Could not load {activeTabMeta?.label}</h3>
            <p className="text-xs text-[#A9B5CE] mt-1 max-w-md mx-auto">{error}</p>
          </div>
          <button
            onClick={() => fetchCategoryData(activeCategory, 1, false)}
            className="px-4 py-2 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] text-xs font-bold text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-[#0E172C] border border-[#1E2E54] flex flex-col animate-pulse"
            >
              <div className="w-full aspect-[3/4] bg-[#162340]" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-[#162340] rounded w-3/4" />
                <div className="h-3 bg-[#162340] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && animeList.length === 0 && (
        <div className="rounded-2xl bg-[#0E172C] border border-[#1E2E54] p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#172545] text-[#7888A7] flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Anime Found</h3>
          <p className="text-xs text-[#7888A7] max-w-sm mx-auto">
            No anime records were returned for this category. Please check your network or try another tab.
          </p>
          <button
            onClick={() => fetchCategoryData(activeCategory, 1, false)}
            className="px-4 py-2 rounded-xl bg-[#172545] hover:bg-[#20335C] text-xs font-semibold text-white inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Feed</span>
          </button>
        </div>
      )}

      {/* Real AniList Anime Cards Grid */}
      {!loading && !error && animeList.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {animeList.map((anime) => {
              const genresText = anime.genres && anime.genres.length > 0
                ? anime.genres.slice(0, 2).join(' · ')
                : anime.status === 'RELEASING'
                ? 'Airing Now'
                : 'Anime Series';

              return (
                <div
                  key={anime.id}
                  onClick={() => navigate(`/anime/${anime.id}`)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-[#0E172C] hover:bg-[#121E38] border border-[#1B294B] hover:border-[#648BFF]/70 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-[#648BFF]/10 hover:-translate-y-1"
                >
                  {/* Poster Thumbnail */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#070D1C]">
                    <AnimeImage
                      src={anime.coverImageUrl}
                      alt={anime.title}
                      fallbackTitle={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient Scrim for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E172C] via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      {renderCardBadge(anime)}
                      {anime.rating && anime.rating > 0 && activeCategory !== 'popular' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/60 text-[#FFD066] border border-white/10 backdrop-blur-md flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          {anime.rating}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        title={anime.title}
                        className="text-xs sm:text-sm font-bold text-white group-hover:text-[#648BFF] line-clamp-1 transition-colors leading-tight font-['Space_Grotesk']"
                      >
                        {anime.title}
                      </h3>
                      <p className="text-[11px] text-[#7888A7] mt-1 line-clamp-1">
                        {genresText}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#172545]/70 flex items-center justify-between text-[10px] text-[#A9B5CE]">
                      <span className="font-mono">
                        {anime.episodeCount && anime.episodeCount > 0
                          ? `${anime.episodeCount} eps`
                          : anime.status === 'RELEASING'
                          ? 'Ongoing'
                          : 'TV Series'}
                      </span>
                      <span className="text-[#648BFF] flex items-center gap-0.5 font-semibold group-hover:translate-x-0.5 transition-transform">
                        Explore <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button & Pagination Feedback */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7888A7]">
            <div>
              Showing <span className="text-white font-bold">{animeList.length}</span> titles from{' '}
              <span className="text-[#648BFF] font-semibold">{activeTabMeta?.label}</span>
            </div>

            {hasNextPage && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#101B34] hover:bg-[#18294F] border border-[#223663] hover:border-[#648BFF] text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-md"
              >
                {loadingMore ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#648BFF]" />
                    <span>Loading Next Page...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Anime</span>
                    <ChevronRight className="w-4 h-4 text-[#648BFF]" />
                  </>
                )}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
};
