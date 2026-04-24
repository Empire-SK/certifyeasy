'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface CSVRow {
  name: string;
  eventName: string;
  certificateId: string;
  issueDate: string;
}

export default function CSVUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const data = results.data as CSVRow[];
          
          if (!data.length) {
            setResult({ type: 'error', message: 'CSV file is empty' });
            return;
          }

          const res = await fetch('/api/upload-certificates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ certificates: data }),
          });

          const responseData = await res.json();

          if (!res.ok) {
            setResult({ type: 'error', message: responseData.message || 'Failed to upload certificates' });
            return;
          }

          setResult({ 
            type: 'success', 
            message: `Successfully uploaded ${responseData.uploadedCount} certificates. Skipped ${responseData.skippedCount} duplicates.` 
          });

          // Dispatch event to notify parent components to refresh
          window.dispatchEvent(new Event('certificates-uploaded'));

        } catch (error) {
          setResult({ type: 'error', message: 'Network error during upload' });
        } finally {
          setUploading(false);
          // Reset file input
          e.target.value = '';
        }
      },
      error: () => {
        setResult({ type: 'error', message: 'Failed to parse CSV file' });
        setUploading(false);
        e.target.value = '';
      }
    });
  };

  return (
    <div className="w-full">
      <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-10 bg-gray-50 hover:bg-gray-100 transition-colors text-center">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
        />
        <div className="flex flex-col items-center justify-center gap-4">
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">Processing CSV...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <p className="text-sm font-bold text-gray-500">Drag & Drop your CSV or <span className="text-blue-600">Click to Browse</span></p>
            </>
          )}
        </div>
      </div>

      {result && (
        <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
          result.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {result.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {result.message}
        </div>
      )}
    </div>
  );
}
