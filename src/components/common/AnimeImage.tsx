import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface AnimeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  className?: string;
}

export const AnimeImage: React.FC<AnimeImageProps> = ({
  src,
  alt = 'Anime poster',
  fallbackTitle,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full bg-[#101A30] border border-[#1E2E54] flex flex-col items-center justify-center p-3 text-center select-none ${className}`}
      >
        <Film className="w-6 h-6 text-[#648BFF]/60 mb-1.5" />
        <span className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
          {fallbackTitle || alt}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-[#7888A7] mt-1 font-mono">
          AN.FLIX
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden w-full h-full bg-[#101A30] ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#101A30] via-[#1A294A] to-[#101A30] animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
};
