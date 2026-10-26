import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DownloadCloud,
  FileVideo,
  Trash2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  getDownloadHistory,
  clearDownloadHistory,
  triggerBrowserFileDownload,
} from '../services/downloadService';
import { DownloadJob } from '../types/anime';

export const DownloadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<DownloadJob[]>([]);

  useEffect(() => {
    setHistory(getDownloadHistory());
  }, []);

  const handleClear = () => {
    clearDownloadHistory();
    setHistory([]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1B294B]">
        <div>
          <button
            onClick={() => navigate('/download')}
            className="flex items-center gap-1.5 text-xs text-[#A9B5CE] hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Downloader</span>
          </button>
          <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
            My Downloads
          </h1>
          <p className="text-xs text-[#7888A7]">
            Saved media clips, promotional trailers, and export history.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="py-2 px-4 rounded-xl bg-[#162340] hover:bg-[#FF4572]/20 hover:text-[#FF708F] text-xs font-semibold text-[#A9B5CE] flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Downloads</span>
          </button>
        )}
      </div>

      {/* Downloads List */}
      <div className="bg-[#0F1932] border border-[#1E2E54] rounded-3xl p-6 shadow-xl space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <DownloadCloud className="w-12 h-12 mx-auto text-[#7888A7]" />
            <h3 className="text-base font-bold text-white">No downloads found</h3>
            <p className="text-xs text-[#7888A7] max-w-sm mx-auto">
              You haven&apos;t downloaded any anime media clips or promotional videos yet.
            </p>
            <button
              onClick={() => navigate('/download')}
              className="mt-2 py-2 px-5 rounded-xl bg-[#648BFF] text-white text-xs font-bold hover:bg-[#5277EC] transition-colors"
            >
              Open Downloader
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-[#0A1224] border border-[#1B294B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#648BFF]/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#152342] text-[#648BFF] flex items-center justify-center shrink-0">
                    <FileVideo className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{job.title}</h4>
                    <div className="text-xs text-[#7888A7] mt-0.5">
                      {job.quality} · {job.format} · {Math.round(job.totalBytes / (1024 * 1024))} MB
                    </div>
                    <div className="text-[10px] text-[#A9B5CE] mt-1 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(job.createdAt).toLocaleString()}</span>
                      <span>·</span>
                      <span className="text-[#10B981] font-semibold">{job.licenseNote}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() =>
                      triggerBrowserFileDownload(
                        job.outputFileName,
                        `AN.FLIX Media Export [${job.title}]`
                      )
                    }
                    className="py-1.5 px-3 rounded-xl bg-[#648BFF] text-white text-xs font-bold hover:bg-[#5277EC] transition-colors"
                  >
                    Export File
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
