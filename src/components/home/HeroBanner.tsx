import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Flame,
  Sparkles,
  Link as LinkIcon,
  Search,
} from 'lucide-react';
import { AnimeImage } from '../common/AnimeImage';

export const HeroBanner: React.FC = () => {
  const navigate = useNavigate();
  const [heroInput, setHeroInput] = useState('');

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = heroInput.trim();
    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative rounded-3xl overflow-hidden border border-[#223663]/60 bg-[#070D1C] shadow-2xl mb-8">
      {/* Background Cover Image: Twilight Dragon Over the Crystal City */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dqpsyh7yu/image/upload/v1792835800/Twilight_Dragon_Over_the_Crystal_City_qynxkj.png')`,
          }}
        />
        {/* Transparent scrims so the Twilight Dragon & Crystal City artwork is visible with maximum clarity */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070D1C]/60 via-[#070D1C]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1C]/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 min-h-[420px]">
        {/* Left Content Column */}
        <div className="w-full lg:max-w-2xl flex flex-col justify-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black tracking-[0.25em] uppercase text-[#648BFF] font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              SOLO LEVELING
            </span>
            <div className="h-1 w-1 rounded-full bg-[#648BFF]" />
            <span className="text-[11px] text-[#A9B5CE] font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">SEASON 2 AIRING NOW</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-['Space_Grotesk'] mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Every Anime, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#B8A2FF] to-[#648BFF]">
              One Place.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base text-[#D0DBF2] max-w-xl leading-relaxed mb-6 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
            <strong className="text-white font-semibold">Discover. Explore. Watch.</strong> Get real-time anime updates, search any title across thousands of series, and discover authentic airing schedules directly from AniList.
          </p>

          {/* Hero Search Field */}
          <form onSubmit={handleHeroSubmit} className="relative w-full max-w-lg mb-6">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-[#7888A7]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                placeholder="Search any anime by title, character, or genre..."
                className="w-full h-12 pl-11 pr-14 rounded-full bg-[#0B1325]/70 border border-[#273B6B]/80 focus:border-[#648BFF] text-xs sm:text-sm text-white placeholder-[#8A9BBD] shadow-xl focus:outline-none focus:ring-2 focus:ring-[#648BFF]/30 transition-all"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#648BFF] to-[#8975FF] hover:from-[#5277EC] hover:to-[#7663EE] text-white flex items-center justify-center shadow-lg shadow-[#648BFF]/30 transition-transform active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Compact Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
            <button
              onClick={() => navigate('/updates')}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#070D1C]/60 hover:bg-[#152445]/80 border border-[#1D2E54]/70 transition-all text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FF4572]/15 text-[#FF708F] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Daily Updates</div>
                <div className="text-[10px] text-[#A9B5CE] truncate">New anime, news & more</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#070D1C]/60 hover:bg-[#152445]/80 border border-[#1D2E54]/70 transition-all text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#648BFF]/15 text-[#648BFF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Search className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Smart Search</div>
                <div className="text-[10px] text-[#A9B5CE] truncate">Find even without name</div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Artwork Character & Quote Section (Sung Jin-Woo & Beru) */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end justify-center relative">
          <div className="relative flex flex-col items-center lg:items-end">
            {/* Beru & Jin-Woo Quote */}
            <div className="relative mb-3 flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 text-xs text-[#B8A2FF] font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Beru</span>
                </div>
                <blockquote className="text-xs italic text-[#F4F5FF] font-serif max-w-xs drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  &ldquo;The strongest shadow soldier.&rdquo;
                </blockquote>
                <span className="text-[10px] text-[#A9B5CE] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">— Sung Jin-Woo</span>
              </div>
            </div>

            {/* Character Spotlight Preview Card */}
            <div
              onClick={() => navigate('/anime/solo-leveling')}
              className="cursor-pointer group relative rounded-2xl overflow-hidden border border-[#2A3E6F]/70 bg-[#070D1C]/60 p-2 shadow-2xl flex items-center gap-3 transition-transform hover:-translate-y-1 hover:border-[#648BFF]"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-[#648BFF]/40 group-hover:ring-[#648BFF]">
                <AnimeImage
                  src="/assets/reference/hero_jinwoo_beru.png"
                  alt="Beru — Shadow Soldier"
                  fallbackTitle="Beru"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-[#648BFF] transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    Beru
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#648BFF]/20 text-[#648BFF] font-bold">
                    SHADOW
                  </span>
                </div>
                <p className="text-[11px] text-[#A9B5CE]">Shadow Soldier Marshal &rarr;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
