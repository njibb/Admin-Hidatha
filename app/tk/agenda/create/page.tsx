"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Swal from 'sweetalert2';

function CreateAgendaContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const unitcode = params?.unitcode || 'tk';

  // State Form Agenda
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [kategori, setKategori] = useState('pengenalan');
  const [description, setDescription] = useState('');

  // Fungsi Submit Data ke Backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('bearer_token');
      
      const response = await fetch(`/api/admin/${unitcode}/agendas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          startDate,
          endDate: endDate || startDate, // Jika tanggal akhir kosong, samakan dengan tanggal mulai
          kategori,
          description
        })
      });

      const result = await response.json();

      if (response.ok && result.status === 1) {
        // Lempar kembali ke halaman tabel dengan parameter success=create
        router.push(`/tk/agenda?success=create`);
      } else {
        Swal.fire('Oops...', result.message || 'Gagal menambahkan agenda.', 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating agenda:", error);
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
            href="/tk/agenda" 
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-amber-800 hover:bg-amber-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tambah Agenda Madrasah</h1>
            <p className="text-sm text-gray-500 mt-0.5">Isi form di bawah untuk menjadwalkan kegiatan atau hari libur baru.</p>
          </div>
        </div>

        {/* Card Form Utama */}
        <div className="bg-white rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-amber-100/60 p-8 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Judul Agenda */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Judul Agenda / Kegiatan <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Contoh: Libur Semester Ganjil / Ujian Madrasah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white"
                required
              />
            </div>

            {/* Grid Rentang Waktu (Tanggal Mulai & Selesai) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white"
                  required
                />
                <p className="text-[11px] text-gray-400 mt-1">Jika hanya 1 hari, samakan dengan tanggal mulai.</p>
              </div>
            </div>

            {/* Dropdown Kategori & Indikator Warna */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Kategori Kegiatan & Indikator Warna <span className="text-red-500">*</span>
              </label>
              <select 
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white font-medium"
              >
                <option value="pengenalan">🟠 Pengenalan Lingkungan Madrasah </option>
                <option value="asesmen_sumatif">🟢 Asesmen Sumatif Akhir Madrasah </option>
                <option value="penyerahan_rapor">🟡 Penyerahan Laporan Hasil Belajar / Rapor </option>
                <option value="libur_semester">🟣 Libur Semester </option>
                <option value="libur_idul_fitri">🟠 Libur Hari Raya Idul Fitri </option>
                <option value="ujian_madrasah">🟢 Rentang Ujian Madrasah </option>
                <option value="libur_nasional">🔴 Hari Libur Nasional Keagamaan </option>
                <option value="lainnya">⚪ Lainnya / Kegiatan Umum </option>
              </select>
            </div>

            {/* Textarea Keterangan Tambahan */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Keterangan / Catatan Tambahan (Opsional)
              </label>
              <textarea 
                placeholder="Tambahkan detail atau informasi tambahan jika diperlukan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white resize-y"
              ></textarea>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <Link 
                href="/tk/agenda"
                className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors"
              >
                Batal
              </Link>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-amber-800/20 disabled:bg-amber-800/50"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Agenda'}
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}

export default function CreateAgendaTK() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#faf6f3]">Memuat form...</div>}>
      <CreateAgendaContent />
    </Suspense>
  );
}