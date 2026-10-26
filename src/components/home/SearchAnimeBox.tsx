import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Image as ImageIcon,
  UploadCloud,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Play,
  Type,
} from 'lucide-react';
import { identifyAnimeFromImage, PRESET_SAMPLE_SCREENSHOTS } from '../../services/imageRecognition';
import { IdentificationResult } from '../../types/anime';
import { AnimeImage } from '../common/AnimeImage';

type SearchMode = 'text' | 'image' | 'upload';

export const SearchAnimeBox: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<SearchMode>('text');
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = textInput.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await identifyAnimeFromImage(file);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to identify anime from screenshot.');
    } finally {
      setLoading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="rounded-2xl bg-[#0F1932] border border-[#1E2E54] p-5 shadow-xl mb-6">
      {/* Box Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#648BFF]/20 text-[#648BFF] flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
              Search Anime
            </h2>
            <p className="text-xs text-[#7888A7]">
              Search by title or upload a screenshot to identify any scene.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/search')}
          className="text-[11px] font-semibold text-[#648BFF] hover:underline flex items-center gap-0.5"
        >
          <span>Full Engine</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Segmented Mode Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0A1224] rounded-xl border border-[#1B294B] mb-4">
        <button
          onClick={() => {
            setMode('text');
            setError(null);
            setResult(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            mode === 'text'
              ? 'bg-[#1E2F59] text-white shadow-sm border border-[#648BFF]/40'
              : 'text-[#7888A7] hover:text-[#A9B5CE]'
          }`}
        >
          <Type className="w-3.5 h-3.5 text-[#648BFF]" />
          <span>Title Search</span>
        </button>

        <button
          onClick={() => {
            setMode('image');
            setError(null);
            setResult(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            mode === 'image'
              ? 'bg-[#1E2F59] text-white shadow-sm border border-[#648BFF]/40'
              : 'text-[#7888A7] hover:text-[#A9B5CE]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-[#B8A2FF]" />
          <span>Image Search</span>
        </button>

        <button
          onClick={() => {
            setMode('upload');
            setError(null);
            setResult(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            mode === 'upload'
              ? 'bg-[#1E2F59] text-white shadow-sm border border-[#648BFF]/40'
              : 'text-[#7888A7] hover:text-[#A9B5CE]'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5 text-[#E6A8D7]" />
          <span>Upload</span>
        </button>
      </div>

      {/* Tab 1: Text Search */}
      {mode === 'text' && (
        <form onSubmit={handleTextSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Search anime title, character, or genre..."
              className="flex-1 h-10 px-3.5 rounded-xl bg-[#0A1224] border border-[#213560] focus:border-[#648BFF] text-xs text-white placeholder-[#7888A7] focus:outline-none focus:ring-1 focus:ring-[#648BFF]"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="px-4 h-10 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#648BFF]/20 transition-all shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#7888A7]">
            <span className="text-[10px] text-[#7888A7]">Popular:</span>
            {['Solo Leveling', 'Dandadan', 'Attack on Titan', 'One Piece'].map((title, i) => (
              <React.Fragment key={title}>
                {i > 0 && <span>·</span>}
                <button
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(title)}`)}
                  className="text-[10px] text-[#648BFF] hover:underline"
                >
                  {title}
                </button>
              </React.Fragment>
            ))}
          </div>
        </form>
      )}

      {/* Tab 2 & 3: Image / Upload Search */}
      {(mode === 'image' || mode === 'upload') && (
        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFileUpload(f);
            }}
            className="border-2 border-dashed border-[#233866] hover:border-[#648BFF] rounded-xl p-5 text-center cursor-pointer bg-[#0A1224]/60 hover:bg-[#0E1A33] transition-colors"
          >
            <UploadCloud className="w-7 h-7 mx-auto mb-2 text-[#648BFF]" />
            <div className="text-xs font-semibold text-white">
              Click to browse or drop an anime screenshot
            </div>
            <p className="text-[10px] text-[#7888A7] mt-1">
              Supports JPEG, PNG, WebP up to 25 MB · Real trace.moe Vision AI
            </p>
          </div>

          {/* Quick Clickable Sample Screenshots */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-[#7888A7]">
            <span className="text-[10px]">1-Click Samples:</span>
            {PRESET_SAMPLE_SCREENSHOTS.slice(0, 3).map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    const dummyFile = new File([''], `${sample.id}.jpg`, { type: 'image/jpeg' });
                    const res = await identifyAnimeFromImage(dummyFile, sample.id);
                    setResult(res);
                  } catch (err: any) {
                    setError(err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="text-[10px] text-[#648BFF] hover:text-white underline truncate max-w-[110px]"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-3 p-3 rounded-xl bg-[#101A30] border border-[#1E2E54] flex items-center justify-center gap-2 text-xs text-[#A9B5CE]">
          <span className="inline-block w-4 h-4 border-2 border-[#648BFF]/30 border-t-[#648BFF] rounded-full animate-spin" />
          <span>Analyzing anime scene...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="mt-3 p-3 rounded-xl bg-[#FF4572]/10 border border-[#FF4572]/30 flex items-start gap-2.5 text-xs text-[#FF708F]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Recognition Result Modal / Card */}
      {result && !loading && (
        <div className="mt-4 p-3.5 rounded-xl bg-[#142345] border border-[#648BFF]/40 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#233A6B]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Anime Scene Identified!</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] font-bold">
              {result.confidence}% Match
            </span>
          </div>

          <div className="flex gap-3">
            <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-[#2B4379]">
              <AnimeImage
                src={result.anime.coverImageUrl}
                alt={result.anime.title}
                fallbackTitle={result.anime.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                {result.anime.title}
              </h4>
              <div className="text-[11px] text-[#B8A2FF] mt-0.5">
                Episode {result.likelyEpisode} · Timestamp {result.timestamp}
              </div>
              <p className="text-[10px] text-[#7888A7] mt-1 line-clamp-2">
                {result.evidenceSummary}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/anime/${result.anime.slug || result.anime.id}`)}
                  className="px-2.5 py-1 rounded-lg bg-[#648BFF] text-white text-[11px] font-semibold hover:bg-[#5277EC] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Anime</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                {result.officialSources?.[0] && (
                  <a
                    href={result.officialSources[0].destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded-lg bg-[#18284C] hover:bg-[#1E325E] text-[#A9B5CE] hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Watch</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mascot Tip Box with Chibi Beru */}
      <div className="mt-4 pt-3 border-t border-[#192749] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#172445] border border-[#648BFF]/40 flex items-center justify-center shrink-0">
          <img
            src="/assets/reference/search_mascot_chibi.png"
            alt="Beru Mascot"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <p className="text-[11px] text-[#A9B5CE]">
          <strong className="text-white">AI Vision:</strong> Upload any anime screenshot and our visual search will identify the exact series and episode!
        </p>
      </div>
    </div>
  );
};
