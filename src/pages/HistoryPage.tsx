import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, ArrowRight, Clock } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { AnimeImage } from '../components/common/AnimeImage';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, clearHistory } = useLibrary();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1B294B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#B8A2FF]/20 text-[#B8A2FF] flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
              Viewing &amp; Discovery History
            </h1>
            <p className="text-xs text-[#7888A7]">
              Recent anime titles you&apos;ve inspected and discovered.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="py-1.5 px-3 rounded-xl bg-[#162340] hover:bg-[#FF4572]/20 text-[#A9B5CE] hover:text-[#FF708F] text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0F1932] border border-[#1E2E54]">
          <History className="w-10 h-10 mx-auto text-[#7888A7] mb-2" />
          <h3 className="text-sm font-bold text-white">No viewing history</h3>
          <p className="text-xs text-[#7888A7] mt-1">Titles you explore will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/anime/${item.anime.slug || item.anime.id}`)}
              className="cursor-pointer group flex items-center justify-between p-3.5 rounded-2xl bg-[#0F1932] border border-[#1E2E54] hover:border-[#648BFF]/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-16 rounded-xl overflow-hidden border border-[#233560] shrink-0">
                  <AnimeImage
                    src={item.anime.coverImageUrl}
                    alt={item.anime.title}
                    fallbackTitle={item.anime.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#648BFF] transition-colors">
                    {item.anime.title}
                  </h4>
                  <div className="text-[11px] text-[#7888A7]">
                    {item.anime.genres.slice(0, 2).join(' · ')} {item.episodeNumber ? `· Episode ${item.episodeNumber}` : ''}
                  </div>
                  <div className="text-[10px] text-[#A9B5CE] flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Viewed on {new Date(item.viewedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs font-semibold text-[#648BFF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
