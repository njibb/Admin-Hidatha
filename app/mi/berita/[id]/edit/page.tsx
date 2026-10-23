/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Swal from 'sweetalert2';

function EditBeritaContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const unitcode = params?.unitcode || 'mi';

  // State untuk form input
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 1. Fetch data lama saat halaman pertama kali dibuka
  useEffect(() => {
    const token = localStorage.getItem('bearer_token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchBeritaLama = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/admin/${unitcode}/berita/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();

        if (response.ok && result.status === 1) {
          const data = result.data.berita;
          // Isi state dengan data lama dari database
          setTitle(data.title || '');
          setContent(data.content || '');
          setExistingImage(data.image || null);
        } else {
          Swal.fire('Gagal', 'Gagal memuat data berita.', 'error');
        }
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchBeritaLama();
  }, [id, unitcode, router]);

  // 2. Fungsi saat tombol Simpan ditekan (Kirim data via PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('bearer_token');
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      // Jika ada file gambar baru yang dipilih, masukkan ke form
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`/api/admin/${unitcode}/berita/${id}`, {
        method: 'PUT', // Kita pakai PUT karena ini proses UPDATE data
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Berita berhasil diperbarui.',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          router.push('/mi/berita');
        });
      } else {
        Swal.fire('Oops...', result.message || 'Gagal mengupdate berita.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan pada server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* Header ala Logeeka */}
        <div className="mb-8 flex items-center gap-4">
          <Link 
            href="/mi/berita" 
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-amber-800 hover:bg-amber-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Edit Berita</h1>
            <p className="text-sm text-gray-500 mt-0.5">Ubah detail form di bawah untuk memperbarui berita.</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-amber-100/60 p-8 max-w-5xl">
          {isFetching ? (
            <div className="py-20 text-center text-gray-500 font-medium">Memuat data berita lama...</div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              
              {/* Input Judul */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Judul Berita <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white"
                  required
                />
              </div>

              {/* Input & Preview Gambar */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Banner Gambar Berita
                </label>
                
                {/* Preview Gambar Lama (Jika Ada) */}
                {existingImage && (
                  <div className="mb-3 flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <img src={existingImage} alt="Preview" className="w-20 h-16 object-cover rounded-lg border" />
                    <div>
                      <p className="text-xs font-bold text-gray-700">Gambar Saat Ini:</p>
                      <p className="text-[11px] text-gray-400 truncate max-w-xs">{existingImage}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50/50 overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 transition-all cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengganti gambar lama.</p>
              </div>

              {/* Input Konten */}
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
                    required
                  ></textarea>
                </div>
              </div>

              {/* Area Tombol */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <Link 
                  href="/mi/berita"
                  className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Batal
                </Link>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-[#e3000f] hover:bg-[#c2000c] text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-red-500/20 disabled:bg-red-300"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

            </form>
          )}
        </div>

      </main>
    </div>
  );
}

// 3. Wajib dibungkus Suspense karena pakai useParams()
export default function EditBeritaMI() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#faf6f3]">Memuat halaman edit...</div>}>
      <EditBeritaContent />
    </Suspense>
  );
}