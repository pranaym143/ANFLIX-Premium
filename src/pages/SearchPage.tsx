import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
  Filter,
  Sparkles,
  ArrowRight,
  Heart,
  Bookmark,
  X,
  Play,
  Music,
  Clock,
  Layers,
  Video,
  Copy,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { searchAnimeUnified, getStoredAnime, filterLocalAnime } from '../services/animeData';
import { identifyAnimeFromImage, PRESET_SAMPLE_SCREENSHOTS, PresetSampleImage } from '../services/imageRecognition';
import { Anime, IdentificationResult } from '../types/anime';
import { useLibrary } from '../context/LibraryContext';
import { AnimeImage } from '../components/common/AnimeImage';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorite, toggleFavorite, addSearchHistory } = useLibrary();

  // Determine active tab
  const getTabFromLocation = () => {
    if (location.pathname.includes('/image')) return 'image';
    return 'text';
  };

  const [activeTab, setActiveTab] = useState<'text' | 'image'>(getTabFromLocation());

  // Text Search State
  const [textQuery, setTextQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [textResults, setTextResults] = useState<Anime[]>(() => getStoredAnime());
  const [isSearchingText, setIsSearchingText] = useState(false);

  // Image Search State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [imageResult, setImageResult] = useState<IdentificationResult | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste feedback
  const [pastedFeedback, setPastedFeedback] = useState(false);

  // Sync tab with route
  useEffect(() => {
    setActiveTab(getTabFromLocation());
  }, [location.pathname]);

  // Reactive Text Search & Genre Filter
  useEffect(() => {
    let isCancelled = false;

    const runSearch = async () => {
      // Instant local search first
      const localFiltered = filterLocalAnime(getStoredAnime(), textQuery, selectedGenre);
      if (!isCancelled) {
        setTextResults(localFiltered);
      }

      // If user typed at least 2 characters, query AniList to enrich
      if (textQuery.trim().length >= 2) {
        setIsSearchingText(true);
        try {
          const unified = await searchAnimeUnified(textQuery, selectedGenre);
          if (!isCancelled) {
            setTextResults(unified);
          }
        } catch {
          // keep local
        } finally {
          if (!isCancelled) setIsSearchingText(false);
        }
      } else {
        setIsSearchingText(false);
      }
    };

    const timer = setTimeout(runSearch, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [textQuery, selectedGenre]);


  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textQuery.trim()) {
      addSearchHistory(textQuery.trim());
      // Re-trigger
      searchAnimeUnified(textQuery.trim(), selectedGenre).then((res) => setTextResults(res));
    }
  };

  const handleProcessImage = async (file: File, sampleId?: string) => {
    setIsScanningImage(true);
    setImageError(null);
    setImageResult(null);
    setImageFile(file);

    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);

    try {
      const res = await identifyAnimeFromImage(file, sampleId);
      setImageResult(res);
      addSearchHistory(res.anime.title);
    } catch (err: any) {
      setImageError(err.message || 'Image identification failed.');
    } finally {
      setIsScanningImage(false);
    }
  };

  const handlePresetSampleImage = async (sample: PresetSampleImage) => {
    setIsScanningImage(true);
    setImageError(null);
    setImageResult(null);
    setImagePreviewUrl(sample.thumbnailUrl);

    try {
      // Create a dummy File object
      const dummyFile = new File([''], `${sample.id}.jpg`, { type: 'image/jpeg' });
      const res = await identifyAnimeFromImage(dummyFile, sample.id);
      setImageResult(res);
      addSearchHistory(res.anime.title);
    } catch (err: any) {
      setImageError(err.message || 'Failed to analyze sample image.');
    } finally {
      setIsScanningImage(false);
    }
  };

  const genresList = [
    'All',
    'Action',
    'Fantasy',
    'Adventure',
    'Supernatural',
    'Comedy',
    'Sports',
    'Horror',
    'Drama',
    'Sci-Fi',
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="pb-4 border-b border-[#1B294B]">
        <div className="flex items-center gap-2 mb-1 text-xs text-[#648BFF] font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Discovery Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
          Search Anime &amp; Identify Scenes by Image
        </h1>
        <p className="text-xs sm:text-sm text-[#7888A7] mt-1">
          Instant reactive search by title or genre, or upload an anime screenshot to identify the exact episode and series.
        </p>
      </div>

      {/* Segmented Mode Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#0F1932] border border-[#1E2E54] rounded-2xl w-full sm:w-fit">
        <button
          onClick={() => {
            setActiveTab('text');
            navigate('/search');
          }}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'text'
              ? 'bg-[#648BFF] text-white shadow-md shadow-[#648BFF]/25'
              : 'text-[#A9B5CE] hover:text-white hover:bg-[#152342]'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Title &amp; Genre Search</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('image');
            navigate('/search/image');
          }}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'image'
              ? 'bg-[#E6A8D7] text-[#070D1C] shadow-md shadow-[#E6A8D7]/25'
              : 'text-[#A9B5CE] hover:text-white hover:bg-[#152342]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image / Screenshot</span>
        </button>

        <button
          onClick={() => navigate('/filter')}
          className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-[#A9B5CE] hover:text-white hover:bg-[#152342] transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#89A8FF]" />
          <span>Advanced Multi-Filter</span>
        </button>
      </div>

      {/* ========================================================
          MODE 1: TITLE & GENRE SEARCH
          ======================================================== */}
      {activeTab === 'text' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Reactive Input Field */}
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7888A7] absolute left-4 top-3.5" />
              <input
                type="text"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                placeholder="Type anime title or character (e.g. Solo Leveling, Dandadan, Eren, Gojo, Demon Slayer)..."
                className="w-full h-11 pl-11 pr-10 bg-[#101A30] border border-[#1E2E54] focus:border-[#648BFF] rounded-xl text-xs sm:text-sm text-white placeholder-[#7888A7] focus:outline-none focus:ring-1 focus:ring-[#648BFF] transition-all shadow-inner"
              />
              {textQuery && (
                <button
                  type="button"
                  onClick={() => setTextQuery('')}
                  className="absolute right-3 top-3 text-[#7888A7] hover:text-white"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 h-11 bg-[#648BFF] hover:bg-[#5277EC] text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Genre Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-[#7888A7] font-semibold flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Genre:
            </span>
            {genresList.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGenre === g
                    ? 'bg-[#648BFF] text-white shadow-sm border border-[#648BFF]'
                    : 'bg-[#101A30] text-[#A9B5CE] hover:text-white border border-[#1A284D]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-[#7888A7] pt-1">
            <div>
              Showing <strong className="text-white">{textResults.length}</strong> anime titles
              {selectedGenre !== 'All' && <span> in <strong className="text-[#648BFF]">{selectedGenre}</strong></span>}
              {textQuery && <span> matching &ldquo;<strong className="text-white">{textQuery}</strong>&rdquo;</span>}
            </div>

            {isSearchingText && (
              <div className="flex items-center gap-1.5 text-[#648BFF]">
                <span className="inline-block w-3 h-3 border-2 border-[#648BFF]/30 border-t-[#648BFF] rounded-full animate-spin" />
                <span>Syncing live AniList entries...</span>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {textResults.map((anime) => (
              <div
                key={anime.id}
                className="group rounded-2xl overflow-hidden bg-[#0F1932] border border-[#1E2E54] hover:border-[#648BFF]/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                <div
                  onClick={() => navigate(`/anime/${anime.slug || anime.id}`)}
                  className="cursor-pointer relative aspect-[3/4] overflow-hidden bg-[#162340]"
                >
                  <AnimeImage
                    src={anime.coverImageUrl}
                    alt={anime.title}
                    fallbackTitle={anime.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1932] via-transparent to-transparent opacity-80 pointer-events-none" />

                  {anime.rating && (
                    <div className="absolute top-2 right-2 bg-[#070D1C]/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-[#FFB800] border border-[#FFB800]/30">
                      ★ {anime.rating}%
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#648BFF]/20 text-[#648BFF] border border-[#648BFF]/30 font-bold uppercase">
                      {anime.status}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h3
                    onClick={() => navigate(`/anime/${anime.slug || anime.id}`)}
                    className="cursor-pointer text-xs sm:text-sm font-bold text-white group-hover:text-[#648BFF] truncate transition-colors"
                  >
                    {anime.title}
                  </h3>
                  <p className="text-[11px] text-[#7888A7] mt-0.5 truncate">
                    {anime.genres.slice(0, 2).join(' · ')} · {anime.releaseYear}
                  </p>

                  <div className="mt-3 pt-2 border-t border-[#192749] flex items-center justify-between">
                    <button
                      onClick={() => toggleFavorite(anime)}
                      className="p-1 text-[#7888A7] hover:text-[#FF708F] transition-colors"
                      title="Add to Favorites"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFavorite(anime.id) ? 'fill-[#FF708F] text-[#FF708F]' : ''
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => navigate(`/anime/${anime.slug || anime.id}`)}
                      className="text-[11px] font-semibold text-[#648BFF] hover:underline flex items-center gap-0.5"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {textResults.length === 0 && !isSearchingText && (
            <div className="p-12 text-center rounded-3xl bg-[#0F1932] border border-[#1E2E54] space-y-3">
              <Search className="w-8 h-8 mx-auto text-[#7888A7]" />
              <h3 className="text-sm font-bold text-white">No titles match your query</h3>
              <p className="text-xs text-[#7888A7] max-w-sm mx-auto">
                Try searching for a different anime title, character name, or reset the genre filter.
              </p>
              <button
                onClick={() => {
                  setTextQuery('');
                  setSelectedGenre('All');
                }}
                className="py-1.5 px-4 rounded-xl bg-[#162340] text-xs font-semibold text-white hover:bg-[#648BFF] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* ========================================================
          MODE 2: IMAGE / SCREENSHOT RECOGNITION
          ======================================================== */}
      {activeTab === 'image' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="max-w-3xl bg-[#0F1932] border border-[#1E2E54] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-[#E6A8D7] font-bold">
                <ImageIcon className="w-4 h-4" />
                <span>Anime Screenshot &amp; Scene Vision Matcher</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E6A8D7]/20 text-[#E6A8D7] font-mono">
                Visual Palette AI
              </span>
            </div>

            <p className="text-xs text-[#A9B5CE] leading-relaxed">
              Upload an anime scene still, video grab, or phone picture. The recognition engine extracts color temperature, character silhouettes, and visual scene contours to pinpoint the exact anime title and scene.
            </p>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleProcessImage(f);
              }}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {/* Interactive Drag & Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleProcessImage(f);
              }}
              className="relative overflow-hidden border-2 border-dashed border-[#2A3E6E] hover:border-[#E6A8D7] rounded-2xl p-6 sm:p-8 text-center cursor-pointer bg-[#0A1224] hover:bg-[#0E1B38] transition-all group"
            >
              {/* Radar Scanner Line Effect during scanning */}
              {isScanningImage && (
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-[#E6A8D7]/25 to-transparent h-12 w-full animate-bounce" />
              )}

              {imagePreviewUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={imagePreviewUrl}
                      alt="Uploaded Scene"
                      className="max-h-52 rounded-xl object-contain border border-[#2B4379] shadow-lg"
                    />
                    {isScanningImage && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-xs font-bold text-white">
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Scanning Scene Vectors...
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-[#E6A8D7] font-semibold underline mt-3 group-hover:text-white transition-colors">
                    Click to choose a different screenshot
                  </span>
                </div>
              ) : (
                <div>
                  <UploadCloud className="w-10 h-10 mx-auto text-[#E6A8D7] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-bold text-white">
                    Drop your anime screenshot here or click to browse
                  </div>
                  <p className="text-xs text-[#7888A7] mt-1">
                    Supports PNG, JPG, WebP up to 20 MB
                  </p>
                </div>
              )}
            </div>

            {/* Clickable Preset Sample Screenshots */}
            <div className="space-y-2 pt-2 border-t border-[#192749]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#7888A7]">
                Or test with sample anime screenshots (1-Click Instant Match):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {PRESET_SAMPLE_SCREENSHOTS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handlePresetSampleImage(sample)}
                    className="p-1.5 rounded-xl bg-[#0A1224] hover:bg-[#142345] border border-[#1E2E54] hover:border-[#E6A8D7]/60 text-left transition-all group"
                  >
                    <img
                      src={sample.thumbnailUrl}
                      alt={sample.title}
                      className="w-full aspect-[16/10] object-cover rounded-lg mb-1.5 border border-[#213560] group-hover:scale-105 transition-transform"
                    />
                    <div className="text-[11px] font-bold text-white group-hover:text-[#E6A8D7] truncate">
                      {sample.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Error Banner */}
          {imageError && (
            <div className="max-w-3xl p-4 rounded-2xl bg-[#FF4572]/15 border border-[#FF4572]/40 text-xs text-[#FF708F] flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Screenshot Recognition Notice</div>
                <div>{imageError}</div>
              </div>
            </div>
          )}

          {/* Image Match Result Card */}
          {imageResult && (
            <div className="max-w-3xl p-6 rounded-3xl bg-[#0E1830] border border-[#E6A8D7]/40 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1B294B]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span className="text-sm font-bold text-white font-['Space_Grotesk']">
                    Scene Matched Successfully
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] font-bold">
                    {imageResult.confidence}% Visual Match
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1B2B4E] text-[#A9B5CE]">
                    {imageResult.provider}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Visual Match Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-[#0A1224] border border-[#192749]">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#7888A7] mb-1.5">
                    Your Uploaded Screenshot
                  </div>
                  <img
                    src={imagePreviewUrl || imageResult.anime.coverImageUrl}
                    alt="Uploaded Scene"
                    className="w-full aspect-[16/10] object-cover rounded-xl border border-[#2B4379]"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] mb-1.5">
                    Verified Broadcast Match (Ep {imageResult.likelyEpisode})
                  </div>
                  <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#10B981]/40">
                    <AnimeImage
                      src={imageResult.anime.bannerImageUrl || imageResult.anime.coverImageUrl}
                      alt="Official Scene Match"
                      fallbackTitle={imageResult.anime.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Match Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {imageResult.anime.title}
                    </h3>
                    <div className="text-xs text-[#E6A8D7] font-semibold mt-0.5">
                      Episode {imageResult.likelyEpisode} · Timecode: {imageResult.timestamp}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#070D1C]/60 border border-[#162547] text-xs text-[#A9B5CE] leading-relaxed">
                  <strong className="text-white">Scene Evidence:</strong> {imageResult.evidenceSummary}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-[#7888A7]">Characters in Frame:</span>
                  {imageResult.recognizedCharacters.map((c, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1C2C54] text-white border border-[#2B4379]"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => navigate(`/anime/${imageResult.anime.slug || imageResult.anime.id}`)}
                    className="py-2 px-4 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] text-white text-xs font-bold transition-all shadow-md shadow-[#648BFF]/25 flex items-center gap-1.5"
                  >
                    <span>Open {imageResult.anime.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {imageResult.officialSources?.[0] && (
                    <a
                      href={imageResult.officialSources[0].destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-[#162340] hover:bg-[#1E3058] text-[#A9B5CE] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Stream on {imageResult.officialSources[0].providerName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
