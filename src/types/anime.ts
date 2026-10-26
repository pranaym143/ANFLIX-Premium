export type AnimeStatus = 'RELEASING' | 'FINISHED' | 'NOT_YET_RELEASED' | 'CANCELLED';

export interface Character {
  id: string;
  name: string;
  nativeName?: string;
  role: 'Main' | 'Supporting' | 'Background';
  imageUrl: string;
  description?: string;
}

export interface ViewingSource {
  id: string;
  animeId: string;
  providerName: 'Crunchyroll' | 'Netflix' | 'Hulu' | 'Prime Video' | 'Disney+' | 'Official Web';
  destinationUrl: string;
  sourceType: 'official_stream' | 'official_purchase' | 'official_free';
  region?: string;
  availabilityStatus: 'Available' | 'Subscription' | 'Purchase Required';
}

export interface Episode {
  id: string;
  animeId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  synopsis?: string;
  thumbnailUrl: string;
  runtimeSeconds: number; // e.g. 1440 for 24 min
  releaseDate: string;
  visibility: 'published' | 'draft';
  viewingSources?: ViewingSource[];
}

export interface Anime {
  id: string;
  title: string;
  romajiTitle?: string;
  nativeTitle?: string;
  alternativeTitles: string[];
  slug: string;
  synopsis: string;
  coverImageUrl: string;
  bannerImageUrl: string;
  releaseYear: number;
  releaseSeason?: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
  status: AnimeStatus;
  episodeCount: number;
  currentEpisode?: number;
  rating?: number; // 0-100 score
  genres: string[];
  characters: Character[];
  episodes: Episode[];
  viewingSources: ViewingSource[];
  isFeatured?: boolean;
  featuredQuote?: {
    character: string;
    quote: string;
    sourceCharacter?: string;
  };
  trendingRank?: number;
  popularityScore?: number;
  visibility: 'published' | 'draft';
  metadataSource?: string;
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  endDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  nextAiringEpisode?: {
    episode: number;
    airingAt: number;
    timeUntilAiring: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AnimeUpdate {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  coverImageUrl: string;
  animeId?: string;
  animeTitle?: string;
  category: 'Episode Release' | 'Anime Announcement' | 'Movie Premiere' | 'Season Finale' | 'Staff News';
  publicationStatus: 'published' | 'draft' | 'scheduled';
  publishedAt: string;
  authorName: string;
}

export interface IdentificationResult {
  anime: Anime;
  confidence: number; // 0-100%
  likelyEpisode?: number;
  timestamp?: string;
  recognizedCharacters: string[];
  evidenceSummary: string;
  sceneDescription: string;
  provider: string;
  officialSources: ViewingSource[];
}

export interface DownloadJob {
  id: string;
  sourceUrl: string;
  provider: string;
  title: string;
  animeId?: string;
  quality: '1080p Full HD' | '720p HD' | '480p SD' | 'Audio Only (MP3)';
  format: 'MP4 (H.264)' | 'MKV' | 'WEBM' | 'MP3';
  status: 'queued' | 'validating' | 'downloading' | 'completed' | 'failed' | 'cancelled';
  progressPercent: number;
  downloadedBytes: number;
  totalBytes: number;
  speed: string; // e.g. "4.2 MB/s"
  etaSeconds: number;
  outputFileName: string;
  downloadUrl?: string;
  isAuthorized: boolean;
  licenseNote?: string;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}
