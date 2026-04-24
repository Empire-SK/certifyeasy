'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShieldCheck, ArrowLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Certificate {
  id: string;
  certificateId: string;
  name: string;
  eventName: string;
  issueDate: string;
}

interface IssuerProfile {
  name: string;
}

export default function VerifyPage() {
  const params = useParams();
  const certificateId = params.certificateId as string;
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [issuer, setIssuer] = useState<IssuerProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (certificateId) {
      Promise.all([
        fetch(`/api/verify/${certificateId}`).then(res => {
          if (!res.ok) throw new Error('Certificate not found');
          return res.json();
        }),
        fetch('/api/issuer-profile').then(res => res.json()).catch(() => ({ name: 'Tech Academy' }))
      ])
      .then(([certData, issuerData]) => {
        setCertificate(certData);
        setIssuer(issuerData);
      })
      .catch(err => {
        setError(err.message || 'Error verifying certificate');
        setCertificate(null);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [certificateId]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] font-sans selection:bg-blue-100">
      {/* Top Bar matching the image exactly */}
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#6D28D9]" />
          <span className="text-xl font-black text-slate-900 tracking-tight">CertifyEasy</span>
        </div>
      </header>

      {/* Sub Bar */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-5xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#475569] hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Verify Another
          </Link>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-20 px-4 sm:px-6">
        {loading ? (
          <div className="w-full max-w-4xl bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#6D28D9] animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Verifying Record...</p>
          </div>
        ) : certificate ? (
          <>
            <div className="w-full max-w-5xl lg:max-w-6xl bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-12 md:p-20 lg:p-24 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] md:text-xs font-bold border border-[#A7F3D0] mb-8 md:mb-12">
                <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" /> Verified Authentic
              </div>

              {/* Subheading */}
              <div className="text-[8px] md:text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] md:tracking-[0.3em] mb-8 md:mb-12">
                Official Credential Record
              </div>

              {/* Recipient */}
              <p className="text-xs md:text-sm font-medium text-[#94A3B8] italic mb-3 md:mb-4">
                This is to certify that
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[#0F172A] tracking-tight mb-8 md:mb-10 break-words">
                {certificate.name}
              </h1>

              {/* Event/Course */}
              <p className="text-xs md:text-sm font-medium text-[#94A3B8] italic mb-3 md:mb-4">
                has successfully completed the program in
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-[2.5rem] leading-tight font-black text-[#4F46E5] uppercase tracking-tight mb-10 md:mb-16">
                {certificate.eventName}
              </h2>

              {/* Footer Section */}
              <div className="border-t border-gray-100 pt-8 md:pt-10 mt-6 md:mt-8 flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-4 items-center">
                
                {/* Certificate ID */}
                <div className="flex flex-col items-center md:items-start w-full">
                  <span className="text-[9px] md:text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2 md:mb-3">
                    Certificate ID
                  </span>
                  <div className="bg-[#F8FAFC] px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-gray-200 text-xs md:text-sm font-bold italic text-[#334155] break-all max-w-full">
                    {certificate.certificateId}
                  </div>
                </div>

                {/* Issuer */}
                <div className="flex flex-col items-center w-full">
                  <span className="text-sm md:text-base font-bold text-[#0F172A] mb-1">
                    {issuer?.name || 'Tech Academy'}
                  </span>
                  <span className="text-[8px] md:text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">
                    Authorized Issuer
                  </span>
                </div>

                {/* Date */}
                <div className="flex flex-col items-center md:items-end w-full">
                  <span className="text-[9px] md:text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2 md:mb-3">
                    Date of Issue
                  </span>
                  <span className="text-base md:text-lg font-black text-[#0F172A]">
                    {certificate.issueDate}
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-8 text-[8px] md:text-[9px] font-bold text-[#94A3B8] uppercase tracking-[0.15em] md:tracking-[0.2em] text-center px-4">
              Digital Credential Verified by CertifyEasy Secure Protocol
            </div>
          </>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-16 text-center animate-in slide-in-from-bottom-8 duration-500">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Record Not Found</h2>
            <p className="text-slate-500 mb-8">{error}</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Try Another ID
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
