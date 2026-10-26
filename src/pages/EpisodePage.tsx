import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Calendar, Clock, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { getStoredAnime } from '../services/animeData';
import { AnimeImage } from '../components/common/AnimeImage';

export const EpisodePage: React.FC = () => {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();
  const all = getStoredAnime();

  let foundAnime = null;
  let foundEpisode = null;

  for (const a of all) {
    const ep = a.episodes?.find((e) => e.id === episodeId);
    if (ep) {
      foundAnime = a;
      foundEpisode = ep;
      break;
    }
  }

  if (!foundAnime || !foundEpisode) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FF4572]/20 text-[#FF708F] flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-white">Episode Not Found</h1>
        <p className="text-xs text-[#7888A7]">
          We could not locate this specific episode in the catalog.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-[#648BFF] text-white text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const streamUrl =
    foundEpisode.viewingSources?.[0]?.destinationUrl ||
    foundAnime.viewingSources?.[0]?.destinationUrl ||
    `https://www.crunchyroll.com/search?q=${encodeURIComponent(foundAnime.title)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(`/anime/${foundAnime.slug || foundAnime.id}`)}
        className="flex items-center gap-1.5 text-xs text-[#A9B5CE] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {foundAnime.title}</span>
      </button>

      {/* Hero Banner with Play Action */}
      <div className="relative rounded-3xl overflow-hidden border border-[#223663] bg-[#0A1224] aspect-[16/9] shadow-2xl flex items-center justify-center">
        <AnimeImage
          src={foundEpisode.thumbnailUrl || foundAnime.bannerImageUrl}
          alt={foundEpisode.title}
          fallbackTitle={foundEpisode.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1C] via-[#070D1C]/40 to-transparent pointer-events-none" />

        {/* Center Authorized Stream CTA */}
        <div className="relative z-10 text-center p-6 flex flex-col items-center">
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#648BFF] to-[#8975FF] hover:scale-110 flex items-center justify-center text-white shadow-2xl shadow-[#648BFF]/50 transition-transform mb-3"
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </a>
          <div className="text-sm font-bold text-white">Stream on Official Service</div>
          <p className="text-xs text-[#A9B5CE] mt-1 max-w-sm">
            AN.FLIX does not host illegal streams. Click to watch high-definition broadcast on verified networks.
          </p>
        </div>
      </div>

      {/* Episode Details */}
      <div className="bg-[#0F1932] border border-[#1E2E54] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1A294C]">
          <div>
            <div className="text-xs font-semibold text-[#648BFF] uppercase tracking-wider">
              {foundAnime.title} · Season {foundEpisode.seasonNumber}
            </div>
            <h1 className="text-2xl font-bold text-white font-['Space_Grotesk'] mt-0.5">
              Episode {foundEpisode.episodeNumber}: {foundEpisode.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#7888A7]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.floor(foundEpisode.runtimeSeconds / 60)} minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{foundEpisode.releaseDate}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase text-[#7888A7] tracking-wider mb-2">
            Episode Synopsis
          </h3>
          <p className="text-sm text-[#A9B5CE] leading-relaxed">
            {foundEpisode.synopsis ||
              'Official synopsis for this broadcast episode. Follow characters across their latest challenges and battles.'}
          </p>
        </div>

        {/* Authorized Viewing Platforms */}
        <div className="pt-4 border-t border-[#1A294C]">
          <div className="flex items-center gap-2 text-xs font-bold text-white mb-3">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Authorized Official Streaming Destinations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-[#0A1224] hover:bg-[#162547] border border-[#1E2E54] transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-white">Crunchyroll Global</div>
                <div className="text-[10px] text-[#7888A7]">Simulcast HD · Multi-Audio</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#648BFF]" />
            </a>

            <a
              href="https://www.netflix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-[#0A1224] hover:bg-[#162547] border border-[#1E2E54] transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-white">Netflix Selected Regions</div>
                <div className="text-[10px] text-[#7888A7]">Full Season Library</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#648BFF]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
