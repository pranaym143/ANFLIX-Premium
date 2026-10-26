import React, { createContext, useContext, useState, useEffect } from 'react';
import { Anime } from '../types/anime';
import { LibraryItem, FavoriteItem, ViewingHistoryItem, PublicUpdateItem, WatchStatus } from '../types/user';
import { INITIAL_ANIME_DATA } from '../services/animeData';

interface LibraryContextType {
  favorites: FavoriteItem[];
  library: LibraryItem[];
  history: ViewingHistoryItem[];
  searchHistory: string[];
  notifications: PublicUpdateItem[];
  unreadNotificationCount: number;
  isFavorite: (animeId: string) => boolean;
  toggleFavorite: (anime: Anime) => void;
  getLibraryItem: (animeId: string) => LibraryItem | undefined;
  updateLibraryStatus: (anime: Anime, status: WatchStatus, progressEpisode?: number) => void;
  removeFromLibrary: (animeId: string) => void;
  addToHistory: (anime: Anime, episodeNumber?: number) => void;
  clearHistory: () => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllLocalData: () => void;
}

const STORAGE_KEY_FAVORITES = 'anflix_public_favorites_v2';
const STORAGE_KEY_LIBRARY = 'anflix_public_library_v2';
const STORAGE_KEY_HISTORY = 'anflix_public_history_v2';
const STORAGE_KEY_SEARCHES = 'anflix_public_searches_v2';
const STORAGE_KEY_NOTIFS = 'anflix_public_notifs_v2';

const DEFAULT_PUBLIC_NOTIFICATIONS: PublicUpdateItem[] = [
  {
    id: 'pub-notif-1',
    title: 'Solo Leveling S2 Episode 9 Broadcast',
    message: 'Episode 9 "Arise from the Abyss" is now streaming on official platforms.',
    type: 'release',
    destinationPath: '/anime/solo-leveling',
    read: false,
    createdAt: '2026-10-22T14:30:00Z',
  },
  {
    id: 'pub-notif-2',
    title: 'Dandadan Worldwide Release',
    message: 'Episode 6 is available on verified streaming services.',
    type: 'update',
    destinationPath: '/anime/dandadan',
    read: false,
    createdAt: '2026-10-22T10:00:00Z',
  },
  {
    id: 'pub-notif-3',
    title: 'Autumn Seasonal Discovery',
    message: 'Explore trending autumn anime series and newly announced broadcasts.',
    type: 'system',
    destinationPath: '/updates',
    read: true,
    createdAt: '2026-10-21T08:00:00Z',
  },
];

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [
      { id: 'fav-1', animeId: 'solo-leveling', anime: INITIAL_ANIME_DATA[0], addedAt: '2026-10-20' },
      { id: 'fav-2', animeId: 'dandadan', anime: INITIAL_ANIME_DATA[1], addedAt: '2026-10-21' },
    ];
  });

  const [library, setLibrary] = useState<LibraryItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LIBRARY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [
      {
        id: 'lib-1',
        animeId: 'solo-leveling',
        anime: INITIAL_ANIME_DATA[0],
        status: 'watching',
        progressEpisode: 9,
        updatedAt: '2026-10-22',
      },
      {
        id: 'lib-2',
        animeId: 'dandadan',
        anime: INITIAL_ANIME_DATA[1],
        status: 'watching',
        progressEpisode: 6,
        updatedAt: '2026-10-22',
      },
    ];
  });

  const [history, setHistory] = useState<ViewingHistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [
      { id: 'h-1', animeId: 'solo-leveling', anime: INITIAL_ANIME_DATA[0], episodeNumber: 9, viewedAt: '2026-10-22T14:40:00Z' },
      { id: 'h-2', animeId: 'blue-lock', anime: INITIAL_ANIME_DATA[2], episodeNumber: 9, viewedAt: '2026-10-22T12:00:00Z' },
    ];
  });

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SEARCHES);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return ['Solo Leveling', 'Dandadan', 'Jujutsu Kaisen'];
  });

  const [notifications, setNotifications] = useState<PublicUpdateItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return DEFAULT_PUBLIC_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SEARCHES, JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  const isFavorite = (animeId: string) => {
    return favorites.some((f) => f.animeId === animeId);
  };

  const toggleFavorite = (anime: Anime) => {
    if (isFavorite(anime.id)) {
      setFavorites((prev) => prev.filter((f) => f.animeId !== anime.id));
    } else {
      const newFav: FavoriteItem = {
        id: `fav-${Date.now()}`,
        animeId: anime.id,
        anime,
        addedAt: new Date().toISOString(),
      };
      setFavorites((prev) => [newFav, ...prev]);
    }
  };

  const getLibraryItem = (animeId: string) => {
    return library.find((l) => l.animeId === animeId);
  };

  const updateLibraryStatus = (anime: Anime, status: WatchStatus, progressEpisode?: number) => {
    setLibrary((prev) => {
      const existing = prev.find((l) => l.animeId === anime.id);
      if (existing) {
        return prev.map((item) =>
          item.animeId === anime.id
            ? {
                ...item,
                status,
                progressEpisode: progressEpisode !== undefined ? progressEpisode : item.progressEpisode,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
      }
      return [
        {
          id: `lib-${Date.now()}`,
          animeId: anime.id,
          anime,
          status,
          progressEpisode: progressEpisode || 1,
          updatedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const removeFromLibrary = (animeId: string) => {
    setLibrary((prev) => prev.filter((item) => item.animeId !== animeId));
  };

  const addToHistory = (anime: Anime, episodeNumber?: number) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.animeId !== anime.id);
      return [
        {
          id: `h-${Date.now()}`,
          animeId: anime.id,
          anime,
          episodeNumber,
          viewedAt: new Date().toISOString(),
        },
        ...filtered,
      ];
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const addSearchHistory = (query: string) => {
    const q = query.trim();
    if (!q) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== q.toLowerCase());
      return [q, ...filtered].slice(0, 10);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllLocalData = () => {
    setFavorites([]);
    setLibrary([]);
    setHistory([]);
    setSearchHistory([]);
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY_FAVORITES);
    localStorage.removeItem(STORAGE_KEY_LIBRARY);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    localStorage.removeItem(STORAGE_KEY_SEARCHES);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <LibraryContext.Provider
      value={{
        favorites,
        library,
        history,
        searchHistory,
        notifications,
        unreadNotificationCount,
        isFavorite,
        toggleFavorite,
        getLibraryItem,
        updateLibraryStatus,
        removeFromLibrary,
        addToHistory,
        clearHistory,
        addSearchHistory,
        clearSearchHistory,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllLocalData,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within a LibraryProvider');
  return context;
};
