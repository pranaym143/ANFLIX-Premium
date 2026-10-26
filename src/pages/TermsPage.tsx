import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-[#A9B5CE]">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1B294B]">
        <FileText className="w-8 h-8 text-[#B8A2FF]" />
        <div>
          <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
            Terms of Service &amp; Media Rights
          </h1>
          <p className="text-xs text-[#7888A7]">Effective Date: October 2026</p>
        </div>
      </div>

      <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-white">1. Authorized Discovery &amp; Anti-Piracy</h2>
        <p>
          AN.FLIX is an anime editorial, metadata discovery, and scene identification index. We do not host, re-encode, or distribute unauthorized, copyright-infringing video streams. All stream destination links connect users directly to licensed distribution networks such as Crunchyroll, Netflix, Hulu, and official Japanese broadcast partners.
        </p>

        <h2 className="text-base font-bold text-white">2. Download Manager Usage</h2>
        <p>
          The AN.FLIX Media Downloader is strictly authorized for openly licensed trailers, promotional clips, user-generated videos, and content distributed under creative commons or public promotional licenses. We do not bypass Widevine DRM, paywalls, or protected video streams.
        </p>

        <h2 className="text-base font-bold text-white">3. Anime Artwork &amp; Trademark Attribution</h2>
        <p>
          All anime series titles, character likenesses, and promotional artworks are the exclusive intellectual property of their respective creators, publishers, and production committees. Metadata is provided in partnership with the AniList Open API.
        </p>
      </div>
    </div>
  );
};
