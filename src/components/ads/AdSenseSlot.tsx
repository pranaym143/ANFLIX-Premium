import React, { useEffect } from 'react';

export type AdSlotType = 'home_banner' | 'in_content' | 'sidebar' | 'footer_banner';

interface AdSenseSlotProps {
  slotType: AdSlotType;
  adSlotId?: string;
  className?: string;
}

/**
 * Reusable, disabled-by-default Google AdSense placement component.
 *
 * Current state: Disabled by default (renders nothing, zero mock ads, zero fake clicks).
 * Future activation: Provide VITE_ADSENSE_CLIENT_ID and set VITE_ADSENSE_ENABLED=true
 * in environment configuration when approved for Google AdSense publishing.
 */
export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({
  slotType,
  adSlotId,
  className = '',
}) => {
  const isEnabled = import.meta.env.VITE_ADSENSE_ENABLED === 'true';
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!isEnabled || !clientId) return;

    try {
      // Future AdSense push when real script is loaded
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // Ignore if ad blocker is active or script not loaded
    }
  }, [isEnabled, clientId]);

  // When AdSense is not configured/enabled, collapse cleanly with zero visual clutter
  if (!isEnabled || !clientId) {
    return null;
  }

  return (
    <div
      aria-label="Advertisement"
      className={`w-full overflow-hidden my-6 p-2 rounded-2xl bg-[#0A1224]/50 border border-[#162340] text-center ${className}`}
    >
      <div className="text-[10px] uppercase tracking-wider text-[#7888A7]/70 mb-1">
        Advertisement
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={adSlotId || '0000000000'}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
