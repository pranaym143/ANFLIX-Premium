import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LibraryProvider } from './context/LibraryContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { HomePage } from './pages/HomePage';
import { UpdatesPage } from './pages/UpdatesPage';
import { TrendingPage } from './pages/TrendingPage';
import { SearchPage } from './pages/SearchPage';
import { FilterPage } from './pages/FilterPage';
import { AnimeDetailPage } from './pages/AnimeDetailPage';
import { EpisodePage } from './pages/EpisodePage';
import { LibraryPage } from './pages/LibraryPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HistoryPage } from './pages/HistoryPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <LibraryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppShell />}>
              {/* Public Discovery Routes */}
              <Route index element={<HomePage />} />
              <Route path="updates" element={<UpdatesPage />} />
              <Route path="trending" element={<TrendingPage />} />

              {/* Anime Search, Advanced Filter & Scene Identification */}
              <Route path="filter" element={<FilterPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="search/image" element={<SearchPage />} />
              <Route path="search/link" element={<Navigate to="/search" replace />} />

              {/* Anime & Episode Pages */}
              <Route path="anime/:animeId" element={<AnimeDetailPage />} />
              <Route path="anime/:animeId/episodes" element={<AnimeDetailPage />} />
              <Route path="episode/:episodeId" element={<EpisodePage />} />

              {/* Redirect any legacy download routes to home */}
              <Route path="download" element={<Navigate to="/" replace />} />
              <Route path="downloads" element={<Navigate to="/" replace />} />

              {/* Public Client-side Library & Collections */}
              <Route path="library" element={<LibraryPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />

              {/* Public Informational & Policy Pages */}
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LibraryProvider>
    </ThemeProvider>
  );
}
