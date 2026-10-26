# AN.FLIX — Premium Anime Discovery Platform

> **Watch · Discover · Explore**  
> A completely public, cinematic, intelligent anime discovery platform. Visitors can explore anime, identify unfamiliar scenes from video links or screenshots, track releases, organize browser-local watchlists, and find authorized viewing options immediately without registration or login.

---

## 🚀 Public Architecture (No Login, No Database Backend)

1. **100% Free & Open Access**:
   - Zero login forms, signup popups, or authentication paywalls.
   - Immediate access to all anime catalog details, episodes, character dossiers, scene identification, and trailer downloads.

2. **Browser Local Storage**:
   - **Favorites**: Stored in `localStorage` (`anflix_public_favorites_v2`), persistent across browser refreshes on the same device.
   - **My Library**: Public watchlist tracker (`Watching`, `Completed`, `Plan to Watch`, `On Hold`, `Dropped`) with progress counters.
   - **Discovery History**: Visited titles stored locally with a 1-click purge button.
   - **Search History**: Recent search queries stored locally.
   - **Theme Preferences**: Cinematic dark or light mode persisted locally.

3. **Real Anime Metadata (AniList Open GraphQL API)**:
   - Queries `https://graphql.anilist.co` for real anime catalog entries, character rosters, studios, and scores.
   - Automatic local curated fallback for offline resilience.

4. **Multi-Engine Scene Identification**:
   - **Image Search**: Drag-and-drop screenshot recognition provider computing scene evidence, character recognition, likely episode numbers, and confidence scores.
   - **Video Link Search**: Analyzes public Instagram Reels, YouTube Shorts, and TikTok anime links with provider detection, keyframe analysis, and fallback to screenshot upload.

5. **Authorized Media Downloader**:
   - DRM & Terms of Service verification: Respects Widevine DRM and guides fans to official Crunchyroll/Netflix offline viewing apps.
   - Allows downloading authorized trailers, promotional PVs, and CC media.
   - Calculated byte-level progress simulation, cancellation, and browser file export.

6. **Future Google AdSense Integration (Disabled by Default)**:
   - Includes `<AdSenseSlot />` placements between homepage sections, inside updates, on detail pages, and above the footer.
   - Completely inert and zero-height by default (`VITE_ADSENSE_ENABLED="false"`). Zero fake ads, zero fake clicks.
   - When approved by Google AdSense, configure `VITE_ADSENSE_ENABLED="true"` and `VITE_ADSENSE_CLIENT_ID="ca-pub-..."`.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Check TypeScript typing
npm run lint

# Build for production
npm run build
```

---

## © License & Trademarks
All anime titles, character likenesses, and franchises are trademarks of their respective copyright holders, authors, and production committees.
