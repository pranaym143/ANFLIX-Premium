import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { Footer } from './Footer';
import { useTheme } from '../../context/ThemeContext';

export const AppShell: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-row overflow-x-hidden transition-colors duration-200 ${
        theme === 'light' ? 'bg-[#F4F6FB] text-[#0F172A]' : 'bg-[#070D1C] text-[#F4F5FF]'
      }`}
    >
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed top-0 bottom-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out bg-[#070D1C] shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopNavigation onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-5">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
