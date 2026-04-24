import CertificateSearch from '@/components/CertificateSearch';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'CertifyEasy – Instant Certificate Verification',
  description:
    'Verify digital certificates instantly. Trusted by organizations worldwide for secure, blockchain-ready credential verification.',
};

const features = [
  {
    icon: ShieldCheck,
    title: 'Tamper-Proof',
    description: 'Every certificate is cryptographically secured and impossible to forge.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Verify any credential in under a second with our real-time lookup engine.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Globe,
    title: 'Globally Trusted',
    description: 'Used by 42+ organizations across 18 countries to issue verified credentials.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
];

const stats = [
  { value: '1,284+', label: 'Certificates Issued' },
  { value: '8,400+', label: 'Verifications Done' },
  { value: '42', label: 'Active Organizations' },
  { value: '99.9%', label: 'Uptime Guaranteed' },
];

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/' }),
    }).catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">CertifyEasy</span>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden pb-20 pt-20 sm:pt-28">
          {/* Background decorations */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
              style={{ background: 'radial-gradient(ellipse, #2563eb 0%, transparent 70%)' }}
            />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full opacity-5 blur-2xl"
              style={{ background: '#7c3aed' }}
            />
          </div>

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              Trusted Verification Platform
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Verify Any{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Certificate
              </span>{' '}
              in Seconds
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Enter a certificate ID and get instant, tamper-proof verification.
              Trusted by organizations worldwide to confirm the authenticity of
              digital credentials.
            </p>

            {/* Search Card */}
            <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                <Search className="h-4 w-4" />
                Certificate Lookup
              </div>
              <CertificateSearch />
              <p className="mt-4 text-xs text-slate-400">
                Example IDs: CERT-00001, CERT-00042
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats Strip ── */}
        <section className="border-y border-slate-100 bg-slate-50 py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-black text-slate-900">{s.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Why CertifyEasy?
              </h2>
              <p className="mt-4 text-slate-600">
                Built for speed, security, and scale — from day one.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, description, color, bg }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`mb-5 inline-flex rounded-xl p-3 ${bg}`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-slate-600">Three simple steps to verify a credential.</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: '01',
                  icon: FileText,
                  title: 'Get Your Certificate ID',
                  desc: 'Find the unique ID printed on or emailed with your certificate.',
                },
                {
                  step: '02',
                  icon: Search,
                  title: 'Enter & Search',
                  desc: 'Paste the ID in the search box above and click Verify.',
                },
                {
                  step: '03',
                  icon: Award,
                  title: 'Instant Result',
                  desc: 'View full certificate details — name, course, date, and issuer.',
                },
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="relative rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                  <span className="absolute right-6 top-6 text-5xl font-black text-slate-100 select-none">
                    {step}
                  </span>
                  <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-16 shadow-2xl shadow-blue-200">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
                <CheckCircle2 className="h-4 w-4" /> Ready to verify?
              </div>
              <h2 className="text-3xl font-black text-white sm:text-4xl">
                Start Verifying Instantly
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-white/80">
                No signup required. Just enter the certificate ID and get results in real time.
              </p>
              <Link
                href="/"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-blue-700 shadow-lg transition hover:scale-105 hover:shadow-xl"
              >
                Verify a Certificate <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">CertifyEasy</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} CertifyEasy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
