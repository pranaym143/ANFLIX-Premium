import React from 'react';
import { Sparkles, ShieldCheck, Search, Download } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3 pb-6 border-b border-[#1B294B]">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#648BFF] to-[#8975FF] flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#648BFF]/25">
          A
        </div>
        <h1 className="text-3xl font-black text-white font-['Space_Grotesk']">
          About AN.FLIX
        </h1>
        <p className="text-sm text-[#A9B5CE] max-w-xl mx-auto">
          A premium, intelligent anime discovery platform built to connect anime enthusiasts with verified broadcasts, scene recognition, and authorized media.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#0F1932] border border-[#1E2E54] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#648BFF]/20 text-[#648BFF] flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">Smart Scene Discovery</h3>
          <p className="text-xs text-[#7888A7] leading-relaxed">
            Identify unknown anime scenes instantly by pasting public video links or uploading screenshots.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0F1932] border border-[#1E2E54] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">Legitimate &amp; Authorized</h3>
          <p className="text-xs text-[#7888A7] leading-relaxed">
            We honor intellectual property, pointing fans to legitimate streams like Crunchyroll and Netflix, and only downloading permitted clips.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0F1932] border border-[#1E2E54] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#B8A2FF]/20 text-[#B8A2FF] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">Cinematic Dashboard</h3>
          <p className="text-xs text-[#7888A7] leading-relaxed">
            A tranquil, twilight-inspired design system with rich dark typography, avoiding childish tropes or clutter.
          </p>
        </div>
      </div>
    </div>
  );
};
