import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  ChevronDown,
  Building,
  HeartHandshake,
  Car,
  Shield,
  Check,
  Compass,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Navbar: React.FC<{ onToggleMobileMenu?: () => void }> = ({ onToggleMobileMenu }) => {
  const {
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationAsRead,
    setCurrentView,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleMeta: Record<UserRole, { label: string; icon: any; color: string; bg: string }> = {
    donor: { label: 'Donor Facility', icon: Building, color: 'text-purple-600', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    ngo: { label: 'NGO / Shelter', icon: HeartHandshake, color: 'text-sky-600', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
    volunteer: { label: 'Volunteer Hero', icon: Car, color: 'text-amber-600', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    admin: { label: 'Admin Command', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  };

  const CurrentRoleIcon = roleMeta[currentRole].icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-purple-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  ResQ<span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Plate</span>
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700">
                  RADAR
                </span>
              </div>
              <div className="text-[10px] text-slate-500 hidden sm:block -mt-0.5 font-medium">
                Food Surplus Interception Network
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-2xs"
            >
              <CurrentRoleIcon className={`w-3.5 h-3.5 ${roleMeta[currentRole].color}`} />
              <span className="hidden md:inline">{roleMeta[currentRole].label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <AnimatePresence>
              {showRoleMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs space-y-1 text-slate-700"
                >
                  <div className="px-2 py-1 text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                    Select Account Role
                  </div>
                  {(['donor', 'ngo', 'volunteer', 'admin'] as UserRole[]).map((r) => {
                    const Meta = roleMeta[r];
                    const Icon = Meta.icon;
                    const isCurrent = currentRole === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setCurrentRole(r);
                          setShowRoleMenu(false);
                          setCurrentView('dashboard');
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-purple-50 text-purple-900 font-semibold border border-purple-200'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${Meta.color}`} />
                          <span>{Meta.label}</span>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-purple-600" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications Bell & Drawer */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              className="relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors shadow-2xs"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {showNotifDrawer && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-slate-200 shadow-2xl p-4 z-50 text-xs space-y-3 text-slate-800"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <span>Live Dispatch Notifications</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono font-semibold">
                        {unreadCount} unread
                      </span>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                          n.read
                            ? 'bg-slate-50 border-slate-100 text-slate-500'
                            : 'bg-purple-50/70 border-purple-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-slate-900 text-[12px]">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
