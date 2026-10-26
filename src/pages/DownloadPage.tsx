import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  FileVideo,
  HardDrive,
  XCircle,
  Clipboard,
  X,
  Search,
  Loader2,
  Youtube,
  Instagram,
  Film,
  Info,
  Check,
} from 'lucide-react';
import {
  getDownloadHistory,
  saveDownloadHistory,
  clearDownloadHistory,
  detectPlatform,
  fetchVideoMetadata,
  performRealDownload,
  triggerBrowserFileDownload,
  VideoMetadata,
  VideoFormatOption,
  VideoPlatform,
} from '../services/downloadService';
import { DownloadJob } from '../types/anime';

export const DownloadPage: React.FC = () => {
  const navigate = useNavigate();

  // Input states
  const [inputUrl, setInputUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<VideoPlatform>('unsupported');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Active video metadata state
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormatOption | null>(null);

  // Download execution state
  const [currentJob, setCurrentJob] = useState<DownloadJob | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // History state
  const [history, setHistory] = useState<DownloadJob[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(getDownloadHistory());
  }, []);

  // Update platform detection in real-time as user types
  useEffect(() => {
    if (!inputUrl.trim()) {
      setDetectedPlatform('unsupported');
      return;
    }
    const detected = detectPlatform(inputUrl);
    setDetectedPlatform(detected);
  }, [inputUrl]);

  // Handle Clipboard Paste
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text);
          setFetchError(null);
        }
      }
    } catch {
      // Clipboard read permission might be denied
    }
  };

  // Handle Clear Input
  const handleClear = () => {
    setInputUrl('');
    setDetectedPlatform('unsupported');
    setVideoData(null);
    setSelectedFormat(null);
    setFetchError(null);
  };

  // Fetch real video metadata
  const handleFetchVideo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const url = inputUrl.trim();
    if (!url) {
      setFetchError('Please enter or paste a video link or direct media URL.');
      return;
    }

    setIsLoading(true);
    setFetchError(null);
    setVideoData(null);
    setSelectedFormat(null);

    try {
      const data = await fetchVideoMetadata(url);
      setVideoData(data);
      if (data.formats.length > 0) {
        setSelectedFormat(data.formats[0]);
      }
    } catch (err: any) {
      setFetchError(err.message || 'Unable to access the provided video link. Please verify the URL.');
    } finally {
      setIsLoading(false);
    }
  };

  // Execute genuine download or official action
  const handleAction = async () => {
    if (!videoData) return;

    // Case 1: Non-direct media (YouTube or Instagram) -> Open on original platform
    if (!videoData.isDirectDownloadable) {
      if (videoData.officialUrl) {
        window.open(videoData.officialUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    // Case 2: Permitted Direct Media File (MP4, WebM) -> Real Download
    const formatToDownload = selectedFormat || videoData.formats[0];
    if (!formatToDownload) return;

    setIsDownloading(true);
    const targetUrl = formatToDownload.downloadUrl || videoData.url;
    const outputFileName = `${videoData.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.${formatToDownload.ext}`;

    const newJob: DownloadJob = {
      id: `job-${Date.now()}`,
      sourceUrl: targetUrl,
      provider: videoData.platformLabel,
      title: videoData.title,
      quality: formatToDownload.quality as any,
      format: formatToDownload.format as any,
      status: 'downloading',
      progressPercent: 0,
      downloadedBytes: 0,
      totalBytes: formatToDownload.fileSizeBytes || videoData.fileSizeBytes || 15000000,
      speed: '0 MB/s',
      etaSeconds: 5,
      outputFileName,
      isAuthorized: true,
      licenseNote: 'Permitted direct media file download.',
      createdAt: new Date().toISOString(),
    };

    setCurrentJob(newJob);

    try {
      await performRealDownload(
        targetUrl,
        outputFileName,
        (percent, downloadedBytes, totalBytes, speed) => {
          setCurrentJob((prev) =>
            prev
              ? {
                  ...prev,
                  progressPercent: percent,
                  downloadedBytes,
                  totalBytes,
                  speed,
                  status: percent >= 100 ? 'completed' : 'downloading',
                }
              : null
          );
        }
      );

      const completedJob: DownloadJob = {
        ...newJob,
        status: 'completed',
        progressPercent: 100,
        downloadedBytes: formatToDownload.fileSizeBytes || videoData.fileSizeBytes || 15000000,
        totalBytes: formatToDownload.fileSizeBytes || videoData.fileSizeBytes || 15000000,
        completedAt: new Date().toISOString(),
      };

      setCurrentJob(completedJob);
      const updatedHistory = [completedJob, ...getDownloadHistory()];
      saveDownloadHistory(updatedHistory);
      setHistory(updatedHistory);
    } catch (err: any) {
      setCurrentJob((prev) =>
        prev
          ? {
              ...prev,
              status: 'failed',
              errorMessage: err.message || 'Download encountered a network error.',
            }
          : null
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCancelJob = () => {
    if (currentJob && currentJob.status === 'downloading') {
      setCurrentJob({
        ...currentJob,
        status: 'cancelled',
      });
      setIsDownloading(false);
    }
  };

  const handleClearHistory = () => {
    clearDownloadHistory();
    setHistory([]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1B294B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#648BFF] to-[#8975FF] flex items-center justify-center text-white shadow-lg shadow-[#648BFF]/25">
            <DownloadCloud className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
              Video Downloader & Media Hub
            </h1>
            <p className="text-xs text-[#7888A7]">
              Inspect media sources and download permitted direct video files (.mp4, .webm) or open original streams.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/downloads')}
          className="text-xs font-semibold text-[#648BFF] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>View My Saved Downloads</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main SnapYT-Inspired Downloader Card */}
      <div className="bg-[#0F1932] border border-[#1E2E54] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Supported Platforms Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-3 border-b border-[#1B294B]/60">
          <span className="text-[#7888A7] font-medium">Supported Platforms & Links:</span>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                detectedPlatform === 'direct'
                  ? 'bg-[#10B981]/25 text-[#34D399] border border-[#10B981]/40 shadow-sm shadow-[#10B981]/20'
                  : 'bg-[#152342] text-[#A9B5CE]'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Direct MP4 & WebM (Downloadable)</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                detectedPlatform === 'youtube'
                  ? 'bg-[#FF0000]/25 text-[#FF6464] border border-[#FF0000]/40 shadow-sm shadow-[#FF0000]/20'
                  : 'bg-[#152342] text-[#A9B5CE]'
              }`}
            >
              <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
              <span>YouTube & Shorts (Official Stream)</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                detectedPlatform === 'instagram'
                  ? 'bg-[#E1306C]/25 text-[#FF7EA5] border border-[#E1306C]/40 shadow-sm shadow-[#E1306C]/20'
                  : 'bg-[#152342] text-[#A9B5CE]'
              }`}
            >
              <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
              <span>Instagram Reels (Official Stream)</span>
            </span>
          </div>
        </div>

        {/* Input Form with Paste, Clear, and Fetch Video Buttons */}
        <form onSubmit={handleFetchVideo} className="space-y-4">
          <label className="block text-xs font-bold text-white uppercase tracking-wider">
            Video Link or Direct Media URL
          </label>

          <div className="relative flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setFetchError(null);
                }}
                placeholder="Paste your YouTube or Instagram video link"
                className="w-full h-12 pl-4 pr-20 rounded-xl bg-[#0A1224] border border-[#213560] focus:border-[#648BFF] text-xs sm:text-sm text-white placeholder-[#7888A7] focus:outline-none focus:ring-1 focus:ring-[#648BFF] transition-all"
              />

              {/* In-field Paste & Clear Controls */}
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {inputUrl ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 rounded-lg text-[#7888A7] hover:text-white hover:bg-[#1E3058] transition-colors cursor-pointer"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="px-2 py-1 rounded-lg bg-[#162340] hover:bg-[#1E3058] text-[#648BFF] hover:text-[#8CB1FF] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-3 h-3" />
                    <span>Paste</span>
                  </button>
                )}
              </div>
            </div>

            {/* Primary Fetch Video Button */}
            <button
              type="submit"
              disabled={!inputUrl.trim() || isLoading}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#648BFF] via-[#7B80FF] to-[#8975FF] hover:from-[#5277EC] hover:to-[#7663EE] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#648BFF]/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Fetch Video</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Links for Fast Testing */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-[#7888A7]">Test URLs:</span>
            <button
              type="button"
              onClick={() => {
                setInputUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
                setFetchError(null);
              }}
              className="text-[10px] px-2.5 py-1 rounded-md bg-[#162340] text-[#34D399] hover:bg-[#1E3058] transition-colors cursor-pointer border border-[#10B981]/30"
            >
              Direct MP4 Video (Downloadable)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputUrl('https://raw.githubusercontent.com/mdn/learning-area/master/html/multimedia-and-embedding/video-and-audio-content/rabbit320.webm');
                setFetchError(null);
              }}
              className="text-[10px] px-2.5 py-1 rounded-md bg-[#162340] text-[#34D399] hover:bg-[#1E3058] transition-colors cursor-pointer border border-[#10B981]/30"
            >
              Direct WebM Video (Downloadable)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputUrl('https://www.youtube.com/shorts/6gaBapTzE7c');
                setFetchError(null);
              }}
              className="text-[10px] px-2.5 py-1 rounded-md bg-[#162340] text-[#FF6464] hover:bg-[#1E3058] transition-colors cursor-pointer border border-[#FF0000]/30"
            >
              YouTube Shorts (6gaBapTzE7c)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputUrl('https://www.youtube.com/watch?v=0jrc0g1j7X0');
                setFetchError(null);
              }}
              className="text-[10px] px-2.5 py-1 rounded-md bg-[#162340] text-[#FF6464] hover:bg-[#1E3058] transition-colors cursor-pointer border border-[#FF0000]/30"
            >
              YouTube Video
            </button>
            <button
              type="button"
              onClick={() => {
                setInputUrl('https://www.instagram.com/reel/DFsampleReelId/');
                setFetchError(null);
              }}
              className="text-[10px] px-2.5 py-1 rounded-md bg-[#162340] text-[#FF7EA5] hover:bg-[#1E3058] transition-colors cursor-pointer border border-[#E1306C]/30"
            >
              Instagram Reel
            </button>
          </div>
        </form>

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="py-8 text-center space-y-3 bg-[#0A1224] rounded-2xl border border-[#1E2E54]">
            <Loader2 className="w-8 h-8 text-[#648BFF] animate-spin mx-auto" />
            <div className="text-xs font-semibold text-white">
              Checking media link & inspecting available formats...
            </div>
            <p className="text-[11px] text-[#7888A7]">
              Validating platform headers and verified streams.
            </p>
          </div>
        )}

        {/* Error Message */}
        {fetchError && (
          <div className="p-4 rounded-2xl bg-[#FF4572]/15 border border-[#FF4572]/40 text-xs text-[#FF708F] flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">Media Access Notice</div>
              <p className="leading-relaxed">{fetchError}</p>
            </div>
          </div>
        )}

        {/* Video Preview Card */}
        {videoData && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0A1224] border border-[#253A6B] space-y-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              {/* Thumbnail with Platform Badge */}
              <div className="relative w-full sm:w-56 h-36 rounded-xl overflow-hidden bg-[#152342] shrink-0 border border-[#213560] group">
                <img
                  src={videoData.thumbnailUrl}
                  alt={videoData.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=640&q=80';
                  }}
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                  {videoData.platform === 'youtube' && <Youtube className="w-3 h-3 text-[#FF0000]" />}
                  {videoData.platform === 'instagram' && <Instagram className="w-3 h-3 text-[#E1306C]" />}
                  {videoData.platform === 'direct' && <Film className="w-3 h-3 text-[#10B981]" />}
                  <span>{videoData.platformLabel}</span>
                </div>

                {videoData.duration && (
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-white">
                    {videoData.duration}
                  </div>
                )}
              </div>

              {/* Details & Metadata */}
              <div className="flex-1 space-y-2.5 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
                    {videoData.title}
                  </h3>
                </div>

                {videoData.author && (
                  <p className="text-xs text-[#A9B5CE] flex items-center gap-1.5">
                    <span className="text-[#7888A7]">Author / Source:</span>
                    <span className="font-semibold text-white">{videoData.author}</span>
                  </p>
                )}

                {videoData.fileSizeBytes ? (
                  <p className="text-xs text-[#A9B5CE] flex items-center gap-1.5">
                    <span className="text-[#7888A7]">Verified File Size:</span>
                    <span className="font-semibold text-[#10B981]">
                      {(videoData.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </p>
                ) : null}

                {videoData.mimeType && (
                  <p className="text-xs text-[#A9B5CE] flex items-center gap-1.5">
                    <span className="text-[#7888A7]">Container:</span>
                    <span className="font-mono text-[11px] text-[#B8A2FF]">{videoData.mimeType}</span>
                  </p>
                )}

                {/* Status Indicator Pill */}
                <div className="pt-1">
                  {videoData.isDirectDownloadable ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-[11px] font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready for Direct Download</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF4572]/15 border border-[#FF4572]/30 text-[#FF708F] text-[11px] font-semibold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Direct Download Unavailable (Platform Protected)</span>
                    </span>
                  )}
                </div>

                {videoData.warning && (
                  <div className="p-2.5 rounded-xl bg-[#FF4572]/10 border border-[#FF4572]/30 text-[11px] text-[#FF708F] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{videoData.warning}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CASE A: Direct Media File -> Show verified format options & Working DOWNLOAD Button */}
            {videoData.isDirectDownloadable && (
              <div className="space-y-4 pt-3 border-t border-[#1E2E54]">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Verified Available Media Format
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {videoData.formats.map((fmt) => {
                      const isSelected = selectedFormat?.id === fmt.id;
                      return (
                        <div
                          key={fmt.id}
                          className="p-3.5 rounded-xl bg-[#152342] border border-[#10B981]/50 text-white shadow-md shadow-[#10B981]/10 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold">
                              <span>{fmt.label}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#34D399]">
                                Verified
                              </span>
                            </div>
                            <div className="text-[11px] text-[#7888A7] mt-0.5">
                              {fmt.fileSizeEstimate} · {fmt.note}
                            </div>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Working Download Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleAction}
                    disabled={isDownloading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:from-[#0EA371] hover:to-[#036246] disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#10B981]/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <DownloadCloud className="w-5 h-5" />
                    <span>
                      {isDownloading
                        ? 'Downloading Video File...'
                        : videoData.actionButtonLabel}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* CASE B: YouTube or Instagram -> Clear explanatory policy message & OPEN ON PLATFORM Button */}
            {!videoData.isDirectDownloadable && (
              <div className="space-y-4 pt-3 border-t border-[#1E2E54]">
                {/* Platform Limitation Notice */}
                <div className="p-4 rounded-2xl bg-[#162340] border border-[#213560] text-xs text-[#A9B5CE] space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Info className="w-4 h-4 text-[#648BFF]" />
                    <span>Direct Download Unavailable for this Link</span>
                  </div>
                  <p className="leading-relaxed text-[#7888A7]">
                    {videoData.policyNotice}
                  </p>
                </div>

                {/* Official Platform Button (Open on YouTube / Open on Instagram) */}
                <div>
                  <button
                    type="button"
                    onClick={handleAction}
                    className={`w-full py-4 rounded-xl text-white font-bold text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                      videoData.platform === 'youtube'
                        ? 'bg-gradient-to-r from-[#FF0000] to-[#CC0000] hover:from-[#E60000] hover:to-[#B30000] shadow-[#FF0000]/25'
                        : 'bg-gradient-to-r from-[#E1306C] via-[#C13584] to-[#833AB4] hover:opacity-95 shadow-[#E1306C]/25'
                    }`}
                  >
                    {videoData.platform === 'youtube' ? (
                      <Youtube className="w-5 h-5" />
                    ) : (
                      <Instagram className="w-5 h-5" />
                    )}
                    <span>{videoData.actionButtonLabel}</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Active Download Progress Card */}
        {currentJob && (
          <div className="p-5 rounded-2xl bg-[#0A1224] border border-[#253A6B] space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileVideo className="w-5 h-5 text-[#10B981]" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{currentJob.title}</h4>
                  <div className="text-[11px] text-[#7888A7]">
                    {currentJob.quality} · {currentJob.format} · Provider: {currentJob.provider}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    currentJob.status === 'completed'
                      ? 'bg-[#10B981]/20 text-[#10B981]'
                      : currentJob.status === 'cancelled'
                      ? 'bg-[#FF4572]/20 text-[#FF708F]'
                      : 'bg-[#10B981]/20 text-[#10B981] animate-pulse'
                  }`}
                >
                  {currentJob.status}
                </span>

                {currentJob.status === 'downloading' && (
                  <button
                    onClick={handleCancelJob}
                    className="p-1 text-[#FF708F] hover:bg-[#FF4572]/20 rounded transition-colors cursor-pointer"
                    title="Cancel download"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-[#152342] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#648BFF] to-[#10B981] transition-all duration-300 rounded-full"
                  style={{ width: `${currentJob.progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-[#A9B5CE]">
                <span>
                  {(currentJob.downloadedBytes / (1024 * 1024)).toFixed(1)} MB /{' '}
                  {(currentJob.totalBytes / (1024 * 1024)).toFixed(1)} MB ({currentJob.progressPercent}%)
                </span>
                <span>
                  {currentJob.status === 'downloading'
                    ? `${currentJob.speed}`
                    : currentJob.status === 'completed'
                    ? 'Saved directly to your computer Downloads'
                    : ''}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Download History Section */}
      <div className="bg-[#0F1932] border border-[#1E2E54] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#B8A2FF]" />
            <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
              Download History ({history.length})
            </h3>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-[#7888A7] hover:text-[#FF708F] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-[#7888A7] text-center py-8">
            No downloads recorded in this session.
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0A1224] border border-[#1B294B] hover:border-[#213560] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#152342] text-[#648BFF] flex items-center justify-center shrink-0">
                    <FileVideo className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate max-w-[280px] sm:max-w-md">
                      {job.title}
                    </div>
                    <div className="text-[10px] text-[#7888A7]">
                      {job.outputFileName} · {(job.totalBytes / (1024 * 1024)).toFixed(1)} MB · {job.quality} · Provider: {job.provider}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] font-semibold">
                    Completed
                  </span>
                  <button
                    onClick={() => {
                      if (job.sourceUrl && job.sourceUrl.startsWith('http')) {
                        performRealDownload(job.sourceUrl, job.outputFileName, () => {});
                      } else {
                        triggerBrowserFileDownload(job.outputFileName, `AN.FLIX Media Export [${job.title}]`);
                      }
                    }}
                    className="text-xs text-[#648BFF] font-semibold hover:underline cursor-pointer"
                  >
                    Re-download
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
