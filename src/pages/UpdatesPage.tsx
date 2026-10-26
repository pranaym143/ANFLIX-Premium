import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Calendar, User, ArrowRight, Filter, Search, Play } from 'lucide-react';
import { getAiringSchedule, AiringItem } from '../services/anilistService';
import { getStoredUpdates } from '../services/animeData';
import { AnimeUpdate } from '../types/anime';
import { AnimeImage } from '../components/common/AnimeImage';

export const UpdatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [allUpdates, setAllUpdates] = useState<AnimeUpdate[]>(() => getStoredUpdates());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeModalUpdate, setActiveModalUpdate] = useState<AnimeUpdate | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadRealUpdates() {
      try {
        const schedule = await getAiringSchedule(15);
        if (schedule && schedule.length > 0 && !isCancelled) {
          const liveUpdates: AnimeUpdate[] = schedule.map((item: AiringItem) => ({
            id: `airing-${item.id}`,
            title: `${item.anime.title} Episode ${item.episode} Broadcast`,
            slug: item.anime.slug || `anime-${item.anime.id}`,
            summary: `Episode ${item.episode} is now scheduled and broadcasting worldwide across authorized streaming services.`,
            body: item.anime.synopsis || 'Official broadcast release verified by AniList.',
            coverImageUrl: item.anime.coverImageUrl,
            animeId: item.anime.id,
            animeTitle: item.anime.title,
            category: 'Episode Release',
            publicationStatus: 'published',
            publishedAt: new Date(item.airingAt * 1000).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            authorName: 'AniList Airing Feed',
          }));

          const local = getStoredUpdates();
          setAllUpdates([...local, ...liveUpdates]);
        }
      } catch (err) {
        console.warn('Could not load live airing updates:', err);
      }
    }

    loadRealUpdates();

    return () => {
      isCancelled = true;
    };
  }, []);

  const categories = ['All', 'Episode Release', 'Anime Announcement', 'Movie Premiere'];

  const filteredUpdates = allUpdates.filter((u) => {
    const matchesCategory = selectedCategory === 'All' || u.category === selectedCategory;
    const matchesSearch =
      u.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.animeTitle?.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1B294B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF4572] to-[#FF708F] flex items-center justify-center text-white shadow-lg shadow-[#FF4572]/20">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
              Latest Anime Updates
            </h1>
            <p className="text-xs text-[#7888A7]">
              Verified releases, broadcasts, and editorial announcements from the anime industry.
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#7888A7] absolute left-3 top-3" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search updates..."
            className="w-full h-9 pl-9 pr-3 rounded-full bg-[#101A30] border border-[#1E2E54] focus:border-[#648BFF] text-xs text-white placeholder-[#7888A7] focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-[#7888A7] mr-1 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#648BFF] text-white shadow-md shadow-[#648BFF]/25'
                : 'bg-[#101A30] text-[#A9B5CE] hover:text-white border border-[#1E2E54]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Updates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUpdates.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl overflow-hidden bg-[#0F1932] border border-[#1E2E54] hover:border-[#648BFF]/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col group"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-[#162340]">
              <AnimeImage
                src={item.coverImageUrl}
                alt={item.title}
                fallbackTitle={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 z-10">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0F1932]/90 text-[#FF708F] border border-[#FF4572]/40 backdrop-blur-sm">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10.5px] text-[#7888A7] mb-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>{item.publishedAt}</span>
                  <span>·</span>
                  <User className="w-3 h-3" />
                  <span>{item.authorName}</span>
                </div>

                <h2 className="text-sm font-bold text-white group-hover:text-[#648BFF] transition-colors leading-snug">
                  {item.title}
                </h2>

                <p className="text-xs text-[#A9B5CE] mt-2 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#192749] flex items-center justify-between">
                {item.animeId ? (
                  <button
                    onClick={() => navigate(`/anime/${item.animeId}`)}
                    className="text-xs font-semibold text-[#648BFF] hover:underline flex items-center gap-1"
                  >
                    <span>View Anime</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveModalUpdate(item)}
                    className="text-xs font-semibold text-[#648BFF] hover:underline"
                  >
                    Read article &rarr;
                  </button>
                )}

                <button
                  onClick={() => setActiveModalUpdate(item)}
                  className="px-2.5 py-1 rounded-lg bg-[#142345] hover:bg-[#1E325E] text-[11px] font-semibold text-white transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Dialog for Article Reading */}
      {activeModalUpdate && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveModalUpdate(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0E172C] border border-[#233866] rounded-3xl p-6 shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#1E2E54]">
              <AnimeImage
                src={activeModalUpdate.coverImageUrl}
                alt={activeModalUpdate.title}
                fallbackTitle={activeModalUpdate.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF4572] text-white">
                  {activeModalUpdate.category}
                </span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[#7888A7] flex items-center gap-2 mb-1">
                <span>{activeModalUpdate.publishedAt}</span>
                <span>·</span>
                <span>By {activeModalUpdate.authorName}</span>
              </div>
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] leading-snug">
                {activeModalUpdate.title}
              </h3>
            </div>

            <p className="text-xs text-[#A9B5CE] leading-relaxed">
              {activeModalUpdate.body}
            </p>

            <div className="pt-3 border-t border-[#192749] flex items-center justify-between">
              {activeModalUpdate.animeId && (
                <button
                  onClick={() => {
                    navigate(`/anime/${activeModalUpdate.animeId}`);
                    setActiveModalUpdate(null);
                  }}
                  className="py-2 px-4 rounded-xl bg-[#648BFF] text-white text-xs font-bold hover:bg-[#5277EC] transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Go to Anime Page</span>
                </button>
              )}
              <button
                onClick={() => setActiveModalUpdate(null)}
                className="py-2 px-4 rounded-xl bg-[#142345] text-[#A9B5CE] hover:text-white text-xs font-semibold ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
