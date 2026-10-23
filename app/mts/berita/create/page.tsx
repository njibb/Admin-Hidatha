/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Swal from 'sweetalert2';

export default function TambahBeritaMTs() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const unitcode = params?.unitcode || 'mts';

  // State untuk form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('bearer_token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('bearer_token');
      
      // Gunakan FormData karena kita mengirim file gambar + teks sekaligus
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`/api/admin/${unitcode}/berita`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Jangan set 'Content-Type' manual jika pakai FormData, browser akan atur otomatis
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data berita beserta gambar berhasil ditambahkan.',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          router.push(`/mts/berita`);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message || 'Gagal menambahkan berita.'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Jaringan',
        text: 'Terjadi kesalahan pada server.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        <div className="mb-8 flex items-center gap-4">
          <Link 
            href="/mts/berita" 
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-amber-800 hover:bg-amber-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tambah Berita</h1>
            <p className="text-sm text-gray-500 mt-0.5">Silakan isi detail form di bawah untuk membuat berita baru.</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-amber-100/60 p-8 max-w-5xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Judul Berita <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Kegiatan Manasik Haji Cilik"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Upload Gambar (Banner Berita)
              </label>
              <div className="flex items-center w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50/50 overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 transition-all cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Isi Konten Berita <span className="text-red-500">*</span>
              </label>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-600 transition-all">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-4 text-gray-500">
                  <span className="text-sm font-medium">Normal</span>
                  <div className="w-px h-5 bg-gray-300"></div>
                  <div className="flex items-center gap-3 font-semibold text-xs">
                    <span>B</span><span>I</span><span>U</span>
                  </div>
                </div>
                
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-64 p-4 text-sm text-gray-800 focus:outline-none resize-y"
                  placeholder="Ketik isi lengkap berita di sini..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <Link 
                href="/mts/berita"
                className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors"
              >
                Batal
              </Link>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#e3000f] hover:bg-[#c2000c] text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-red-500/20 disabled:bg-red-300"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Berita'}
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}