import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { DiscoverAnimeSection } from '../components/home/DiscoverAnimeSection';
import { SearchAnimeBox } from '../components/home/SearchAnimeBox';
import { FeaturedAnimeCard } from '../components/home/FeaturedAnimeCard';
import { PopularThisWeek } from '../components/home/PopularThisWeek';
import { LatestEpisodes } from '../components/home/LatestEpisodes';
import { QuickToolsPanel } from '../components/home/QuickToolsPanel';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Cinematic Hero Banner */}
      <HeroBanner />

      {/* 2. Discover Anime - Real AniList API Feed */}
      <DiscoverAnimeSection />

      {/* 3. Three-column Content Grid matching Mockup exactly */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search Anime & Featured Anime */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <SearchAnimeBox />
          <FeaturedAnimeCard />
        </div>

        {/* Middle Column: Popular This Week & Latest Episodes */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <PopularThisWeek />
          <LatestEpisodes />
        </div>

        {/* Right Column: Quick Tools, Mood Card, Download anywhere */}
        <div className="lg:col-span-3">
          <QuickToolsPanel />
        </div>
      </div>
    </div>
  );
};
