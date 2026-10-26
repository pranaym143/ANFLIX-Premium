import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 rounded-3xl bg-[#0F1932] border border-[#1E2E54] shadow-2xl">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-[#648BFF]/20 text-[#648BFF] flex items-center justify-center">
        <Compass className="w-8 h-8" />
      </div>
      <div className="text-4xl font-black text-white font-['Space_Grotesk']">404</div>
      <h1 className="text-lg font-bold text-white">Lost in the Shadow Realm?</h1>
      <p className="text-xs text-[#7888A7] leading-relaxed">
        The anime title or route you are looking for does not exist in our current index.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('/')}
          className="py-2 px-4 rounded-xl bg-[#648BFF] hover:bg-[#5277EC] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </button>
        <button
          onClick={() => navigate('/search')}
          className="py-2 px-4 rounded-xl bg-[#162340] hover:bg-[#1C2C54] text-[#A9B5CE] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search Anime</span>
        </button>
      </div>
    </div>
  );
};
