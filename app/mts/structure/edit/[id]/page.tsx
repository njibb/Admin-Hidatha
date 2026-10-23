"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Swal from 'sweetalert2';

function EditStrukturContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const router = useRouter();
  const params = useParams();
  const unitcode = params?.unitcode || 'mts';
  const id = params?.id;

  // State Form Struktur
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [kategori, setKategori] = useState('walikelas');

  // Ambil data yang mau diedit ketika halaman pertama kali dibuka
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const token = localStorage.getItem('bearer_token');
        const response = await fetch(`/api/admin/${unitcode}/structure/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();

        if (response.ok && result.status === 1) {
          // Masukkan data lama ke dalam form
          setNama(result.data.nama);
          setJabatan(result.data.jabatan);
          setKategori(result.data.kategori);
        } else {
          Swal.fire('Error', 'Gagal memuat data pengurus.', 'error');
        }
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire('Error', 'Kesalahan koneksi ke server.', 'error');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchExistingData();
  }, [id, unitcode]);

  // Fungsi Submit Data Hasil Edit (Menggunakan PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('bearer_token');
      
      const response = await fetch(`/api/admin/${unitcode}/structure/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nama, jabatan, kategori })
      });

      const result = await response.json();

      if (response.ok && result.status === 1) {
        router.push(`/${unitcode}/structure?success=edit`);
      } else {
        Swal.fire('Oops...', result.message || 'Gagal mengubah pengurus.', 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating struktur:", error);
      Swal.fire('Error', 'Terjadi kesalahan pada server.', 'error');
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="min-h-screen flex items-center justify-center bg-[#faf6f3] font-bold text-gray-500">Memuat data pengurus...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* Header Halaman */}
        <div className="mb-8 flex items-center gap-4">
          <Link 
            href={`/${unitcode}/structure`}
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-amber-800 hover:bg-amber-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Edit Pengurus</h1>
            <p className="text-sm text-gray-500 mt-0.5">Ubah data pimpinan, dewan guru, atau staf pengurus yang sudah ada.</p>
          </div>
        </div>

        {/* Card Form Utama */}
        <div className="bg-white rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-amber-100/60 p-8 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap & Gelar <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Jabatan Spesifik <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategori / Posisi di Bagan <span className="text-red-500">*</span></label>
              <select 
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white font-medium"
              >
                <option value="pimpinan">Pucuk Pimpinan (Level Teratas / Baris 1)</option>
                <option value="komite">Komite (Level 2 / Baris 2)</option>
                <option value="wakil_tu">Wakil Kepala & Staf Tata Usaha (Level 3 / Baris 3)</option>
                <option value="walikelas">Jajaran Wali Kelas & Guru (Level 4 / Baris Bawah)</option>
              </select>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <Link 
                href={`/${unitcode}/structure`}
                className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors"
              >
                Batal
              </Link>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-amber-800/20 disabled:bg-amber-800/50"
              >
                {isLoading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default function EditStrukturMTs() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#faf6f3]">Memuat form...</div>}>
      <EditStrukturContent />
    </Suspense>
  );
}