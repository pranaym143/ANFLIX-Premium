import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-[#A9B5CE]">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1B294B]">
        <Shield className="w-8 h-8 text-[#648BFF]" />
        <div>
          <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
            Privacy Policy &amp; Data Ethics
          </h1>
          <p className="text-xs text-[#7888A7]">Last Updated: October 2026</p>
        </div>
      </div>

      <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-white">1. Image &amp; Screenshot Processing</h2>
        <p>
          Screenshots uploaded for anime identification are processed in transient memory to extract visual features and frame signatures. AN.FLIX does not permanently store user screenshots, personal photos, or device telemetry. Uploaded temporary buffers are purged immediately following scene matching.
        </p>

        <h2 className="text-base font-bold text-white">2. Search Queries &amp; Metadata</h2>
        <p>
          Anime title and genre search queries interact directly with the public AniList GraphQL API. We never log personal user queries on private servers or monetize query histories.
        </p>

        <h2 className="text-base font-bold text-white">3. Local Storage &amp; User State</h2>
        <p>
          User watchlists, favorite anime, watch history, and download task lists are stored client-side in standard browser local storage. You maintain complete control over your data and can purge history or favorites at any time through the respective dashboards.
        </p>
      </div>
    </div>
  );
};
