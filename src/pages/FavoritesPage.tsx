import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { AnimeImage } from '../components/common/AnimeImage';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useLibrary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1B294B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF4572]/20 text-[#FF708F] flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
              My Favorites ({favorites.length})
            </h1>
            <p className="text-xs text-[#7888A7]">
              Your handpicked anime collection.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/search')}
          className="py-2 px-4 rounded-xl bg-[#648BFF] text-white text-xs font-bold hover:bg-[#5277EC] transition-all shadow-md self-start sm:self-auto"
        >
          Explore More Anime
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-3xl bg-[#0F1932] border border-[#1E2E54] p-12 text-center space-y-3">
          <Heart className="w-10 h-10 mx-auto text-[#7888A7]" />
          <h3 className="text-sm font-bold text-white">No favorites added yet</h3>
          <p className="text-xs text-[#7888A7] max-w-sm mx-auto">
            Click the heart icon on any anime card or detail page to add it to your favorites.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="mt-2 py-2 px-4 rounded-xl bg-[#162340] hover:bg-[#1C2C54] text-xs font-semibold text-white transition-colors"
          >
            Discover Anime
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="group rounded-2xl overflow-hidden bg-[#0F1932] border border-[#1E2E54] hover:border-[#FF4572]/50 transition-all flex flex-col justify-between"
            >
              <div
                onClick={() => navigate(`/anime/${fav.anime.slug || fav.anime.id}`)}
                className="cursor-pointer relative aspect-[3/4] overflow-hidden bg-[#162340]"
              >
                <AnimeImage
                  src={fav.anime.coverImageUrl}
                  alt={fav.anime.title}
                  fallbackTitle={fav.anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(fav.anime);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-[#070D1C]/80 hover:bg-[#FF4572] text-[#FF708F] hover:text-white transition-colors shadow-md"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3">
                <h4
                  onClick={() => navigate(`/anime/${fav.anime.slug || fav.anime.id}`)}
                  className="cursor-pointer text-xs font-bold text-white group-hover:text-[#648BFF] truncate transition-colors"
                >
                  {fav.anime.title}
                </h4>
                <div className="text-[11px] text-[#7888A7] mt-0.5 truncate">
                  {fav.anime.genres.slice(0, 2).join(' · ')} · {fav.anime.releaseYear}
                </div>

                <div className="mt-3 pt-2 border-t border-[#192749] flex justify-end">
                  <button
                    onClick={() => navigate(`/anime/${fav.anime.slug || fav.anime.id}`)}
                    className="text-[11px] font-semibold text-[#648BFF] hover:underline flex items-center gap-0.5"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
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
