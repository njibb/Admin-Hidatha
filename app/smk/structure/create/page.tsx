"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Swal from 'sweetalert2';

function CreateStrukturContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const unitcode = params?.unitcode || 'smk';

  // State Form Struktur
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [kategori, setKategori] = useState('walikelas'); // Default ke wali kelas/guru

  // Fungsi Submit Data ke Backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('bearer_token');
      
      const response = await fetch(`/api/admin/${unitcode}/structure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nama,
          jabatan,
          kategori
        })
      });

      const result = await response.json();

      if (response.ok && result.status === 1) {
        // Lempar kembali ke halaman tabel struktur dengan parameter success
        router.push(`/${unitcode}/structure?success=create`);
      } else {
        Swal.fire('Oops...', result.message || 'Gagal menambahkan pengurus.', 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating struktur:", error);
      Swal.fire('Error', 'Terjadi kesalahan pada server.', 'error');
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tambah Pengurus</h1>
            <p className="text-sm text-gray-500 mt-0.5">Isi form di bawah untuk menambahkan data pimpinan, dewan guru, atau staf pengurus.</p>
          </div>
        </div>

        {/* Card Form Utama */}
        <div className="bg-white rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-amber-100/60 p-8 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Nama Lengkap */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nama Lengkap & Gelar <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Contoh: Hj. Siti Aminah, S.Pd.AUD."
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            {/* Input Jabatan Spesifik */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Jabatan Spesifik <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Contoh: Kepala Sekolah SMK / Wali Kelas Kelompok A"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            {/* Dropdown Kategori & Posisi Bagan */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Kategori / Posisi di Bagan <span className="text-red-500">*</span>
              </label>
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
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium leading-relaxed">
                * Kategori ini akan menentukan secara otomatis di baris mana kotak nama pengurus muncul pada desain struktur website utama.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <Link 
                href={`/${unitcode}/struktur`}
                className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors"
              >
                Batal
              </Link>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-amber-800/20 disabled:bg-amber-800/50"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Pengurus'}
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}

export default function CreateStrukturSMK() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#faf6f3]">Memuat form...</div>}>
      <CreateStrukturContent />
    </Suspense>
  );
}