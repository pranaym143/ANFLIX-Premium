import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { WatchStatus } from '../types/user';
import { AnimeImage } from '../components/common/AnimeImage';

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { library, updateLibraryStatus, removeFromLibrary } = useLibrary();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const statusTabs: { label: string; value: string }[] = [
    { label: 'All Titles', value: 'all' },
    { label: 'Watching', value: 'watching' },
    { label: 'Completed', value: 'completed' },
    { label: 'Plan to Watch', value: 'plan_to_watch' },
    { label: 'On Hold', value: 'on_hold' },
    { label: 'Dropped', value: 'dropped' },
  ];

  const filteredItems = library.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1B294B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#648BFF]/20 text-[#648BFF] flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
              My Personal Library
            </h1>
            <p className="text-xs text-[#7888A7]">
              Organize your anime watchlists, tracking progress and episode bookmarks.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/search')}
          className="py-2 px-4 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
        >
          Discover Anime to Add
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-[#7888A7] mr-1 shrink-0" />
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === tab.value
                ? 'bg-[#648BFF] text-white shadow-md shadow-[#648BFF]/20'
                : 'bg-[#0F1932] text-[#A9B5CE] hover:text-white border border-[#1E2E54]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Library Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl bg-[#0F1932] border border-[#1E2E54] p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 mx-auto text-[#7888A7]" />
          <h3 className="text-sm font-bold text-white">No anime in this section</h3>
          <p className="text-xs text-[#7888A7] max-w-sm mx-auto">
            Browse anime titles or search using image/link to bookmark shows to your watchlist.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="mt-2 py-2 px-4 rounded-xl bg-[#162340] hover:bg-[#1C2C54] text-xs font-semibold text-white transition-colors"
          >
            Explore Anime Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#0F1932] border border-[#1E2E54] hover:border-[#648BFF]/40 transition-all flex gap-3.5 group"
            >
              {/* Poster Thumbnail */}
              <div
                onClick={() => navigate(`/anime/${item.anime.slug || item.anime.id}`)}
                className="cursor-pointer w-20 h-28 rounded-xl overflow-hidden shrink-0 border border-[#213560] bg-[#162340]"
              >
                <AnimeImage
                  src={item.anime.coverImageUrl}
                  alt={item.anime.title}
                  fallbackTitle={item.anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Info & Status Controls */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4
                    onClick={() => navigate(`/anime/${item.anime.slug || item.anime.id}`)}
                    className="cursor-pointer text-xs sm:text-sm font-bold text-white group-hover:text-[#648BFF] truncate"
                  >
                    {item.anime.title}
                  </h4>
                  <div className="text-[11px] text-[#7888A7] mt-0.5">
                    {item.anime.genres.slice(0, 2).join(' · ')}
                  </div>
                </div>

                {/* Progress & Episode Counter */}
                <div className="space-y-1 mt-2">
                  <div className="flex items-center justify-between text-[11px] text-[#A9B5CE]">
                    <span>
                      Progress: Ep {item.progressEpisode} / {item.anime.episodeCount || '?'}
                    </span>
                    <button
                      onClick={() =>
                        updateLibraryStatus(item.anime, item.status, item.progressEpisode + 1)
                      }
                      className="p-1 rounded bg-[#152342] hover:bg-[#648BFF] hover:text-white text-[#648BFF] transition-colors"
                      title="Increment episode"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="h-1.5 w-full bg-[#152342] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#648BFF] rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((item.progressEpisode / (item.anime.episodeCount || 12)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Status & Remove Action */}
                <div className="mt-3 pt-2 border-t border-[#192749] flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#648BFF]">
                    {item.status.replace(/_/g, ' ')}
                  </span>
                  <button
                    onClick={() => removeFromLibrary(item.animeId)}
                    className="text-[#7888A7] hover:text-[#FF708F] p-1 transition-colors"
                    title="Remove from library"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
