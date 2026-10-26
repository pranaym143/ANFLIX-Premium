import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Filter,
  Search,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Star,
  Layers,
  Calendar,
  Tv,
  Activity,
  Headphones,
  BookOpen,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  Compass,
  AlertCircle,
  Clock,
  Check,
} from 'lucide-react';
import {
  advancedFilterAnime,
  AdvancedFilterParams,
  ALL_FILTER_GENRES,
} from '../services/anilistService';
import { Anime } from '../types/anime';
import { AnimeImage } from '../components/common/AnimeImage';

// Formats
const FORMAT_OPTIONS = [
  { label: 'All Types', value: '' },
  { label: 'TV Series', value: 'TV' },
  { label: 'TV Short', value: 'TV_SHORT' },
  { label: 'Movie', value: 'MOVIE' },
  { label: 'Special', value: 'SPECIAL' },
  { label: 'OVA', value: 'OVA' },
  { label: 'ONA (Web)', value: 'ONA' },
  { label: 'Music Video', value: 'MUSIC' },
];

// Statuses
const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Currently Airing', value: 'RELEASING' },
  { label: 'Finished Airing', value: 'FINISHED' },
  { label: 'Not Yet Aired', value: 'NOT_YET_RELEASED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

// Seasons
const SEASON_OPTIONS = [
  { label: 'All Seasons', value: '' },
  { label: 'Winter', value: 'WINTER' },
  { label: 'Spring', value: 'SPRING' },
  { label: 'Summer', value: 'SUMMER' },
  { label: 'Fall', value: 'FALL' },
];

// Years
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [
  { label: 'All Years', value: '' },
  ...Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => {
    const yr = CURRENT_YEAR + 1 - i;
    return { label: String(yr), value: String(yr) };
  }),
];

// Source materials
const SOURCE_OPTIONS = [
  { label: 'All Sources', value: '' },
  { label: 'Manga', value: 'MANGA' },
  { label: 'Light Novel', value: 'LIGHT_NOVEL' },
  { label: 'Original', value: 'ORIGINAL' },
  { label: 'Visual Novel', value: 'VISUAL_NOVEL' },
  { label: 'Video Game', value: 'VIDEO_GAME' },
  { label: 'Novel', value: 'NOVEL' },
  { label: 'Other', value: 'OTHER' },
];

// Audio / Language options
const LANGUAGE_OPTIONS = [
  { label: 'All Audio', value: '' },
  { label: 'Subtitled (Original Japanese)', value: 'sub' },
  { label: 'English Dubbed', value: 'dub' },
];

// Sort options (matching filter query keys)
const SORT_OPTIONS = [
  { label: 'Default (Most Popular)', value: 'default' },
  { label: 'Recently Updated', value: 'updated' },
  { label: 'Release Date', value: 'recent' },
  { label: 'Title A – Z', value: 'title' },
  { label: 'Highest Rated', value: 'score' },
  { label: 'Most Episodes', value: 'episodes' },
];

export const FilterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Local Form State initialized from URL query parameters
  const [keyword, setKeyword] = useState<string>(searchParams.get('keyword') || searchParams.get('q') || '');
  const [genre, setGenre] = useState<string>(searchParams.get('genre') || '');
  const [format, setFormat] = useState<string>(searchParams.get('type') || searchParams.get('format') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || '');
  const [season, setSeason] = useState<string>(searchParams.get('season') || '');
  const [year, setYear] = useState<string>(searchParams.get('year') || '');
  const [language, setLanguage] = useState<string>(searchParams.get('language') || '');
  const [source, setSource] = useState<string>(searchParams.get('source') || '');
  const [epMin, setEpMin] = useState<string>(searchParams.get('ep_min') || '');
  const [epMax, setEpMax] = useState<string>(searchParams.get('ep_max') || '');
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'default');
  const [page, setPage] = useState<number>(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });

  // Query Results State
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever URL searchParams change
  useEffect(() => {
    const kw = searchParams.get('keyword') || searchParams.get('q') || '';
    const gn = searchParams.get('genre') || '';
    const fmt = searchParams.get('type') || searchParams.get('format') || '';
    const st = searchParams.get('status') || '';
    const sn = searchParams.get('season') || '';
    const yr = searchParams.get('year') || '';
    const lg = searchParams.get('language') || '';
    const sc = searchParams.get('source') || '';
    const min = searchParams.get('ep_min') || '';
    const max = searchParams.get('ep_max') || '';
    const srt = searchParams.get('sort') || 'default';
    const pg = parseInt(searchParams.get('page') || '1', 10);

    setKeyword(kw);
    setGenre(gn);
    setFormat(fmt);
    setStatus(st);
    setSeason(sn);
    setYear(yr);
    setLanguage(lg);
    setSource(sc);
    setEpMin(min);
    setEpMax(max);
    setSort(srt);
    setPage(isNaN(pg) || pg < 1 ? 1 : pg);
  }, [searchParams]);

  // Execute query against AniList GraphQL
  const executeFilterQuery = useCallback(async () => {
    setLoading(true);
    setError(null);

    const kw = searchParams.get('keyword') || searchParams.get('q') || '';
    const gn = searchParams.get('genre') || '';
    const fmt = searchParams.get('type') || searchParams.get('format') || '';
    const st = searchParams.get('status') || '';
    const sn = searchParams.get('season') || '';
    const yr = searchParams.get('year') || '';
    const lg = searchParams.get('language') || '';
    const sc = searchParams.get('source') || '';
    const min = searchParams.get('ep_min') || '';
    const max = searchParams.get('ep_max') || '';
    const srt = searchParams.get('sort') || 'default';
    const pg = parseInt(searchParams.get('page') || '1', 10) || 1;

    try {
      const result = await advancedFilterAnime({
        keyword: kw,
        genre: gn,
        format: fmt,
        status: st,
        season: sn,
        year: yr,
        language: lg,
        source: sc,
        ep_min: min,
        ep_max: max,
        sort: srt,
        page: pg,
        perPage: 20,
      });

      setAnimeList(result.animeList);
      setTotalCount(result.pageInfo.total);
      setHasNextPage(result.pageInfo.hasNextPage);
      setLastPage(result.pageInfo.lastPage);
    } catch (err: any) {
      console.warn('Advanced filter query error:', err);
      setError(err?.message || 'Failed to load filtered anime. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    executeFilterQuery();
  }, [executeFilterQuery]);

  // Update URL params when Apply / Filter is clicked
  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newParams = new URLSearchParams();
    if (keyword.trim()) newParams.set('keyword', keyword.trim());
    if (genre) newParams.set('genre', genre);
    if (format) newParams.set('type', format);
    if (status) newParams.set('status', status);
    if (season) newParams.set('season', season);
    if (year) newParams.set('year', year);
    if (language) newParams.set('language', language);
    if (source) newParams.set('source', source);
    if (epMin) newParams.set('ep_min', epMin);
    if (epMax) newParams.set('ep_max', epMax);
    if (sort && sort !== 'default') newParams.set('sort', sort);
    newParams.set('page', '1');

    setSearchParams(newParams);
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setKeyword('');
    setGenre('');
    setFormat('');
    setStatus('');
    setSeason('');
    setYear('');
    setLanguage('');
    setSource('');
    setEpMin('');
    setEpMax('');
    setSort('default');
    setPage(1);

    setSearchParams(new URLSearchParams());
  };

  // Remove individual active filter pill
  const handleRemovePill = (filterKey: string) => {
    const updated = new URLSearchParams(searchParams);
    if (filterKey === 'keyword') {
      updated.delete('keyword');
      updated.delete('q');
      setKeyword('');
    } else if (filterKey === 'genre') {
      updated.delete('genre');
      setGenre('');
    } else if (filterKey === 'type') {
      updated.delete('type');
      updated.delete('format');
      setFormat('');
    } else if (filterKey === 'status') {
      updated.delete('status');
      setStatus('');
    } else if (filterKey === 'season') {
      updated.delete('season');
      setSeason('');
    } else if (filterKey === 'year') {
      updated.delete('year');
      setYear('');
    } else if (filterKey === 'language') {
      updated.delete('language');
      setLanguage('');
    } else if (filterKey === 'source') {
      updated.delete('source');
      setSource('');
    } else if (filterKey === 'episodes') {
      updated.delete('ep_min');
      updated.delete('ep_max');
      setEpMin('');
      setEpMax('');
    } else if (filterKey === 'sort') {
      updated.delete('sort');
      setSort('default');
    }
    updated.set('page', '1');
    setSearchParams(updated);
  };

  // Pagination change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    const updated = new URLSearchParams(searchParams);
    updated.set('page', String(newPage));
    setSearchParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Identify active filter badges
  const activePills: { key: string; label: string; value: string }[] = [];
  const activeKeyword = searchParams.get('keyword') || searchParams.get('q');
  if (activeKeyword) activePills.push({ key: 'keyword', label: 'Search', value: activeKeyword });
  if (searchParams.get('genre')) activePills.push({ key: 'genre', label: 'Genre', value: searchParams.get('genre')! });
  if (searchParams.get('type') || searchParams.get('format')) {
    const fmtVal = searchParams.get('type') || searchParams.get('format');
    const label = FORMAT_OPTIONS.find((f) => f.value === fmtVal)?.label || fmtVal!;
    activePills.push({ key: 'type', label: 'Type', value: label });
  }
  if (searchParams.get('status')) {
    const stVal = searchParams.get('status');
    const label = STATUS_OPTIONS.find((s) => s.value === stVal)?.label || stVal!;
    activePills.push({ key: 'status', label: 'Status', value: label });
  }
  if (searchParams.get('season')) {
    const snVal = searchParams.get('season');
    activePills.push({ key: 'season', label: 'Season', value: snVal! });
  }
  if (searchParams.get('year')) {
    activePills.push({ key: 'year', label: 'Year', value: searchParams.get('year')! });
  }
  if (searchParams.get('language')) {
    const lgVal = searchParams.get('language');
    const label = lgVal === 'sub' ? 'Subtitled' : lgVal === 'dub' ? 'English Dubbed' : lgVal!;
    activePills.push({ key: 'language', label: 'Audio', value: label });
  }
  if (searchParams.get('source')) {
    const scVal = searchParams.get('source');
    const label = SOURCE_OPTIONS.find((s) => s.value === scVal)?.label || scVal!;
    activePills.push({ key: 'source', label: 'Source', value: label });
  }
  const minVal = searchParams.get('ep_min');
  const maxVal = searchParams.get('ep_max');
  if (minVal || maxVal) {
    const epLabel = minVal && maxVal ? `${minVal} - ${maxVal} eps` : minVal ? `≥ ${minVal} eps` : `≤ ${maxVal} eps`;
    activePills.push({ key: 'episodes', label: 'Episodes', value: epLabel });
  }
  if (searchParams.get('sort') && searchParams.get('sort') !== 'default') {
    const srtVal = searchParams.get('sort');
    const label = SORT_OPTIONS.find((s) => s.value === srtVal)?.label || srtVal!;
    activePills.push({ key: 'sort', label: 'Sort', value: label });
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B294B] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#648BFF] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#648BFF] font-mono">
              PRECISION DISCOVERY ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] flex items-center gap-2.5">
            <SlidersHorizontal className="w-6 h-6 text-[#648BFF]" />
            <span>Advanced Anime Filter</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#7888A7] mt-1">
            Multi-criteria anime discovery powered by the real AniList network.
          </p>
        </div>

        {activePills.length > 0 && (
          <button
            onClick={handleResetFilters}
            className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#142038] hover:bg-[#1C2C4E] text-xs font-semibold text-[#8EA6D8] hover:text-white border border-[#20345F] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Filter Form Card */}
      <form
        onSubmit={handleApplyFilters}
        className="bg-[#0B1428] border border-[#1B2C52] rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/40 space-y-5"
      >
        {/* Row 1: Search Keyword & Genre Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-[#A9B5CE] uppercase tracking-wider">
              Keyword / Anime Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by English, Romaji, or Japanese title (e.g. Solo Leveling, Frieren)..."
                className="w-full h-11 pl-10 pr-10 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs sm:text-sm text-white placeholder-[#5A6D94] focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all"
              />
              <Search className="w-4 h-4 text-[#5A6D94] absolute left-3.5 top-3.5" />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="absolute right-3 top-3 p-0.5 text-[#5A6D94] hover:text-white rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A9B5CE] uppercase tracking-wider">
              Genre / Theme
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full h-11 px-3 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all cursor-pointer"
            >
              <option value="">All Genres (28 Categories)</option>
              {ALL_FILTER_GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Type, Status, Season, Year */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Format / Type */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#8EA6D8] uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-[#648BFF]" />
              <span>Format / Type</span>
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full h-10 px-3 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all cursor-pointer"
            >
              {FORMAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Airing Status */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#8EA6D8] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#FF708F]" />
              <span>Airing Status</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 px-3 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#8EA6D8] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B8A2FF]" />
              <span>Broadcast Season</span>
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full h-10 px-3 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all cursor-pointer"
            >
              {SEASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#8EA6D8] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FFD066]" />
              <span>Release Year</span>
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full h-10 px-3 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all cursor-pointer"
            >
              {YEAR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Language/Audio, Source, Episodes Range, Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Audio / Language */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#8EA6D8] uppercase tracking-wider flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[#648BFF]" />
              <span>Language / Audio</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-10 px-3 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all cursor-pointer"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source Material */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#8EA6D8] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#48E59B]" />
              <span>Source Material</span>
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-10 px-3 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all cursor-pointer"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Episode Range (Min & Max) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#8EA6D8] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF708F]" />
                <span>Episode Range</span>
              </span>
              <span className="text-[10px] text-[#5A6D94] lowercase">min – max</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="2000"
                placeholder="Min"
                value={epMin}
                onChange={(e) => setEpMin(e.target.value)}
                className="w-1/2 h-10 px-3 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs text-white placeholder-[#5A6D94] focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all text-center"
              />
              <span className="text-[#5A6D94] text-xs font-bold">–</span>
              <input
                type="number"
                min="0"
                max="2000"
                placeholder="Max"
                value={epMax}
                onChange={(e) => setEpMax(e.target.value)}
                className="w-1/2 h-10 px-3 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs text-white placeholder-[#5A6D94] focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all text-center"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#8EA6D8] uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#B8A2FF]" />
              <span>Sort Order</span>
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full h-10 px-3 bg-[#070D1C] border border-[#1F315B] focus:border-[#648BFF] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#648BFF]/20 transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-3 border-t border-[#162340] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#7888A7]">
            <Info className="w-4 h-4 text-[#648BFF] shrink-0" />
            <span>
              Real-time AniList filter parameters sync directly to the address URL.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#121E38] hover:bg-[#1A2C54] text-xs font-semibold text-[#8EA6D8] hover:text-white border border-[#1E3060] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#648BFF] to-[#8975FF] hover:from-[#5277EC] hover:to-[#7663EC] text-xs font-bold text-white shadow-lg shadow-[#648BFF]/25 border border-white/20 transition-all cursor-pointer active:scale-98"
            >
              <Filter className="w-4 h-4" />
              <span>Filter Anime</span>
            </button>
          </div>
        </div>
      </form>

      {/* Active Filter Pills Bar */}
      {activePills.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap bg-[#0A1224]/80 border border-[#18264A] p-3 rounded-2xl">
          <span className="text-xs font-semibold text-[#7888A7] flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-[#648BFF]" />
            <span>Active Filters:</span>
          </span>
          {activePills.map((pill) => (
            <span
              key={pill.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#13203C] text-white border border-[#233866] shadow-xs"
            >
              <span className="text-[#8EA6D8]">{pill.label}:</span>
              <span className="font-semibold">{pill.value}</span>
              <button
                type="button"
                onClick={() => handleRemovePill(pill.key)}
                className="p-0.5 text-[#7888A7] hover:text-white rounded-full hover:bg-[#20345E] cursor-pointer"
                aria-label={`Remove filter ${pill.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={handleResetFilters}
            className="text-xs text-[#FF708F] hover:underline font-semibold ml-auto cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Live Result Count Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-[#8EA6D8]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white font-['Space_Grotesk'] text-base">
            {loading ? 'Searching catalog...' : `${totalCount.toLocaleString()} Anime Found`}
          </span>
          {searchParams.get('genre') && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-[#648BFF]/15 text-[#648BFF] border border-[#648BFF]/30">
              in {searchParams.get('genre')}
            </span>
          )}
        </div>

        {totalCount > 0 && !loading && (
          <span className="text-xs text-[#5A6D94]">
            Page {page} of {Math.max(1, lastPage)}
          </span>
        )}
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-2xl bg-[#FF4572]/10 border border-[#FF4572]/30 p-8 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#FF4572]/20 text-[#FF708F] flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Connection Interrupted</h3>
          <p className="text-xs text-[#A9B5CE] max-w-md mx-auto">{error}</p>
          <button
            onClick={executeFilterQuery}
            className="px-4 py-2 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] text-xs font-bold text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Search</span>
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-[#0E172C] border border-[#1E2E54] flex flex-col animate-pulse"
            >
              <div className="w-full aspect-[3/4] bg-[#162340]" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-[#162340] rounded w-3/4" />
                <div className="h-3 bg-[#162340] rounded w-1/2" />
                <div className="h-3 bg-[#162340] rounded w-1/3 pt-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && animeList.length === 0 && (
        <div className="rounded-2xl bg-[#0B1428] border border-[#1B2C52] p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#13203C] text-[#648BFF] flex items-center justify-center border border-[#1E3060]">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              No Anime Matched Your Filters
            </h3>
            <p className="text-xs sm:text-sm text-[#7888A7] max-w-md mx-auto">
              We couldn’t find any anime matching this exact combination of genre, format, status, and episode range.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] text-xs font-bold text-white inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#648BFF]/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Anime Results Grid */}
      {!loading && !error && animeList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {animeList.map((anime) => {
            const genresText =
              anime.genres && anime.genres.length > 0
                ? anime.genres.slice(0, 2).join(' · ')
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

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E172C] via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-md ${
                        anime.status === 'RELEASING'
                          ? 'bg-[#FF4572]/20 text-[#FF708F] border-[#FF4572]/30'
                          : anime.status === 'NOT_YET_RELEASED'
                          ? 'bg-[#B8A2FF]/20 text-[#D4C7FF] border-[#B8A2FF]/30'
                          : 'bg-[#648BFF]/20 text-[#89A8FF] border-[#648BFF]/30'
                      }`}
                    >
                      {anime.status === 'RELEASING'
                        ? 'Airing'
                        : anime.status === 'NOT_YET_RELEASED'
                        ? 'Upcoming'
                        : 'Completed'}
                    </span>

                    {anime.rating && anime.rating > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/60 text-[#FFD066] border border-white/10 backdrop-blur-md flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {anime.rating}%
                      </span>
                    )}
                  </div>

                  {/* Episode Badge on bottom of poster */}
                  {anime.episodeCount && (
                    <div className="absolute bottom-2 right-2 pointer-events-none">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-black/70 text-white border border-white/10 backdrop-blur-md">
                        {anime.episodeCount} EP{anime.episodeCount > 1 ? 'S' : ''}
                      </span>
                    </div>
                  )}
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
                    <span className="font-mono">{anime.releaseYear || 'TBA'}</span>
                    <span className="text-[#648BFF] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && animeList.length > 0 && (
        <div className="pt-6 border-t border-[#1B294B] flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#0E172C] hover:bg-[#152342] disabled:opacity-40 disabled:hover:bg-[#0E172C] text-xs font-semibold text-white border border-[#1E2E54] transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1 px-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#648BFF] text-white text-xs font-bold shadow-md shadow-[#648BFF]/25">
              {page}
            </span>
            {hasNextPage && (
              <button
                onClick={() => handlePageChange(page + 1)}
                className="px-3.5 py-1.5 rounded-xl hover:bg-[#152342] text-xs font-semibold text-[#8EA6D8] hover:text-white transition-colors cursor-pointer"
              >
                {page + 1}
              </button>
            )}
            {hasNextPage && (
              <button
                onClick={() => handlePageChange(page + 2)}
                className="hidden sm:block px-3.5 py-1.5 rounded-xl hover:bg-[#152342] text-xs font-semibold text-[#8EA6D8] hover:text-white transition-colors cursor-pointer"
              >
                {page + 2}
              </button>
            )}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNextPage}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#0E172C] hover:bg-[#152342] disabled:opacity-40 disabled:hover:bg-[#0E172C] text-xs font-semibold text-white border border-[#1E2E54] transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
