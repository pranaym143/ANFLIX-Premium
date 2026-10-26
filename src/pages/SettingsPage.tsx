import React, { useState } from 'react';
import { Settings, Moon, Sun, HardDrive, Trash2, Check, Shield, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLibrary } from '../context/LibraryContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { favorites, library, history, clearAllLocalData } = useLibrary();

  const [downloadAutoExport, setDownloadAutoExport] = useState(true);
  const [clearedMsg, setClearedMsg] = useState(false);

  const handleClearData = () => {
    if (window.confirm('Clear all your locally saved favorites, library bookmarks, and watch history? This cannot be undone.')) {
      clearAllLocalData();
      setClearedMsg(true);
      setTimeout(() => setClearedMsg(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-4 border-b border-[#1B294B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#648BFF]/20 text-[#648BFF] flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
              Preferences &amp; Local Storage
            </h1>
            <p className="text-xs text-[#7888A7]">
              Manage local theme preferences, browser data storage, and download behavior.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="p-6 rounded-3xl bg-[#0F1932] border border-[#1E2E54] space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Theme &amp; Appearance
          </h2>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0A1224] border border-[#182749]">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-[#B8A2FF]" />
              ) : (
                <Sun className="w-5 h-5 text-[#FFB800]" />
              )}
              <div>
                <div className="text-xs font-bold text-white">Visual Mode</div>
                <div className="text-[11px] text-[#7888A7]">
                  Currently using {theme === 'dark' ? 'Cinematic Night Dark' : 'High Contrast Light'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="py-1.5 px-3.5 rounded-xl bg-[#152342] hover:bg-[#1E3058] text-white text-xs font-semibold border border-[#233866] transition-colors cursor-pointer"
            >
              Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Local Storage Information & Management */}
        <div className="p-6 rounded-3xl bg-[#0F1932] border border-[#1E2E54] space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Browser Local Storage
          </h2>

          <p className="text-xs text-[#A9B5CE] leading-relaxed">
            AN.FLIX operates as a completely public, privacy-focused platform with zero remote databases. Your saved favorites ({favorites.length}), library items ({library.length}), and discovery history ({history.length}) are stored locally in your browser.
          </p>

          <div className="p-3.5 rounded-2xl bg-[#0A1224] border border-[#182749] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-[#648BFF]" />
              <div>
                <div className="text-xs font-bold text-white">Purge Local Data</div>
                <div className="text-[11px] text-[#7888A7]">
                  Reset your browser bookmarks, watchlists, and search history
                </div>
              </div>
            </div>

            <button
              onClick={handleClearData}
              className="py-1.5 px-3.5 rounded-xl bg-[#FF4572]/15 hover:bg-[#FF4572]/25 text-[#FF708F] text-xs font-semibold border border-[#FF4572]/30 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>

          {clearedMsg && (
            <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#10B981] font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" /> All local browser storage has been purged.
            </div>
          )}
        </div>

        {/* Download Behavior */}
        <div className="p-6 rounded-3xl bg-[#0F1932] border border-[#1E2E54] space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Downloader Behavior
          </h2>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0A1224] border border-[#182749]">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#10B981]" />
              <div>
                <div className="text-xs font-bold text-white">Auto-Trigger Browser Download</div>
                <div className="text-[11px] text-[#7888A7]">
                  Save file automatically to device when task completes
                </div>
              </div>
            </div>

            <input
              type="checkbox"
              checked={downloadAutoExport}
              onChange={(e) => setDownloadAutoExport(e.target.checked)}
              className="w-5 h-5 accent-[#648BFF] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
