import { Anime, AnimeUpdate, Episode } from '../types/anime';
import { searchAnime as fetchAniListSearch } from './anilistService';

export const INITIAL_ANIME_DATA: Anime[] = [
  {
    id: 'solo-leveling',
    title: 'Solo Leveling',
    romajiTitle: 'Ore dake Level Up na Ken',
    nativeTitle: '나 혼자만 레벨업',
    alternativeTitles: ['Na Honjaman Rebeleop', 'Only I Level Up', 'Arise'],
    slug: 'solo-leveling',
    synopsis: 'In a world where hunters—humans who possess magical powers—must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jin-Woo finds himself in a seemingly endless struggle for survival. One day, after narrowly surviving an overwhelmingly powerful double dungeon that nearly wipes out his entire party, a mysterious quest log appears before him.',
    coverImageUrl: '/assets/reference/today_solo_leveling.png',
    bannerImageUrl: '/assets/reference/hero_full_banner.png',
    releaseYear: 2024,
    releaseSeason: 'WINTER',
    status: 'RELEASING',
    episodeCount: 24,
    currentEpisode: 9,
    rating: 92,
    genres: ['Action', 'Fantasy', 'Adventure', 'Supernatural'],
    isFeatured: true,
    trendingRank: 1,
    popularityScore: 98450,
    visibility: 'published',
    metadataSource: 'AniList Verified',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-10-22T14:30:00Z',
    featuredQuote: {
      character: 'Beru',
      quote: 'The strongest shadow soldier.',
      sourceCharacter: 'Sung Jin-Woo',
    },
    characters: [
      {
        id: 'char-jin-woo',
        name: 'Sung Jin-Woo',
        nativeName: '성진우',
        role: 'Main',
        imageUrl: '/assets/reference/hero_jinwoo_beru.png',
        description: "The Shadow Monarch and the world's only hunter capable of infinite leveling.",
      },
      {
        id: 'char-beru',
        name: 'Beru',
        nativeName: '베르',
        role: 'Main',
        imageUrl: '/assets/reference/hero_jinwoo_beru.png',
        description: "Former Ant King of Jeju Island, now commander of the Shadow Monarch's army.",
      },
    ],
    episodes: [
      {
        id: 'sl-ep-9',
        animeId: 'solo-leveling',
        seasonNumber: 2,
        episodeNumber: 9,
        title: 'Arise from the Abyss',
        synopsis: 'As the red gate threatens the strike team, Jin-Woo unleashes his newly awakened shadow extract on the monarch beasts.',
        thumbnailUrl: '/assets/reference/episodes_1_solo.png',
        runtimeSeconds: 1440,
        releaseDate: 'Oct 22, 2026',
        visibility: 'published',
        viewingSources: [
          {
            id: 'vs-sl-1',
            animeId: 'solo-leveling',
            providerName: 'Crunchyroll',
            destinationUrl: 'https://www.crunchyroll.com/series/GKKH4JYVR/solo-leveling',
            sourceType: 'official_stream',
            region: 'Global',
            availabilityStatus: 'Subscription',
          },
        ],
      },
      {
        id: 'sl-ep-8',
        animeId: 'solo-leveling',
        seasonNumber: 2,
        episodeNumber: 8,
        title: 'The Ant King Awakens',
        synopsis: 'Jeju Island reclamation team enters the hive caverns as a terrifying new lifeform takes flight.',
        thumbnailUrl: '/assets/reference/episodes_1_solo.png',
        runtimeSeconds: 1410,
        releaseDate: 'Oct 15, 2026',
        visibility: 'published',
      },
    ],
    viewingSources: [
      {
        id: 'vs-sl-main',
        animeId: 'solo-leveling',
        providerName: 'Crunchyroll',
        destinationUrl: 'https://www.crunchyroll.com/series/GKKH4JYVR/solo-leveling',
        sourceType: 'official_stream',
        region: 'Global',
        availabilityStatus: 'Subscription',
      },
    ],
  },
  {
    id: 'dandadan',
    title: 'Dandadan',
    romajiTitle: 'Dandadan',
    nativeTitle: 'ダンダダン',
    alternativeTitles: ['Dan Da Dan', 'DanDaDan'],
    slug: 'dandadan',
    synopsis: 'Momo Ayase is a high school girl who believes in ghosts but not aliens, while her classmate Ken Takakura (nicknamed Okarun) believes in aliens but not ghosts. In a wager to determine who is right, the two decide to separately visit locations associated with both the occult and the extraterrestrial. When they arrive at their destinations, they discover that both ghosts and aliens exist.',
    coverImageUrl: '/assets/reference/today_dandadan.png',
    bannerImageUrl: '/assets/reference/today_dandadan.png',
    releaseYear: 2024,
    releaseSeason: 'FALL',
    status: 'RELEASING',
    episodeCount: 12,
    currentEpisode: 6,
    rating: 88,
    genres: ['Action', 'Comedy', 'Supernatural', 'Sci-Fi'],
    isFeatured: false,
    trendingRank: 2,
    popularityScore: 92100,
    visibility: 'published',
    metadataSource: 'AniList Verified',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2026-10-22T14:30:00Z',
    characters: [
      {
        id: 'char-momo',
        name: 'Momo Ayase',
        nativeName: '綾瀬 桃',
        role: 'Main',
        imageUrl: '/assets/reference/today_dandadan.png',
      },
      {
        id: 'char-okarun',
        name: 'Ken Takakura (Okarun)',
        nativeName: '高倉 健',
        role: 'Main',
        imageUrl: '/assets/reference/today_dandadan.png',
      },
    ],
    episodes: [
      {
        id: 'ddd-ep-6',
        animeId: 'dandadan',
        seasonNumber: 1,
        episodeNumber: 6,
        title: 'To a Woman Who Sucks the Night Air',
        synopsis: 'Momo and Okarun encounter the Acrobatic Silky on the school rooftop.',
        thumbnailUrl: '/assets/reference/episodes_3_dandadan.png',
        runtimeSeconds: 1400,
        releaseDate: 'Oct 22, 2026',
        visibility: 'published',
      },
    ],
    viewingSources: [
      {
        id: 'vs-ddd-main',
        animeId: 'dandadan',
        providerName: 'Netflix',
        destinationUrl: 'https://www.netflix.com/title/81737346',
        sourceType: 'official_stream',
        region: 'Global',
        availabilityStatus: 'Subscription',
      },
      {
        id: 'vs-ddd-cr',
        animeId: 'dandadan',
        providerName: 'Crunchyroll',
        destinationUrl: 'https://www.crunchyroll.com/series/GG5H5XQ05/dandadan',
        sourceType: 'official_stream',
        region: 'Global',
        availabilityStatus: 'Subscription',
      },
    ],
  },
  {
    id: 'blue-lock',
    title: 'Blue Lock vs. U-20 Japan',
    romajiTitle: 'Blue Lock: VS. U-20 JAPAN',
    nativeTitle: 'ブルーロック VS. U-20 JAPAN',
    alternativeTitles: ['Blue Lock Season 2', 'BLUELOCK'],
    slug: 'blue-lock',
    synopsis: 'Following the grueling Second Selection, Jinpachi Ego introduces the remaining candidates to their ultimate challenge: taking on the Japan National Under-20 Football Team. If Blue Lock wins, they will represent Japan on the world stage.',
    coverImageUrl: '/assets/reference/today_bluelock.png',
    bannerImageUrl: '/assets/reference/today_bluelock.png',
    releaseYear: 2024,
    releaseSeason: 'FALL',
    status: 'RELEASING',
    episodeCount: 14,
    currentEpisode: 9,
    rating: 84,
    genres: ['Sports', 'Drama', 'Action'],
    isFeatured: false,
    trendingRank: 3,
    popularityScore: 88700,
    visibility: 'published',
    metadataSource: 'AniList Verified',
    createdAt: '2024-09-15T00:00:00Z',
    updatedAt: '2026-10-22T14:30:00Z',
    characters: [
      {
        id: 'char-isagi',
        name: 'Yoichi Isagi',
        nativeName: '潔 世一',
        role: 'Main',
        imageUrl: '/assets/reference/today_bluelock.png',
      },
    ],
    episodes: [
      {
        id: 'bl-ep-9',
        animeId: 'blue-lock',
        seasonNumber: 2,
        episodeNumber: 9,
        title: 'Spatial Dimension Climax',
        synopsis: 'Isagi pieces together his direct-shot puzzle against the U-20 defense.',
        thumbnailUrl: '/assets/reference/episodes_2_bluelock.png',
        runtimeSeconds: 1390,
        releaseDate: 'Oct 22, 2026',
        visibility: 'published',
      },
    ],
    viewingSources: [
      {
        id: 'vs-bl-cr',
        animeId: 'blue-lock',
        providerName: 'Crunchyroll',
        destinationUrl: 'https://www.crunchyroll.com/series/G4PH0WEKE/blue-lock',
        sourceType: 'official_stream',
        region: 'Global',
        availabilityStatus: 'Subscription',
      },
    ],
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man – The Movie: Reze Arc',
    romajiTitle: 'Gekijouban Chainsaw Man: Reze-hen',
    nativeTitle: '劇場版 チェンソーマン レゼ篇',
    alternativeTitles: ['Chainsaw Man Reze Arc Movie', 'Chainsaw Man Movie'],
    slug: 'chainsaw-man',
    synopsis: 'Denji meets Reze, a kind café worker who takes an interest in him during a rainy day in Tokyo. However, behind her sweet smile lies the lethal Bomb Devil, setting off an explosive conflict under Tokyo fireworks.',
    coverImageUrl: '/assets/reference/today_chainsawman.png',
    bannerImageUrl: '/assets/reference/today_chainsawman.png',
    releaseYear: 2025,
    releaseSeason: 'SPRING',
    status: 'NOT_YET_RELEASED',
    episodeCount: 1,
    currentEpisode: 1,
    rating: 91,
    genres: ['Action', 'Horror', 'Supernatural'],
    isFeatured: false,
    trendingRank: 4,
    popularityScore: 86500,
    visibility: 'published',
    metadataSource: 'AniList Verified',
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2026-10-21T14:30:00Z',
    characters: [
      {
        id: 'char-denji',
        name: 'Denji',
        nativeName: 'デンジ',
        role: 'Main',
        imageUrl: '/assets/reference/today_chainsawman.png',
      },
      {
        id: 'char-reze',
        name: 'Reze',
        nativeName: 'レゼ',
        role: 'Main',
        imageUrl: '/assets/reference/today_chainsawman.png',
      },
    ],
    episodes: [],
    viewingSources: [
      {
        id: 'vs-csm-cr',
        animeId: 'chainsaw-man',
        providerName: 'Crunchyroll',
        destinationUrl: 'https://www.crunchyroll.com/series/GVDHX8QNW/chainsaw-man',
        sourceType: 'official_stream',
        region: 'Global',
        availabilityStatus: 'Subscription',
      },
    ],
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen: Shibuya Incident',
    romajiTitle: 'Jujutsu Kaisen Season 2',
    nativeTitle: '呪術廻戦 2期',
    alternativeTitles: ['JJK Shibuya Incident', 'Sorcery Fight S2'],
    slug: 'jujutsu-kaisen',
    synopsis: 'On October 31st, a veil falls over Shibuya station, trapping countless civilians. Satoru Gojo enters the underground alone to confront Pseudo-Geto and the curse spirits.',
    coverImageUrl: '/assets/reference/today_jujutsukaisen.png',
    bannerImageUrl: '/assets/reference/today_jujutsukaisen.png',
    releaseYear: 2023,
    releaseSeason: 'SUMMER',
    status: 'FINISHED',
    episodeCount: 23,
    currentEpisode: 23,
    rating: 89,
    genres: ['Action', 'Fantasy', 'Supernatural'],
    isFeatured: false,
    trendingRank: 5,
    popularityScore: 99400,
    visibility: 'published',
    metadataSource: 'AniList Verified',
    createdAt: '2023-07-01T00:00:00Z',
    updatedAt: '2026-10-21T14:30:00Z',
    characters: [
      {
        id: 'char-gojo',
        name: 'Satoru Gojo',
        nativeName: '五条 悟',
        role: 'Main',
        imageUrl: '/assets/reference/today_jujutsukaisen.png',
      },
      {
        id: 'char-sukuna',
        name: 'Ryomen Sukuna',
        nativeName: '両面 宿儺',
        role: 'Main',
        imageUrl: '/assets/reference/today_jujutsukaisen.png',
      },
    ],
    episodes: [
      {
        id: 'jjk-ep-16',
        animeId: 'jujutsu-kaisen',
        seasonNumber: 2,
        episodeNumber: 16,
        title: 'Thunderclap, Part 2',
        synopsis: 'Ryomen Sukuna and Jogo clash across Shibuya in an apocalyptic battle.',
        thumbnailUrl: '/assets/reference/episodes_4_jjk.png',
        runtimeSeconds: 1440,
        releaseDate: 'Nov 09, 2023',
        visibility: 'published',
      },
    ],
    viewingSources: [
      {
        id: 'vs-jjk-cr',
        animeId: 'jujutsu-kaisen',
        providerName: 'Crunchyroll',
        destinationUrl: 'https://www.crunchyroll.com/series/GRDV0019R/jujutsu-kaisen',
        sourceType: 'official_stream',
        region: 'Global',
        availabilityStatus: 'Subscription',
      },
    ],
  },
  {
    id: 'one-piece',
    title: 'One Piece: Egghead Island Arc',
    romajiTitle: 'One Piece',
    nativeTitle: 'ONE PIECE',
    alternativeTitles: ['One Piece Egghead'],
    slug: 'one-piece',
    synopsis: 'The Straw Hat Pirates arrive at Future Island Egghead, the research facility of the enigmatic genius Dr. Vegapunk.',
    coverImageUrl: '/assets/reference/popular_2_onepiece.png',
    bannerImageUrl: '/assets/reference/popular_2_onepiece.png',
    releaseYear: 1999,
    releaseSeason: 'FALL',
    status: 'RELEASING',
    episodeCount: 1120,
    currentEpisode: 1115,
    rating: 89,
    genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
    isFeatured: false,
    trendingRank: 6,
    popularityScore: 104500,
    visibility: 'published',
    metadataSource: 'AniList Verified',
    createdAt: '1999-10-20T00:00:00Z',
    updatedAt: '2026-10-20T14:30:00Z',
    characters: [
      {
        id: 'char-luffy',
        name: 'Monkey D. Luffy',
        nativeName: 'モンキー・D・ルフィ',
        role: 'Main',
        imageUrl: '/assets/reference/popular_2_onepiece.png',
      },
    ],
    episodes: [],
    viewingSources: [
      {
        id: 'vs-op-cr',
        animeId: 'one-piece',
        providerName: 'Crunchyroll',
        destinationUrl: 'https://www.crunchyroll.com/series/GRMG8ZQZR/one-piece',
        sourceType: 'official_stream',
        region: 'Global',
        availabilityStatus: 'Subscription',
      },
    ],
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer: Infinity Castle Arc',
    romajiTitle: 'Kimetsu no Yaiba: Mugen Jou-hen',
    nativeTitle: '鬼滅の刃 無限城編',
    alternativeTitles: ['Demon Slayer Movie Trilogy'],
    slug: 'demon-slayer',
    synopsis: 'The Demon Slayer Corps and Hashira plunge into Muzan Kibutsuji’s shifting Infinity Castle for the final decisive battle.',
    coverImageUrl: '/assets/reference/popular_4_demonslayer.png',
    bannerImageUrl: '/assets/reference/popular_4_demonslayer.png',
    releaseYear: 2025,
    releaseSeason: 'WINTER',
    status: 'NOT_YET_RELEASED',
    episodeCount: 3,
    currentEpisode: 1,
    rating: 90,
    genres: ['Action', 'Fantasy', 'Historical'],
    isFeatured: false,
    trendingRank: 7,
    popularityScore: 97800,
    visibility: 'published',
    metadataSource: 'AniList Verified',
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2026-10-20T14:30:00Z',
    characters: [
      {
        id: 'char-tanjiro',
        name: 'Tanjiro Kamado',
        nativeName: '竈門 炭治郎',
        role: 'Main',
        imageUrl: '/assets/reference/popular_4_demonslayer.png',
      },
    ],
    episodes: [],
    viewingSources: [
      {
        id: 'vs-ds-cr',
        animeId: 'demon-slayer',
        providerName: 'Crunchyroll',
        destinationUrl: 'https://www.crunchyroll.com/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba',
        sourceType: 'official_stream',
        region: 'Global',
        availabilityStatus: 'Subscription',
      },
    ],
  },
];

export const INITIAL_UPDATES: AnimeUpdate[] = [
  {
    id: 'up-1',
    title: 'Solo Leveling Season 2 Episode 9 Airing Now',
    slug: 'solo-leveling-s2-ep-9-released',
    summary: 'Sung Jin-Woo unleashes the full might of his shadow extraction against the red gate monarchs.',
    body: 'The highly anticipated Episode 9 of Solo Leveling Season 2 is now available across verified official streaming platforms.',
    coverImageUrl: '/assets/reference/today_solo_leveling.png',
    animeId: 'solo-leveling',
    animeTitle: 'Solo Leveling',
    category: 'Episode Release',
    publicationStatus: 'published',
    publishedAt: 'Oct 22, 2026',
    authorName: 'AN.FLIX Editorial',
  },
  {
    id: 'up-2',
    title: 'Dandadan Episode 6 Streams Worldwide',
    slug: 'dandadan-episode-6-worldwide',
    summary: 'Momo and Okarun face the Acrobatic Silky in a visually stunning sequence by Science SARU.',
    body: 'Science SARU continues to redefine modern anime animation with breathtaking cinematography in Dandadan Episode 6.',
    coverImageUrl: '/assets/reference/today_dandadan.png',
    animeId: 'dandadan',
    animeTitle: 'Dandadan',
    category: 'Episode Release',
    publicationStatus: 'published',
    publishedAt: 'Oct 22, 2026',
    authorName: 'AN.FLIX Editorial',
  },
  {
    id: 'up-3',
    title: 'Blue Lock Season 2: U-20 Match Climaxes',
    slug: 'blue-lock-u20-match-climax',
    summary: 'Isagi unlocks flow state as the Blue Lock team pushes Japan’s national team into stoppage time.',
    body: 'The tension reaches its absolute peak in Blue Lock Season 2 Episode 9 with unmatched intensity.',
    coverImageUrl: '/assets/reference/today_bluelock.png',
    animeId: 'blue-lock',
    animeTitle: 'Blue Lock',
    category: 'Episode Release',
    publicationStatus: 'published',
    publishedAt: 'Oct 22, 2026',
    authorName: 'AN.FLIX Editorial',
  },
];

const LOCAL_STORAGE_KEY_ANIME = 'anflix_anime_repo_v2';
const LOCAL_STORAGE_KEY_UPDATES = 'anflix_updates_repo_v2';

export function getStoredAnime(): Anime[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ANIME);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return INITIAL_ANIME_DATA;
}

export function saveStoredAnime(list: Anime[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_ANIME, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function getStoredUpdates(): AnimeUpdate[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_UPDATES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return INITIAL_UPDATES;
}

export function saveStoredUpdates(list: AnimeUpdate[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_UPDATES, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function filterLocalAnime(animeList: Anime[], query?: string, genre?: string): Anime[] {
  const q = (query || '').toLowerCase().trim();
  const g = genre && genre !== 'All' ? genre.toLowerCase().trim() : undefined;

  return animeList.filter((a) => {
    const matchesGenre = !g || a.genres.some((genreName) => genreName.toLowerCase() === g);
    if (!matchesGenre) return false;

    if (!q) return true;

    return (
      a.title.toLowerCase().includes(q) ||
      a.romajiTitle?.toLowerCase().includes(q) ||
      a.nativeTitle?.toLowerCase().includes(q) ||
      a.genres.some((genreName) => genreName.toLowerCase().includes(q)) ||
      a.alternativeTitles.some((t) => t.toLowerCase().includes(q)) ||
      a.characters.some((c) => c.name.toLowerCase().includes(q)) ||
      a.synopsis.toLowerCase().includes(q)
    );
  });
}

/**
 * Unified search combining live AniList GraphQL API and local cached entries.
 */
export async function searchAnimeUnified(query: string, genre?: string): Promise<Anime[]> {
  const local = getStoredAnime();
  const localMatches = filterLocalAnime(local, query, genre);

  if (query && query.trim().length >= 2) {
    try {
      const anilistMatches = await fetchAniListSearch(query, genre, 1, 20);
      if (anilistMatches.length > 0) {
        const seen = new Set<string>();
        const merged: Anime[] = [];

        // Put exact/close title matches first
        for (const item of [...anilistMatches, ...localMatches]) {
          const key = (item.title || item.slug).toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(item);
          }
        }
        return merged;
      }
    } catch {
      // Return local matches if network fails
      return localMatches;
    }
  }

  return localMatches;
}
