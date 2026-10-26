import { Anime, AnimeStatus, Character, Episode, ViewingSource } from '../types/anime';

const ANILIST_API_URL = import.meta.env.VITE_ANILIST_API_URL || 'https://graphql.anilist.co';

// In-memory cache to respect AniList rate limits (90 req/min)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const MEMORY_CACHE = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getFromCache<T>(key: string): T | null {
  const cached = MEMORY_CACHE.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  // Try sessionStorage
  try {
    const sessionItem = sessionStorage.getItem(`anflix_cache_${key}`);
    if (sessionItem) {
      const parsed: CacheEntry<T> = JSON.parse(sessionItem);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        MEMORY_CACHE.set(key, parsed);
        return parsed.data;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function setToCache<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  MEMORY_CACHE.set(key, entry);
  try {
    sessionStorage.setItem(`anflix_cache_${key}`, JSON.stringify(entry));
  } catch {
    // sessionStorage might be full
  }
}

// Clean HTML tags and markdown entities from descriptions
export function sanitizeDescription(html?: string | null): string {
  if (!html) return 'No synopsis available.';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

// Helper to convert AniList raw media node to our standard Anime object
export function mapAniListMediaToAnime(m: any): Anime {
  if (!m) throw new Error('Invalid media item');

  const titleEnglish = m.title?.english;
  const titleRomaji = m.title?.romaji;
  const titleNative = m.title?.native;
  const primaryTitle = titleEnglish || titleRomaji || titleNative || 'Untitled Anime';

  const slug = (titleEnglish || titleRomaji || `anime-${m.id}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const coverUrl =
    m.coverImage?.extraLarge ||
    m.coverImage?.large ||
    m.coverImage?.medium ||
    '';

  const bannerUrl =
    m.bannerImage ||
    m.coverImage?.extraLarge ||
    coverUrl;

  // Characters
  const characters: Character[] = (m.characters?.edges || []).map((edge: any) => ({
    id: `char-${edge.node?.id || Math.random()}`,
    name: edge.node?.name?.full || edge.node?.name?.userPreferred || 'Character',
    nativeName: edge.node?.name?.native,
    role: (edge.role === 'MAIN' ? 'Main' : edge.role === 'SUPPORTING' ? 'Supporting' : 'Background') as any,
    imageUrl: edge.node?.image?.large || edge.node?.image?.medium || coverUrl,
    description: edge.node?.description ? sanitizeDescription(edge.node.description).slice(0, 150) : undefined,
  }));

  // Viewing sources - official search destinations
  const safeQuery = encodeURIComponent(primaryTitle);
  const viewingSources: ViewingSource[] = [
    {
      id: `vs-${m.id}-cr`,
      animeId: String(m.id),
      providerName: 'Crunchyroll',
      destinationUrl: `https://www.crunchyroll.com/search?q=${safeQuery}`,
      sourceType: 'official_stream',
      region: 'Global',
      availabilityStatus: 'Subscription',
    },
    {
      id: `vs-${m.id}-nfx`,
      animeId: String(m.id),
      providerName: 'Netflix',
      destinationUrl: `https://www.netflix.com/search?q=${safeQuery}`,
      sourceType: 'official_stream',
      region: 'Global',
      availabilityStatus: 'Subscription',
    },
  ];

  // Airing / episode status
  let status: AnimeStatus = 'FINISHED';
  if (m.status === 'RELEASING') status = 'RELEASING';
  else if (m.status === 'NOT_YET_RELEASED') status = 'NOT_YET_RELEASED';
  else if (m.status === 'CANCELLED') status = 'CANCELLED';

  const episodeCount = m.episodes || (m.nextAiringEpisode?.episode ? m.nextAiringEpisode.episode - 1 : 12);
  const currentEpisode = m.nextAiringEpisode?.episode
    ? m.nextAiringEpisode.episode - 1
    : status === 'RELEASING'
    ? Math.max(1, Math.floor(episodeCount / 2))
    : episodeCount;

  // Synthesize episodes list for episode browser
  const episodesList: Episode[] = [];
  const epCountToGenerate = Math.min(episodeCount || 12, 24);
  for (let i = 1; i <= epCountToGenerate; i++) {
    episodesList.push({
      id: `ep-${m.id}-${i}`,
      animeId: String(m.id),
      seasonNumber: 1,
      episodeNumber: i,
      title: `Episode ${i}`,
      synopsis: `Episode ${i} of ${primaryTitle}.`,
      thumbnailUrl: bannerUrl || coverUrl,
      runtimeSeconds: (m.duration || 24) * 60,
      releaseDate: m.startDate?.year ? `${m.startDate.year}` : '2024',
      visibility: 'published',
      viewingSources,
    });
  }

  return {
    id: String(m.id),
    title: primaryTitle,
    romajiTitle: titleRomaji,
    nativeTitle: titleNative,
    alternativeTitles: [titleRomaji, titleNative, titleEnglish].filter(Boolean) as string[],
    slug,
    synopsis: sanitizeDescription(m.description),
    coverImageUrl: coverUrl,
    bannerImageUrl: bannerUrl,
    releaseYear: m.seasonYear || m.startDate?.year || new Date().getFullYear(),
    releaseSeason: m.season,
    status,
    episodeCount,
    currentEpisode,
    rating: m.averageScore || m.meanScore || 80,
    genres: m.genres && m.genres.length > 0 ? m.genres : ['Action', 'Adventure'],
    characters,
    episodes: episodesList,
    viewingSources,
    isFeatured: (m.averageScore || 0) > 85,
    trendingRank: m.trending || undefined,
    popularityScore: m.popularity || 10000,
    visibility: 'published',
    metadataSource: 'AniList GraphQL API',
    startDate: m.startDate,
    endDate: m.endDate,
    nextAiringEpisode: m.nextAiringEpisode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Universal GraphQL fetcher with retry and 15s timeout
async function fetchAniListGraphQL<T>(query: string, variables: Record<string, any> = {}, retryCount = 1): Promise<T> {
  const cacheKey = `${query}_${JSON.stringify(variables)}`;
  const cached = getFromCache<T>(cacheKey);
  if (cached) return cached;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('AniList rate limit reached. Please wait a moment.');
      }
      throw new Error(`AniList returned HTTP status ${response.status}`);
    }

    const json = await response.json();
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message || 'AniList GraphQL query error');
    }

    const result = json.data as T;
    setToCache(cacheKey, result);
    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (retryCount > 0 && (error.name === 'AbortError' || error.message?.includes('timed out'))) {
      await new Promise((r) => setTimeout(r, 600));
      return fetchAniListGraphQL<T>(query, variables, retryCount - 1);
    }
    if (error.name === 'AbortError') {
      throw new Error('AniList request timed out. Please check your network connection.');
    }
    throw error;
  }
}

// Media Fields Fragment
const MEDIA_FRAGMENT = `
  id
  title {
    romaji
    english
    native
  }
  description(asHtml: false)
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  seasonYear
  season
  status
  episodes
  duration
  averageScore
  meanScore
  popularity
  trending
  genres
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  nextAiringEpisode {
    episode
    airingAt
    timeUntilAiring
  }
`;

// 1. Get Trending Anime
export async function getTrendingAnime(perPage = 10): Promise<Anime[]> {
  const query = `
    query GetTrending($perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, sort: [TRENDING_DESC, POPULARITY_DESC]) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  try {
    const data = await fetchAniListGraphQL<any>(query, { perPage });
    const mediaList = data?.Page?.media || [];
    return mediaList.map(mapAniListMediaToAnime);
  } catch (err) {
    console.warn('Failed to fetch trending anime from AniList:', err);
    return [];
  }
}

// 2. Get Popular This Week
export async function getPopularThisWeek(perPage = 10): Promise<Anime[]> {
  const query = `
    query GetPopular($perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, sort: [POPULARITY_DESC, SCORE_DESC]) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  try {
    const data = await fetchAniListGraphQL<any>(query, { perPage });
    const mediaList = data?.Page?.media || [];
    return mediaList.map(mapAniListMediaToAnime);
  } catch (err) {
    console.warn('Failed to fetch popular anime from AniList:', err);
    return [];
  }
}

// 3. Airing Schedule for Today's Updates & Latest Episodes
export interface AiringItem {
  id: number;
  episode: number;
  airingAt: number;
  timeUntilAiring: number;
  anime: Anime;
}

export async function getAiringSchedule(perPage = 12): Promise<AiringItem[]> {
  // Look at recent airing (past 24h) and next airing
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 86400;

  const query = `
    query GetAiring($airingAt_greater: Int, $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        airingSchedules(airingAt_greater: $airingAt_greater, sort: TIME_ASC) {
          id
          airingAt
          timeUntilAiring
          episode
          media {
            ${MEDIA_FRAGMENT}
          }
        }
      }
    }
  `;

  try {
    const data = await fetchAniListGraphQL<any>(query, {
      airingAt_greater: oneDayAgo,
      perPage,
    });
    const items = data?.Page?.airingSchedules || [];
    return items
      .filter((item: any) => item.media)
      .map((item: any) => ({
        id: item.id,
        episode: item.episode,
        airingAt: item.airingAt,
        timeUntilAiring: item.timeUntilAiring,
        anime: mapAniListMediaToAnime(item.media),
      }));
  } catch (err) {
    console.warn('Failed to fetch airing schedule from AniList:', err);
    return [];
  }
}

// 4. Get Anime by AniList ID (Supports both numeric id and "anilist-1234" string)
export async function getAnimeById(rawId: string | number): Promise<Anime | null> {
  const cleanId = String(rawId).replace(/^anilist-/, '').trim();
  const numericId = parseInt(cleanId, 10);

  if (isNaN(numericId)) {
    // If it's a slug, search by title query
    const searchResults = await searchAnime(cleanId.replace(/-/g, ' '), undefined, 1, 1);
    return searchResults[0] || null;
  }

  const query = `
    query GetAnimeDetail($id: Int) {
      Media(id: $id, type: ANIME) {
        ${MEDIA_FRAGMENT}
        characters(sort: ROLE, perPage: 10) {
          edges {
            role
            node {
              id
              name {
                full
                native
                userPreferred
              }
              image {
                large
                medium
              }
              description(asHtml: false)
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchAniListGraphQL<any>(query, { id: numericId });
    if (!data?.Media) return null;
    return mapAniListMediaToAnime(data.Media);
  } catch (err) {
    console.warn(`Failed to fetch anime ID ${rawId} from AniList:`, err);
    return null;
  }
}

// 5. Search Anime by Title & Genre
export async function searchAnime(
  queryText?: string,
  genre?: string,
  page = 1,
  perPage = 20
): Promise<Anime[]> {
  const cleanQuery = (queryText || '').trim();
  const cleanGenre = genre && genre !== 'All' ? genre.trim() : undefined;

  const variables: Record<string, any> = { page, perPage };
  if (cleanQuery) variables.search = cleanQuery;
  if (cleanGenre) variables.genre = cleanGenre;

  const query = `
    query SearchAnime($page: Int, $perPage: Int, $search: String, $genre: String) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, genre: $genre, type: ANIME, sort: [POPULARITY_DESC, SEARCH_MATCH]) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  try {
    const data = await fetchAniListGraphQL<any>(query, variables);
    const mediaList = data?.Page?.media || [];
    return mediaList.map(mapAniListMediaToAnime);
  } catch (err) {
    console.warn('Failed to search AniList:', err);
    return [];
  }
}

// 6. Get Seasonal Anime
export async function getSeasonalAnime(perPage = 12): Promise<Anime[]> {
  const query = `
    query GetSeasonal($perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(type: ANIME, status: RELEASING, sort: [POPULARITY_DESC]) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  try {
    const data = await fetchAniListGraphQL<any>(query, { perPage });
    const mediaList = data?.Page?.media || [];
    return mediaList.map(mapAniListMediaToAnime);
  } catch (err) {
    console.warn('Failed to fetch seasonal anime from AniList:', err);
    return [];
  }
}

// 7. Discover Anime: Multi-category querying with pagination, duplicate filtering & AniList metadata
export type DiscoverCategory =
  | 'recently-released'
  | 'currently-airing'
  | 'trending'
  | 'upcoming'
  | 'popular'
  | 'seasonal';

export interface DiscoverResult {
  animeList: Anime[];
  pageInfo: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
  };
  category: DiscoverCategory;
}

export function getCurrentSeasonAndYear(): {
  season: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
  year: number;
  label: string;
} {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed: 0 = Jan, 9 = Oct
  const year = now.getFullYear();

  let season: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
  let seasonYear = year;

  if (month === 11) {
    season = 'WINTER';
    seasonYear = year + 1;
  } else if (month <= 1) {
    season = 'WINTER';
  } else if (month >= 2 && month <= 4) {
    season = 'SPRING';
  } else if (month >= 5 && month <= 7) {
    season = 'SUMMER';
  } else {
    season = 'FALL';
  }

  const label = `${season.charAt(0) + season.slice(1).toLowerCase()} ${seasonYear}`;
  return { season, year: seasonYear, label };
}

export async function getDiscoverAnime(
  category: DiscoverCategory,
  page = 1,
  perPage = 10
): Promise<DiscoverResult> {
  const variables: Record<string, any> = { page, perPage };

  if (category === 'recently-released') {
    variables.status = 'RELEASING';
    variables.sort = ['START_DATE_DESC', 'POPULARITY_DESC'];
  } else if (category === 'currently-airing') {
    variables.status = 'RELEASING';
    variables.sort = ['POPULARITY_DESC'];
  } else if (category === 'trending') {
    variables.sort = ['TRENDING_DESC', 'POPULARITY_DESC'];
  } else if (category === 'upcoming') {
    variables.status = 'NOT_YET_RELEASED';
    variables.sort = ['POPULARITY_DESC'];
  } else if (category === 'popular') {
    variables.sort = ['POPULARITY_DESC'];
  } else if (category === 'seasonal') {
    const { season, year } = getCurrentSeasonAndYear();
    variables.season = season;
    variables.seasonYear = year;
    variables.sort = ['POPULARITY_DESC'];
  }

  const query = `
    query GetDiscoverAnime(
      $page: Int,
      $perPage: Int,
      $sort: [MediaSort],
      $status: MediaStatus,
      $status_in: [MediaStatus],
      $season: MediaSeason,
      $seasonYear: Int
    ) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(
          type: ANIME,
          sort: $sort,
          status: $status,
          status_in: $status_in,
          season: $season,
          seasonYear: $seasonYear
        ) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL<any>(query, variables);
  const mediaList = data?.Page?.media || [];
  const mapped = mediaList.map(mapAniListMediaToAnime);

  // Remove duplicate entries based on AniList ID
  const seenIds = new Set<string>();
  const uniqueAnime: Anime[] = [];
  for (const item of mapped) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueAnime.push(item);
    }
  }

  const rawPageInfo = data?.Page?.pageInfo;
  return {
    animeList: uniqueAnime,
    pageInfo: {
      total: rawPageInfo?.total || uniqueAnime.length,
      perPage: rawPageInfo?.perPage || perPage,
      currentPage: rawPageInfo?.currentPage || page,
      lastPage: rawPageInfo?.lastPage || page,
      hasNextPage: Boolean(rawPageInfo?.hasNextPage),
    },
    category,
  };
}

// 8. Advanced Filter & Genre Definitions (Precision discovery)
export const ANILIST_OFFICIAL_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Ecchi',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
] as const;

export const POPULAR_GENRE_TAGS = [
  'Cyberpunk',
  'Historical',
  'Isekai',
  'Martial Arts',
  'Military',
  'Parody',
  'School',
  'Space',
  'Super Power',
  'Time Travel',
  'Vampire',
] as const;

// 28 balanced genres sorted alphabetically across 4 columns of 7 genres each
export const BALANCED_GENRE_COLUMNS: string[][] = [
  ['Action', 'Adventure', 'Comedy', 'Cyberpunk', 'Drama', 'Ecchi', 'Fantasy'],
  ['Historical', 'Horror', 'Isekai', 'Mahou Shoujo', 'Martial Arts', 'Mecha', 'Military'],
  ['Music', 'Mystery', 'Parody', 'Psychological', 'Romance', 'School', 'Sci-Fi'],
  ['Slice of Life', 'Space', 'Sports', 'Super Power', 'Supernatural', 'Thriller', 'Vampire'],
];

export const ALL_FILTER_GENRES: string[] = BALANCED_GENRE_COLUMNS.flat();

export interface AdvancedFilterParams {
  keyword?: string;
  genre?: string;
  season?: string;
  year?: string | number;
  format?: string;
  status?: string;
  language?: string;
  source?: string;
  ep_min?: number | string;
  ep_max?: number | string;
  sort?: string;
  page?: number;
  perPage?: number;
}

export interface AdvancedFilterResult {
  animeList: Anime[];
  pageInfo: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
  };
}

export async function advancedFilterAnime(
  params: AdvancedFilterParams
): Promise<AdvancedFilterResult> {
  const page = Number(params.page) || 1;
  const perPage = Number(params.perPage) || 20;

  const variables: Record<string, any> = { page, perPage };

  // Keyword / search text
  const cleanKeyword = (params.keyword || '').trim();
  if (cleanKeyword) {
    variables.search = cleanKeyword;
  }

  // Genre / Tag
  const cleanGenre = (params.genre || '').trim();
  if (cleanGenre && cleanGenre !== 'All') {
    if (ANILIST_OFFICIAL_GENRES.includes(cleanGenre as any)) {
      variables.genre = cleanGenre;
    } else {
      variables.tag = cleanGenre;
    }
  }

  // Format / Type (TV, MOVIE, OVA, ONA, SPECIAL, MUSIC)
  if (params.format && params.format !== 'All') {
    variables.format = params.format;
  }

  // Status (RELEASING, FINISHED, NOT_YET_RELEASED, CANCELLED)
  if (params.status && params.status !== 'All') {
    variables.status = params.status;
  }

  // Season (WINTER, SPRING, SUMMER, FALL)
  if (params.season && params.season !== 'All') {
    variables.season = params.season;
  }

  // Season Year
  if (params.year && params.year !== 'All') {
    const yr = Number(params.year);
    if (!isNaN(yr) && yr > 1960) {
      variables.seasonYear = yr;
    }
  }

  // Source Material (MANGA, LIGHT_NOVEL, ORIGINAL, etc.)
  if (params.source && params.source !== 'All') {
    variables.source = params.source;
  }

  // Episode range
  if (params.ep_min !== undefined && params.ep_min !== '' && !isNaN(Number(params.ep_min))) {
    const minVal = Number(params.ep_min);
    if (minVal > 0) {
      variables.episodes_greater = minVal - 1;
    }
  }
  if (params.ep_max !== undefined && params.ep_max !== '' && !isNaN(Number(params.ep_max))) {
    const maxVal = Number(params.ep_max);
    if (maxVal > 0) {
      variables.episodes_lesser = maxVal + 1;
    }
  }

  // Sort mapping
  const sortKey = (params.sort || 'default').toLowerCase();
  switch (sortKey) {
    case 'updated':
      variables.sort = ['UPDATED_AT_DESC'];
      break;
    case 'recent':
      variables.sort = ['START_DATE_DESC', 'POPULARITY_DESC'];
      break;
    case 'title':
      variables.sort = ['TITLE_ROMAJI'];
      break;
    case 'score':
      variables.sort = ['SCORE_DESC', 'POPULARITY_DESC'];
      break;
    case 'episodes':
      variables.sort = ['EPISODES_DESC'];
      break;
    case 'default':
    default:
      if (cleanKeyword) {
        variables.sort = ['SEARCH_MATCH', 'POPULARITY_DESC'];
      } else {
        variables.sort = ['POPULARITY_DESC'];
      }
      break;
  }

  const query = `
    query AdvancedFilterAnime(
      $page: Int,
      $perPage: Int,
      $search: String,
      $genre: String,
      $tag: String,
      $format: MediaFormat,
      $status: MediaStatus,
      $season: MediaSeason,
      $seasonYear: Int,
      $source: MediaSource,
      $sort: [MediaSort],
      $episodes_greater: Int,
      $episodes_lesser: Int
    ) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(
          type: ANIME,
          search: $search,
          genre: $genre,
          tag: $tag,
          format: $format,
          status: $status,
          season: $season,
          seasonYear: $seasonYear,
          source: $source,
          sort: $sort,
          episodes_greater: $episodes_greater,
          episodes_lesser: $episodes_lesser
        ) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL<any>(query, variables);
  const mediaList = data?.Page?.media || [];
  let mapped = mediaList.map(mapAniListMediaToAnime);

  // Exact episode range filter if known
  if (params.ep_min !== undefined && params.ep_min !== '' && !isNaN(Number(params.ep_min))) {
    const minVal = Number(params.ep_min);
    mapped = mapped.filter((a: Anime) => !a.episodeCount || a.episodeCount >= minVal);
  }
  if (params.ep_max !== undefined && params.ep_max !== '' && !isNaN(Number(params.ep_max))) {
    const maxVal = Number(params.ep_max);
    mapped = mapped.filter((a: Anime) => !a.episodeCount || a.episodeCount <= maxVal);
  }

  // Deduplicate
  const seenIds = new Set<string>();
  const uniqueAnime: Anime[] = [];
  for (const item of mapped) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueAnime.push(item);
    }
  }

  const rawPageInfo = data?.Page?.pageInfo;
  return {
    animeList: uniqueAnime,
    pageInfo: {
      total: rawPageInfo?.total || uniqueAnime.length,
      perPage: rawPageInfo?.perPage || perPage,
      currentPage: rawPageInfo?.currentPage || page,
      lastPage: rawPageInfo?.lastPage || page,
      hasNextPage: Boolean(rawPageInfo?.hasNextPage),
    },
  };
}


