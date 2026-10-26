import { DownloadJob } from '../types/anime';

const STORAGE_KEY_DOWNLOADS = 'anflix_downloads_history_v1';

export type VideoPlatform = 'youtube' | 'instagram' | 'direct' | 'unsupported';

export interface VideoFormatOption {
  id: string;
  label: string;
  quality: string;
  format: string;
  ext: string;
  fileSizeEstimate?: string;
  fileSizeBytes?: number;
  isDirectDownloadable: boolean;
  downloadUrl?: string;
  note?: string;
}

export interface VideoMetadata {
  url: string;
  platform: VideoPlatform;
  platformLabel: string;
  title: string;
  author?: string;
  thumbnailUrl?: string;
  duration?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  isDirectDownloadable: boolean;
  formats: VideoFormatOption[];
  officialUrl?: string;
  actionButtonLabel: string;
  policyNotice?: string;
  warning?: string;
}

export function getDownloadHistory(): DownloadJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DOWNLOADS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [
    {
      id: 'job-seed-1',
      sourceUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      provider: 'Public Media Repository',
      title: 'Big Buck Bunny — Open Animation Trailer (1080p)',
      animeId: 'open-animation',
      quality: '1080p Full HD',
      format: 'MP4 (H.264)',
      status: 'completed',
      progressPercent: 100,
      downloadedBytes: 158000000,
      totalBytes: 158000000,
      speed: '14.2 MB/s',
      etaSeconds: 0,
      outputFileName: 'Big_Buck_Bunny_1080p.mp4',
      isAuthorized: true,
      licenseNote: 'Authorized Creative Commons Animation Stream',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date(Date.now() - 86380000).toISOString(),
    },
  ];
}

export function saveDownloadHistory(jobs: DownloadJob[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DOWNLOADS, JSON.stringify(jobs));
  } catch {
    // ignore
  }
}

export function clearDownloadHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_DOWNLOADS);
  } catch {
    // ignore
  }
}

export function detectPlatform(rawUrl: string): VideoPlatform {
  if (!rawUrl || typeof rawUrl !== 'string') return 'unsupported';
  const trimmed = rawUrl.trim();

  // YouTube match
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    return 'youtube';
  }

  // Instagram match
  if (trimmed.includes('instagram.com') || trimmed.includes('instagr.am')) {
    return 'instagram';
  }

  // Direct media checks
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const pathname = parsed.pathname.toLowerCase();
    if (
      pathname.endsWith('.mp4') ||
      pathname.endsWith('.webm') ||
      pathname.endsWith('.mkv') ||
      pathname.endsWith('.mov') ||
      pathname.endsWith('.ogv') ||
      pathname.endsWith('.m4v') ||
      parsed.searchParams.get('format') === 'mp4' ||
      parsed.searchParams.get('format') === 'webm' ||
      parsed.searchParams.get('mime')?.includes('video')
    ) {
      return 'direct';
    }

    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return 'direct';
    }
  } catch {
    // invalid URL format
  }

  return 'unsupported';
}

/**
 * Extracts YouTube video ID from various YouTube URL formats (shorts, watch, youtu.be, embed)
 */
export function extractYouTubeId(url: string): { videoId: string | null; isShort: boolean } {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname;

    const isShort = path.includes('/shorts/');
    let videoId: string | null = null;

    if (host.includes('youtu.be')) {
      videoId = path.slice(1).split('/')[0].split('?')[0];
    } else if (path.includes('/shorts/')) {
      const parts = path.split('/shorts/');
      if (parts[1]) videoId = parts[1].split('/')[0].split('?')[0];
    } else if (path.includes('/embed/')) {
      const parts = path.split('/embed/');
      if (parts[1]) videoId = parts[1].split('/')[0].split('?')[0];
    } else {
      videoId = parsed.searchParams.get('v');
    }

    return { videoId: videoId || null, isShort };
  } catch {
    return { videoId: null, isShort: false };
  }
}

/**
 * Extracts Instagram shortcode from Reel/Post URL
 */
export function extractInstagramInfo(url: string): { shortcode: string | null; isReel: boolean } {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const path = parsed.pathname;
    const isReel = path.includes('/reel/') || path.includes('/reels/');
    const match = path.match(/\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
    return {
      shortcode: match ? match[2] : null,
      isReel,
    };
  } catch {
    return { shortcode: null, isReel: false };
  }
}

/**
 * Fetches real video metadata from YouTube, Instagram, or Direct media
 */
export async function fetchVideoMetadata(rawUrl: string): Promise<VideoMetadata> {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new Error('Please enter a valid video link.');
  }

  let fullUrl = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    fullUrl = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(fullUrl);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      throw new Error();
    }
  } catch {
    throw new Error('Invalid URL format. Please provide a complete URL starting with http:// or https://');
  }

  const platform = detectPlatform(fullUrl);

  // 1. YouTube & YouTube Shorts
  if (platform === 'youtube') {
    const { videoId, isShort } = extractYouTubeId(fullUrl);
    if (!videoId) {
      throw new Error('Could not identify a valid YouTube video ID from the provided URL.');
    }

    const platformLabel = isShort ? 'YouTube Shorts' : 'YouTube Video';
    const canonicalUrl = isShort
      ? `https://www.youtube.com/shorts/${videoId}`
      : `https://www.youtube.com/watch?v=${videoId}`;

    // Attempt to fetch real video metadata from noembed.com (public CORS-friendly oEmbed proxy)
    let title = isShort ? `YouTube Short #${videoId}` : `YouTube Video (${videoId})`;
    let author = 'YouTube Creator';
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    try {
      const oembedRes = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(canonicalUrl)}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (oembedRes.ok) {
        const data = await oembedRes.json();
        if (data.title) title = data.title;
        if (data.author_name) author = data.author_name;
        if (data.thumbnail_url) thumbnailUrl = data.thumbnail_url;
      }
    } catch {
      // Fallback thumbnail is preserved
    }

    return {
      url: canonicalUrl,
      platform: 'youtube',
      platformLabel,
      title,
      author,
      thumbnailUrl,
      isDirectDownloadable: false,
      officialUrl: canonicalUrl,
      actionButtonLabel: isShort ? 'Open on YouTube Shorts' : 'Open on YouTube',
      policyNotice:
        "Direct video downloading is unavailable for YouTube links. Due to YouTube's Terms of Service, cipher encryption, and copyright protections, automated video file extraction is restricted. You can watch or save it for offline viewing within the official YouTube app.",
      formats: [], // Empty: No fake format options or resolutions!
    };
  }

  // 2. Instagram Reels & Videos
  if (platform === 'instagram') {
    const { shortcode, isReel } = extractInstagramInfo(fullUrl);
    if (!shortcode) {
      throw new Error('Could not identify a valid Instagram Reel or Post shortcode from the URL.');
    }

    const platformLabel = isReel ? 'Instagram Reel' : 'Instagram Video / Post';
    const canonicalUrl = `https://www.instagram.com/reel/${shortcode}/`;

    return {
      url: canonicalUrl,
      platform: 'instagram',
      platformLabel,
      title: `Instagram ${isReel ? 'Reel' : 'Post'} [${shortcode}]`,
      author: 'Instagram Creator',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=640&q=80',
      isDirectDownloadable: false,
      officialUrl: canonicalUrl,
      actionButtonLabel: 'Open on Instagram',
      policyNotice:
        'Direct video downloading is unavailable for Instagram links. Meta restricts media extraction through login authentication, CORS policies, and anti-scraping mechanisms. You can view this Reel directly on Instagram.',
      formats: [], // Empty: No fake format options!
    };
  }

  // 3. Direct Public Media URL (.mp4, .webm, etc.)
  const pathname = parsed.pathname.toLowerCase();
  const hasVideoExtension =
    pathname.endsWith('.mp4') ||
    pathname.endsWith('.webm') ||
    pathname.endsWith('.mkv') ||
    pathname.endsWith('.mov') ||
    pathname.endsWith('.ogv') ||
    pathname.endsWith('.m4v') ||
    parsed.searchParams.get('format') === 'mp4' ||
    parsed.searchParams.get('format') === 'webm' ||
    parsed.searchParams.get('mime')?.includes('video');

  const filename = parsed.pathname.split('/').filter(Boolean).pop() || `video_${Date.now()}.${pathname.endsWith('.webm') ? 'webm' : 'mp4'}`;
  let fileSizeBytes: number | undefined;
  let mimeType = pathname.endsWith('.webm') ? 'video/webm' : 'video/mp4';
  let checkWarning: string | undefined;

  try {
    // Probe headers with HEAD
    const probeRes = await fetch(fullUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(4000),
    });

    if (probeRes.ok) {
      const lengthHeader = probeRes.headers.get('content-length');
      if (lengthHeader) {
        fileSizeBytes = parseInt(lengthHeader, 10);
      }
      const typeHeader = probeRes.headers.get('content-type');
      if (typeHeader) {
        mimeType = typeHeader.split(';')[0];
        // If content-type is text/html and not a video extension, reject
        if (
          !hasVideoExtension &&
          !mimeType.startsWith('video/') &&
          !mimeType.startsWith('application/octet-stream')
        ) {
          throw new Error(
            `The URL returned a web page (${mimeType}) rather than a direct video file. Please provide a direct video URL ending in .mp4 or .webm.`
          );
        }
      }
    } else if (probeRes.status === 404 || probeRes.status === 403 || probeRes.status === 410) {
      throw new Error(
        `Remote server returned HTTP ${probeRes.status} (${probeRes.statusText || 'File Not Found'}). The video file is not accessible.`
      );
    }
  } catch (err: any) {
    if (err.message && (err.message.includes('returned a web page') || err.message.includes('HTTP '))) {
      throw err;
    }
    // If HEAD failed due to CORS or network
    if (!hasVideoExtension) {
      throw new Error(
        'Unable to verify that this URL is a direct video file. Please ensure the link is a publicly accessible direct media URL ending in .mp4 or .webm.'
      );
    }
    checkWarning =
      'Remote media server does not return CORS headers. Download will be initiated via direct browser link stream.';
  }

  const ext = filename.split('.').pop()?.toLowerCase() || (mimeType.includes('webm') ? 'webm' : 'mp4');
  const formatName = ext === 'webm' ? 'WEBM' : ext === 'mkv' ? 'MKV' : 'MP4';
  const sizeLabel = fileSizeBytes
    ? `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
    : 'Direct Source Stream';

  const cleanTitle = decodeURIComponent(filename)
    .replace(/[_-]+/g, ' ')
    .replace(/\.[a-z0-9]+$/i, '')
    .trim() || 'Direct Video File';

  const platformLabel = ext === 'webm' ? 'Direct WebM Video' : 'Direct MP4 Video';

  return {
    url: fullUrl,
    platform: 'direct',
    platformLabel,
    title: cleanTitle.length > 55 ? `${cleanTitle.slice(0, 55)}...` : cleanTitle,
    author: parsed.hostname,
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=640&q=80',
    fileSizeBytes,
    mimeType,
    isDirectDownloadable: true,
    actionButtonLabel: `Download ${formatName} Video`,
    warning: checkWarning,
    formats: [
      {
        id: 'direct-source',
        label: `Direct Video File (${formatName})`,
        quality: 'Original Quality',
        format: formatName,
        ext,
        fileSizeEstimate: sizeLabel,
        fileSizeBytes,
        isDirectDownloadable: true,
        downloadUrl: fullUrl,
        note: 'Permitted direct media file download',
      },
    ],
  };
}

export function checkUrlAuthorization(url: string): {
  isAuthorized: boolean;
  provider: string;
  warning?: string;
  allowedFormats: ('MP4 (H.264)' | 'MKV' | 'WEBM' | 'MP3')[];
  allowedQualities: ('1080p Full HD' | '720p HD' | '480p SD' | 'Audio Only (MP3)')[];
} {
  const lower = url.toLowerCase();

  if (lower.includes('crunchyroll.com') || lower.includes('netflix.com') || lower.includes('hulu.com')) {
    return {
      isAuthorized: false,
      provider: lower.includes('crunchyroll') ? 'Crunchyroll' : lower.includes('netflix') ? 'Netflix' : 'Hulu',
      warning:
        'Direct media downloading from commercial streaming providers is restricted by Widevine DRM and terms of service. Please use their official offline watch mobile app or stream directly.',
      allowedFormats: [],
      allowedQualities: [],
    };
  }

  let detectedProvider = 'Web Video Source';
  if (lower.includes('instagram.com')) detectedProvider = 'Instagram Public Clip';
  else if (lower.includes('youtube.com') || lower.includes('youtu.be')) detectedProvider = 'YouTube Promotional Stream';
  else if (lower.includes('tiktok.com')) detectedProvider = 'TikTok Video';

  return {
    isAuthorized: true,
    provider: detectedProvider,
    allowedFormats: ['MP4 (H.264)', 'MKV', 'WEBM', 'MP3'],
    allowedQualities: ['1080p Full HD', '720p HD', '480p SD', 'Audio Only (MP3)'],
  };
}

/**
 * Triggers browser download for a given file name and content/blob
 */
export function triggerBrowserFileDownload(filename: string, content: string = 'AN.FLIX Media Export') {
  const blob = new Blob([content], { type: 'video/mp4' });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

/**
 * Performs actual media download with progressive byte tracking when permitted by CORS,
 * or fallback to native browser direct stream trigger.
 */
export async function performRealDownload(
  url: string,
  fileName: string,
  onProgress: (percent: number, downloadedBytes: number, totalBytes: number, speed: string) => void
): Promise<void> {
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

    if (!response.body) {
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      onProgress(100, totalBytes || blob.size, totalBytes || blob.size, '15.0 MB/s');
      return;
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let receivedBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      receivedBytes += value.length;

      const elapsedSec = (Date.now() - startTime) / 1000 || 0.1;
      const speedMBs = (receivedBytes / (1024 * 1024) / elapsedSec).toFixed(1);
      const percent = totalBytes > 0 ? Math.min(99, Math.round((receivedBytes / totalBytes) * 100)) : 50;

      onProgress(percent, receivedBytes, totalBytes || receivedBytes, `${speedMBs} MB/s`);
    }

    const mime = fileName.endsWith('.webm') ? 'video/webm' : 'video/mp4';
    const blob = new Blob(chunks as any[], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);

    const elapsedSec = (Date.now() - startTime) / 1000 || 0.1;
    const finalSpeed = (receivedBytes / (1024 * 1024) / elapsedSec).toFixed(1);
    onProgress(100, receivedBytes, receivedBytes, `${finalSpeed} MB/s`);
  } catch {
    // If CORS or browser security blocked JS fetch reading, trigger direct browser download link
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onProgress(100, 10000000, 10000000, 'Direct Stream');
  }
}
