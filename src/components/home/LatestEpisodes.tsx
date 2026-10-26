import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, ArrowRight, Flame } from 'lucide-react';
import { getAiringSchedule, AiringItem } from '../../services/anilistService';
import { getStoredAnime } from '../../services/animeData';
import { Anime } from '../../types/anime';
import { AnimeImage } from '../common/AnimeImage';

interface DisplayEpisodeItem {
  anime: Anime;
  season: string;
  epNumber: number;
  duration: string;
  thumbnail: string;
}

export const LatestEpisodes: React.FC = () => {
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<DisplayEpisodeItem[]>([]);

  useEffect(() => {
    let isCancelled = false;

    async function loadEpisodes() {
      try {
        const schedule = await getAiringSchedule(8);
        if (schedule && schedule.length >= 3 && !isCancelled) {
          const mapped: DisplayEpisodeItem[] = schedule.slice(0, 4).map((item: AiringItem) => ({
            anime: item.anime,
            season: item.anime.releaseSeason ? item.anime.releaseSeason.slice(0, 1) + '1' : 'S1',
            epNumber: item.episode,
            duration: '24 min',
            thumbnail: item.anime.bannerImageUrl || item.anime.coverImageUrl,
          }));
          setEpisodes(mapped);
          return;
        }
      } catch (err) {
        console.warn('Failed to fetch latest episodes from AniList:', err);
      }

      if (!isCancelled) {
        const all = getStoredAnime();
        const fallbackItems: DisplayEpisodeItem[] = [
          {
            anime: all.find((a) => a.id === 'solo-leveling') || all[0],
            season: 'S2',
            epNumber: 9,
            duration: '24 min',
            thumbnail: '/assets/reference/episodes_1_solo.png',
          },
          {
            anime: all.find((a) => a.id === 'blue-lock') || all[2],
            season: 'S2',
            epNumber: 9,
            duration: '22 min',
            thumbnail: '/assets/reference/episodes_2_bluelock.png',
          },
          {
            anime: all.find((a) => a.id === 'dandadan') || all[1],
            season: 'S1',
            epNumber: 6,
            duration: '23 min',
            thumbnail: '/assets/reference/episodes_3_dandadan.png',
          },
          {
            anime: all.find((a) => a.id === 'jujutsu-kaisen') || all[4],
            season: 'S2',
            epNumber: 16,
            duration: '24 min',
            thumbnail: '/assets/reference/episodes_4_jjk.png',
          },
        ];
        setEpisodes(fallbackItems);
      }
    }

    loadEpisodes();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="rounded-2xl bg-[#0F1932] border border-[#1E2E54] p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#648BFF]/15 text-[#648BFF] flex items-center justify-center">
            <PlayCircle className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            Latest Episodes
          </h2>
        </div>

        <button
          onClick={() => navigate('/updates')}
          className="text-xs font-semibold text-[#648BFF] hover:text-[#8975FF] flex items-center gap-1 group transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Episode Rows */}
      <div className="space-y-2.5">
        {episodes.map((ep, idx) => (
          <div
            key={idx}
            onClick={() => navigate(`/anime/${ep.anime.slug || ep.anime.id}`)}
            className="group cursor-pointer flex items-center gap-3 p-2 rounded-xl bg-[#0A1224]/70 hover:bg-[#142345] border border-transparent hover:border-[#283E70] transition-all"
          >
            {/* Index */}
            <span className="w-4 text-center text-xs font-bold text-[#7888A7]">
              {idx + 1}
            </span>

            {/* Thumbnail */}
            <div className="relative w-12 h-10 rounded-md overflow-hidden shrink-0 border border-[#1E2E54]">
              <AnimeImage
                src={ep.thumbnail}
                alt={ep.anime.title}
                fallbackTitle={ep.anime.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white group-hover:text-[#648BFF] truncate transition-colors">
                {ep.anime.title} {ep.season}
              </h4>
              <div className="text-[11px] text-[#7888A7] mt-0.5">
                Episode {ep.epNumber} · {ep.duration}
              </div>
            </div>

            {/* Flame indicator */}
            <div className="p-1.5 text-[#FF5A79]">
              <Flame className="w-4 h-4 fill-current" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
