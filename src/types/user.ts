import { Anime } from './anime';

export type WatchStatus = 'watching' | 'completed' | 'plan_to_watch' | 'on_hold' | 'dropped';

export interface LibraryItem {
  id: string;
  animeId: string;
  anime: Anime;
  status: WatchStatus;
  progressEpisode: number;
  rating?: number;
  updatedAt: string;
}

export interface FavoriteItem {
  id: string;
  animeId: string;
  anime: Anime;
  addedAt: string;
}

export interface ViewingHistoryItem {
  id: string;
  animeId: string;
  anime: Anime;
  episodeNumber?: number;
  viewedAt: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  searchType: 'text' | 'image' | 'link';
  createdAt: string;
}

export interface PublicUpdateItem {
  id: string;
  title: string;
  message: string;
  type: 'release' | 'update' | 'download' | 'system';
  destinationPath?: string;
  read: boolean;
  createdAt: string;
}
