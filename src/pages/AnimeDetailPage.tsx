import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  Bookmark,
  Play,
  Download,
  Share2,
  ExternalLink,
  Search,
  ArrowLeft,
  AlertCircle,
  Check,
  Flame,
} from 'lucide-react';
import { getAnimeById } from '../services/anilistService';
import { getStoredAnime } from '../services/animeData';
import { Anime } from '../types/anime';
import { useLibrary } from '../context/LibraryContext';
import { WatchStatus } from '../types/user';
import { AnimeImage } from '../components/common/AnimeImage';

export const AnimeDetailPage: React.FC = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, getLibraryItem, updateLibraryStatus } = useLibrary();

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function loadAnime() {
      if (!animeId) {
        setAnime(null);
        setLoading(false);
        return;
      }

      // Always query AniList API first
      try {
        const remoteAnime = await getAnimeById(animeId);
        if (remoteAnime) {
          if (!isCancelled) {
            setAnime(remoteAnime);
            setLoading(false);
          }
          return;
        }
      } catch (err) {
        console.warn('Could not load anime from AniList:', err);
      }

      // Only check stored local list if AniList did not return a match
      if (!isCancelled) {
        const allLocal = getStoredAnime();
        const localMatch = allLocal.find(
          (a) => a.id === animeId || a.slug === animeId
        );
        setAnime(localMatch || null);
        setLoading(false);
      }
    }

    loadAnime();

    return () => {
      isCancelled = true;
    };
  }, [animeId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusOptions: { label: string; value: WatchStatus }[] = [
    { label: 'Watching', value: 'watching' },
    { label: 'Completed', value: 'completed' },
    { label: 'Plan to Watch', value: 'plan_to_watch' },
    { label: 'On Hold', value: 'on_hold' },
    { label: 'Dropped', value: 'dropped' },
  ];

  // Loading skeleton state
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-64 sm:h-80 md:h-96 rounded-3xl bg-[#0F1932] border border-[#1E2E54]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-36 rounded-3xl bg-[#0F1932]" />
            <div className="h-64 rounded-3xl bg-[#0F1932]" />
          </div>
          <div className="h-72 rounded-3xl bg-[#0F1932]" />
        </div>
      </div>
    );
  }

  // Not found state (NEVER fallback to Solo Leveling)
  if (!anime) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FF4572]/15 text-[#FF708F] flex items-center justify-center border border-[#FF4572]/30">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            Anime Not Found
          </h1>
          <p className="text-sm text-[#7888A7] mt-2 max-w-md mx-auto">
            We couldn&apos;t find an anime with the ID or slug &ldquo;{animeId}&rdquo;. It may have been removed or the link might be misspelled.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-[#101A30] hover:bg-[#162547] border border-[#223663] text-xs font-semibold text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </button>
          <button
            onClick={() => navigate('/search')}
            className="px-5 py-2.5 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-[#648BFF]/20 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search All Anime</span>
          </button>
          <button
            onClick={() => navigate('/trending')}
            className="px-5 py-2.5 rounded-xl bg-[#101A30] hover:bg-[#162547] border border-[#223663] text-xs font-semibold text-[#FFB800] flex items-center gap-2 transition-colors"
          >
            <Flame className="w-4 h-4" />
            <span>Browse Trending</span>
          </button>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(anime.id);
  const libraryItem = getLibraryItem(anime.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#223663] bg-[#0A1224] shadow-2xl">
        {/* Banner Backdrop */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <AnimeImage
            src={anime.bannerImageUrl || anime.coverImageUrl}
            alt={anime.title}
            fallbackTitle={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D1C] via-[#070D1C]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D1C] via-[#070D1C]/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 px-6 sm:px-10 pb-8 -mt-28 sm:-mt-36 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          {/* Cover Poster */}
          <div className="w-36 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 border-2 border-[#2F4478] shadow-2xl bg-[#111D35] relative group">
            <AnimeImage
              src={anime.coverImageUrl}
              alt={anime.title}
              fallbackTitle={anime.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {anime.rating && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-[#070D1C]/90 text-xs font-bold text-[#FFB800] border border-[#FFB800]/40">
                ★ {anime.rating}%
              </div>
            )}
          </div>

          {/* Metadata & Actions */}
          <div className="flex-1 min-w-0 flex flex-col justify-end pt-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#648BFF]/20 text-[#648BFF] border border-[#648BFF]/40 uppercase tracking-wider">
                {anime.status}
              </span>
              <span className="text-xs text-[#A9B5CE]">
                {anime.releaseYear} · {anime.releaseSeason || 'FALL'}
              </span>
              <span className="text-xs text-[#7888A7]">·</span>
              <span className="text-xs text-[#A9B5CE]">
                {anime.episodeCount} Episodes
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
              {anime.title}
            </h1>

            {anime.romajiTitle && (
              <div className="text-xs sm:text-sm text-[#7888A7] font-medium mt-1">
                {anime.romajiTitle} {anime.nativeTitle && `(${anime.nativeTitle})`}
              </div>
            )}

            {/* Genres */}
            <div className="flex flex-wrap items-center gap-1.5 my-3">
              {anime.genres.map((g, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#162340] text-[#B8A2FF] border border-[#233560]"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Interactive Actions Row */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {anime.viewingSources?.[0] ? (
                <a
                  href={anime.viewingSources[0].destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#648BFF] to-[#8975FF] hover:from-[#5277EC] hover:to-[#7663EE] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#648BFF]/25 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Stream on {anime.viewingSources[0].providerName}</span>
                </a>
              ) : (
                <button
                  onClick={() => navigate('/download')}
                  className="py-2.5 px-5 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] text-white text-xs font-bold flex items-center gap-2 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Media</span>
                </button>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(anime)}
                className={`py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  favorite
                    ? 'bg-[#FF4572]/20 border-[#FF4572] text-[#FF708F]'
                    : 'bg-[#101A30] border-[#223663] text-[#A9B5CE] hover:text-white hover:bg-[#162547]'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-[#FF708F]' : ''}`} />
                <span>{favorite ? 'Favorited' : 'Add to Favorites'}</span>
              </button>

              {/* Add to Library Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    libraryItem
                      ? 'bg-[#648BFF]/20 border-[#648BFF] text-white'
                      : 'bg-[#101A30] border-[#223663] text-[#A9B5CE] hover:text-white hover:bg-[#162547]'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-[#648BFF]" />
                  <span>
                    {libraryItem
                      ? `Library: ${libraryItem.status.replace(/_/g, ' ')}`
                      : 'Add to Library'}
                  </span>
                </button>

                {showStatusDropdown && (
                  <div className="absolute left-0 top-12 w-48 bg-[#0F1932] border border-[#253B6E] rounded-xl shadow-2xl p-1.5 z-30 animate-in fade-in">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          updateLibraryStatus(anime, opt.value);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                          libraryItem?.status === opt.value
                            ? 'bg-[#648BFF]/20 text-[#648BFF]'
                            : 'text-[#A9B5CE] hover:text-white hover:bg-[#152342]'
                        }`}
                      >
                        <span className="capitalize">{opt.label}</span>
                        {libraryItem?.status === opt.value && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-[#101A30] border border-[#223663] text-[#A9B5CE] hover:text-white hover:bg-[#162547] transition-colors"
                title="Share Anime Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {copied && (
                <span className="text-xs text-[#10B981] font-semibold animate-in fade-in">
                  Link copied!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Synopsis, Episodes, Characters */}
        <div className="lg:col-span-2 space-y-8">
          {/* Synopsis Section */}
          <section className="bg-[#0F1932] border border-[#1E2E54] rounded-3xl p-6">
            <h2 className="text-base font-bold text-white font-['Space_Grotesk'] mb-3">
              Synopsis
            </h2>
            <p className="text-xs sm:text-sm text-[#A9B5CE] leading-relaxed whitespace-pre-line">
              {anime.synopsis}
            </p>
          </section>

          {/* Episodes Listing */}
          <section className="bg-[#0F1932] border border-[#1E2E54] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Episodes ({anime.episodes?.length || 0})
              </h2>
            </div>

            {anime.episodes && anime.episodes.length > 0 ? (
              <div className="space-y-3">
                {anime.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#0A1224] border border-[#1A2A4E] hover:border-[#648BFF]/40 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-20 h-14 rounded-xl overflow-hidden border border-[#253965] shrink-0">
                        <AnimeImage
                          src={ep.thumbnailUrl}
                          alt={ep.title}
                          fallbackTitle={ep.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Episode {ep.episodeNumber}: {ep.title}
                        </div>
                        <p className="text-[11px] text-[#7888A7] mt-0.5 line-clamp-1 max-w-md">
                          {ep.synopsis || 'Official broadcast release.'}
                        </p>
                        <div className="text-[10px] text-[#A9B5CE] mt-1">
                          {Math.floor(ep.runtimeSeconds / 60)} min · {ep.releaseDate}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/episode/${ep.id}`)}
                      className="py-1.5 px-3 rounded-xl bg-[#162445] hover:bg-[#648BFF] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 self-end sm:self-center"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Details</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7888A7] text-center py-6">
                No episodes cataloged yet for this release.
              </p>
            )}
          </section>

          {/* Characters Roster */}
          <section className="bg-[#0F1932] border border-[#1E2E54] rounded-3xl p-6">
            <h2 className="text-base font-bold text-white font-['Space_Grotesk'] mb-4">
              Featured Characters ({anime.characters?.length || 0})
            </h2>

            {anime.characters && anime.characters.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {anime.characters.map((char) => (
                  <div
                    key={char.id}
                    className="p-3 rounded-2xl bg-[#0A1224] border border-[#1A2A4E] flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-[#648BFF]/30 shrink-0">
                      <AnimeImage
                        src={char.imageUrl}
                        alt={char.name}
                        fallbackTitle={char.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{char.name}</div>
                      <div className="text-[10px] text-[#648BFF] font-semibold">{char.role}</div>
                      {char.description && (
                        <div className="text-[9.5px] text-[#7888A7] truncate mt-0.5">
                          {char.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7888A7] text-center py-6">
                Character registry is currently being curated.
              </p>
            )}
          </section>
        </div>

        {/* Right Sidebar: Authorized Streams & Details */}
        <div className="space-y-6">
          {/* Authorized Viewing Sources */}
          <div className="bg-[#0F1932] border border-[#1E2E54] rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Official Viewing Sources
            </h3>
            <p className="text-[11px] text-[#7888A7] mb-3 leading-normal">
              Support original creators and animation studios by streaming on authorized platforms.
            </p>

            <div className="space-y-2">
              {anime.viewingSources && anime.viewingSources.length > 0 ? (
                anime.viewingSources.map((source) => (
                  <a
                    key={source.id}
                    href={source.destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0A1224] hover:bg-[#162547] border border-[#1C2C52] transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#648BFF] transition-colors">
                        {source.providerName}
                      </div>
                      <div className="text-[10px] text-[#7888A7]">
                        {source.region || 'Global'} · {source.availabilityStatus}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#7888A7] group-hover:text-white" />
                  </a>
                ))
              ) : (
                <div className="p-3 text-xs text-[#7888A7] bg-[#0A1224] rounded-xl text-center">
                  Official streaming links pending region verification.
                </div>
              )}
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-[#0F1932] border border-[#1E2E54] rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Anime Metadata
            </h3>

            <div className="flex justify-between text-xs py-1.5 border-b border-[#1A294C]">
              <span className="text-[#7888A7]">Release Season</span>
              <span className="text-white font-medium">
                {anime.releaseSeason} {anime.releaseYear}
              </span>
            </div>
            <div className="flex justify-between text-xs py-1.5 border-b border-[#1A294C]">
              <span className="text-[#7888A7]">Current Status</span>
              <span className="text-[#648BFF] font-semibold">{anime.status}</span>
            </div>
            <div className="flex justify-between text-xs py-1.5 border-b border-[#1A294C]">
              <span className="text-[#7888A7]">Total Episodes</span>
              <span className="text-white font-medium">{anime.episodeCount}</span>
            </div>
            <div className="flex justify-between text-xs py-1.5 border-b border-[#1A294C]">
              <span className="text-[#7888A7]">Source Data</span>
              <span className="text-white font-medium">{anime.metadataSource || 'Verified Studio Archive'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
