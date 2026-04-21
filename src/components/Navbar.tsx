'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Clock, Star, LogOut, Menu, X, Zap, Sparkles } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface NavbarProps {
  user: UserProfile;
}

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  basic: 'bg-blue-100 text-blue-700',
  pro: 'bg-violet-100 text-violet-700',
  premium: 'bg-amber-100 text-amber-700',
};

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/create', label: 'Tailor Resume', icon: Sparkles },
    { href: '/history', label: 'History', icon: Clock },
    { href: '/pricing', label: 'Pricing', icon: Star },
  ];

  const creditPercent = Math.round((user.credits / (user.creditsLimit || 1)) * 100);
  const planLabel = user.plan.charAt(0).toUpperCase() + user.plan.slice(1);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Zap size={18} />
            </div>
            <span className="font-bold text-gray-900 text-lg">ResumeTailor</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Credits */}
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLAN_COLORS[user.plan]}`}>
                  {planLabel}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {user.credits}
                  <span className="text-gray-400 font-normal">/{user.creditsLimit} credits</span>
                </span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-primary-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${creditPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pb-4">
          <div className="pt-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === href ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
                <span>{user.credits}/{user.creditsLimit} credits</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLAN_COLORS[user.plan]}`}>
                  {planLabel}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
