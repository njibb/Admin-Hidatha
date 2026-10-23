"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Swal from 'sweetalert2';

function EditAgendaContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const unitcode = params?.unitcode || 'mts';

  // State Form Agenda
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [kategori, setKategori] = useState('pengenalan');
  const [description, setDescription] = useState('');

  // 1. Ambil data agenda lama saat halaman pertama kali dibuka
  useEffect(() => {
    const token = localStorage.getItem('bearer_token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchAgendaLama = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/admin/${unitcode}/agendas/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();

        if (response.ok && result.status === 1) {
          const data = result.data.agenda;
          setTitle(data.title || '');
          // Format tanggal ke YYYY-MM-DD agar masuk ke <input type="date">
          setStartDate(data.startDate ? data.startDate.split('T')[0] : '');
          setEndDate(data.endDate ? data.endDate.split('T')[0] : '');
          setKategori(data.kategori || 'pengenalan');
          setDescription(data.description || '');
        } else {
          Swal.fire('Gagal', 'Gagal memuat data agenda.', 'error');
        }
      } catch (error) {
        console.error("Error fetching agenda:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAgendaLama();
  }, [id, unitcode, router]);

  // 2. Fungsi Kirim Update Data ke Backend (PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('bearer_token');
      
      const response = await fetch(`/api/admin/${unitcode}/agendas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          startDate,
          endDate: endDate || startDate,
          kategori,
          description
        })
      });

      const result = await response.json();

      if (response.ok && result.status === 1) {
        router.push(`/mts/agenda?success=update`);
      } else {
        Swal.fire('Oops...', result.message || 'Gagal memperbarui agenda.', 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating agenda:", error);
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
            href="/mts/agenda" 
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-amber-800 hover:bg-amber-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Edit Agenda Madrasah</h1>
            <p className="text-sm text-gray-500 mt-0.5">Ubah detail form di bawah untuk memperbarui jadwal kegiatan.</p>
          </div>
        </div>

        {/* Card Form Utama */}
        <div className="bg-white rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-amber-100/60 p-8 max-w-4xl">
          {isFetching ? (
            <div className="py-20 text-center text-gray-500 font-medium">Memuat data agenda lama...</div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              
              {/* Input Judul Agenda */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Judul Agenda / Kegiatan <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white"
                  required
                />
              </div>

              {/* Grid Rentang Waktu */}
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
                </div>
              </div>

              {/* Dropdown Kategori & Warna */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Kategori Kegiatan & Indikator Warna <span className="text-red-500">*</span>
                </label>
                <select 
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white font-medium"
                >
                  <option value="pengenalan_lingkungan">🟠 Pengenalan Lingkungan Madrasah (Cream)</option>
                  <option value="asesmen_sumatif">🟢 Asesmen Sumatif Akhir Madrasah (Hijau)</option>
                  <option value="penyerahan_rapor">🟡 Penyerahan Laporan Hasil Belajar / Rapor (Kuning)</option>
                  <option value="libur_semester">🟣 Libur Semester (Pink)</option>
                  <option value="libur_idul_fitri">🟠 Libur Hari Raya Idul Fitri (Orange)</option>
                  <option value="ujian_madrasah">🟢 Rentang Ujian Madrasah (Hijau Muda)</option>
                  <option value="libur_nasional">🔴 Hari Libur Nasional Keagamaan (Merah)</option>
                  <option value="lainnya">⚪ Lainnya / Kegiatan Umum (Abu-abu)</option>
                </select>
              </div>

              {/* Textarea Keterangan */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Keterangan / Catatan Tambahan (Opsional)
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-800 bg-gray-50/50 focus:bg-white resize-y"
                ></textarea>
              </div>

              {/* Tombol Aksi */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <Link 
                  href="/mts/agenda"
                  className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Batal
                </Link>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-amber-800/20 disabled:bg-amber-800/50"
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

export default function EditAgendaMTs() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#faf6f3]">Memuat halaman edit...</div>}>
      <EditAgendaContent />
    </Suspense>
  );
}