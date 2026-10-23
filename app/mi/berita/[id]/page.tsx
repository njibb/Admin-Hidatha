/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';

// 1. Komponen Utama dipindah ke dalam sini
function DetailBeritaContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [beritaDetail, setBeritaDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const unitcode = params?.unitcode || 'mi';

  useEffect(() => {
    const token = localStorage.getItem('bearer_token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchDetailBerita = async () => {
      if (!id) return;
      setIsLoading(true);
      
      try {
        const response = await fetch(`/api/admin/${unitcode}/berita/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const result = await response.json();
        
        if (response.ok && result.status === 1) {
          setBeritaDetail(result.data.berita);
        } else {
          setErrorMsg(result.message || "Gagal memuat detail berita dari server.");
        }
      } catch (error) {
        console.error("Gagal mengambil detail berita:", error);
        setErrorMsg("Terjadi kesalahan jaringan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailBerita();
  }, [id, unitcode, router]);

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        <div className="mb-8 flex items-center gap-4">
          <Link 
            href="/mi/berita" 
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-amber-800 hover:bg-amber-50 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Detail Berita</h1>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-[1.25rem] border border-amber-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8 max-w-4xl">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-500 font-medium">Sedang memuat detail berita...</p>
            </div>
          ) : beritaDetail ? (
            <div className="space-y-8">
              
              <div className="border-b border-gray-100 pb-6">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                  {beritaDetail.title}
                </h1>
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  Diposting pada: {beritaDetail.createdAt ? new Date(beritaDetail.createdAt).toLocaleString('id-ID') : '-'}
                </p>
              </div>

              {beritaDetail.image ? (
                <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                  <img src={beritaDetail.image} alt={beritaDetail.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-48 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 text-sm font-medium">
                  Tidak ada gambar banner yang diunggah
                </div>
              )}

              <div className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                {beritaDetail.content}
              </div>

            </div>
          ) : (
            <div className="py-20 text-center text-gray-500 font-medium">Data detail berita tidak ditemukan.</div>
          )}
        </div>

      </main>
    </div>
  );
}

// 2. Bungkus dengan Suspense sebagai pembungkus utama ekspor
export default function DetailBeritaMI() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#faf6f3]">Memuat halaman...</div>}>
      <DetailBeritaContent />
    </Suspense>
  );
}