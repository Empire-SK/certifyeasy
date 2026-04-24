'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Upload,
  Award,
  BarChart3,
  FilePlus,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Admin Panel', href: '/admin', icon: FilePlus },
  { label: 'Upload CSV', href: '/admin/upload', icon: Upload },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ redirect: true, callbackUrl: '/admin/login' });
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-100 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-50 px-8 py-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-gray-900">CertifyEasy</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-6 py-6">
        <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Admin Controls
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          // exact match for /admin, prefix match for others
          const isActive =
            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-gray-50 px-6 py-6">
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50 disabled:opacity-50"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {isSigningOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
