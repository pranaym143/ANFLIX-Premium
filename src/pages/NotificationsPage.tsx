import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, ArrowRight } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useLibrary();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1B294B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#648BFF]/20 text-[#648BFF] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-['Space_Grotesk']">
              Notification Center
            </h1>
            <p className="text-xs text-[#7888A7]">
              Release alerts, download task completions, and system updates.
            </p>
          </div>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="py-1.5 px-3 rounded-xl bg-[#162340] hover:bg-[#648BFF] text-[#A9B5CE] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              markNotificationRead(n.id);
              if (n.destinationPath) navigate(n.destinationPath);
            }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              n.read
                ? 'bg-[#0F1932] border-[#1E2E54] opacity-80'
                : 'bg-[#122040] border-[#648BFF]/50 shadow-lg shadow-[#648BFF]/10'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#648BFF] animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-[#A9B5CE] mt-1 leading-relaxed">{n.message}</p>
                <div className="text-[10px] text-[#7888A7] mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>

              {n.destinationPath && (
                <div className="p-2 text-[#648BFF] shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
