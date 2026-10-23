/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Swal from 'sweetalert2';

interface Agenda {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  kategori: string;
  description?: string;
}

// Mapping warna kategori sesuai permintaanmu
const kategoriBadge: { [key: string]: { label: string; bg: string; text: string } } = {
  pengenalan: { label: 'Pengenalan Lingkungan', bg: 'bg-[#FDF6EC]', text: 'text-[#B45309]' }, // Cream
  asesmen_sumatif: { label: 'Asesmen Sumatif', bg: 'bg-emerald-50', text: 'text-emerald-700' }, // Hijau
  penyerahan_rapor: { label: 'Penyerahan Rapor', bg: 'bg-amber-50', text: 'text-amber-700' }, // Kuning
  libur_semester: { label: 'Libur Semester', bg: 'bg-pink-50', text: 'text-pink-700' }, // Pink
  libur_idul_fitri: { label: 'Libur Idul Fitri', bg: 'bg-orange-50', text: 'text-orange-700' }, // Orange
  ujian_madrasah: { label: 'Ujian Madrasah', bg: 'bg-teal-50', text: 'text-teal-700' }, // Hijau Muda
  libur_nasional: { label: 'Libur Nasional', bg: 'bg-red-50', text: 'text-red-700' }, // Merah
  lainnya: { label: 'Lainnya', bg: 'bg-gray-100', text: 'text-gray-700' }, // Abu-abu
};

function AgendaListContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [agendaList, setAgendaList] = useState<Agenda[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tangkap notifikasi sukses dari URL (Create/Update)
  useEffect(() => {
    const successParam = searchParams?.get('success');
    if (successParam === 'create') {
      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Agenda baru berhasil ditambahkan.', timer: 2000, showConfirmButton: false });
      router.replace('/mi/agenda');
    } else if (successParam === 'update') {
      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Agenda berhasil diperbarui.', timer: 2000, showConfirmButton: false });
      router.replace('/mi/agenda');
    }
  }, [searchParams, router]);

  // Fetch data agenda
  useEffect(() => {
    const token = localStorage.getItem('bearer_token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchAgenda = async () => {
      try {
        const response = await fetch('/api/admin/mi/agendas', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (response.ok && result.status === 1) {
          setAgendaList(result.data || []);
        } else if (response.status === 401) {
          localStorage.clear();
          router.push('/');
        }
      } catch (error) {
        console.error("Gagal mengambil data agenda:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgenda();
  }, [router]);

  // Fungsi Delete Agenda dengan SweetAlert2
  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: `Agenda "${title}" akan dihapus permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!confirmDelete.isConfirmed) return;

    const token = localStorage.getItem('bearer_token');
    try {
      const response = await fetch(`/api/admin/mi/agendas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setAgendaList(agendaList.filter(item => item._id !== id));
        Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Agenda berhasil dihapus.', timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire('Oops...', 'Gagal menghapus agenda.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan pada server.', 'error');
    }
  };

  const filteredAgenda = agendaList.filter(item => {
    // Ambil title atau judul, pastikan aman dari undefined
    const titleText = item.title || (item as any).judul || '';
    return titleText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* Header Halaman */}
        <div className="mb-8 flex justify-between items-center border-b border-amber-100/50 pb-5">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Agenda Madrasah</h1>
            <div className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              {filteredAgenda.length} Total Agenda
            </div>
          </div>
          
          <Link href="/mi/agenda/create" className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Tambah Agenda
          </Link>
        </div>

        {/* Card Tabel Area */}
        <div className="bg-white rounded-[1rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-amber-100/60 p-6">
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select className="border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-gray-50">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>entries</span>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Cari agenda kegiatan" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-gray-50 w-64 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#fcf8f5] text-gray-500 text-[11px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="py-4 px-6 border-b border-gray-100 w-16">NO</th>
                  <th className="py-4 px-6 border-b border-gray-100">JUDUL AGENDA</th>
                  <th className="py-4 px-6 border-b border-gray-100">KATEGORI & WARNA</th>
                  <th className="py-4 px-6 border-b border-gray-100">RENTANG WAKTU</th>
                  <th className="py-4 px-6 border-b border-gray-100 text-center w-32">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-10 text-center text-gray-400">Memuat data agenda...</td></tr>
                ) : filteredAgenda.length === 0 ? (
                  <tr><td colSpan={5} className="py-10 text-center text-gray-400">Tidak ada data agenda ditemukan.</td></tr>
                ) : (
                  filteredAgenda.map((item, index) => {
                    const badge = kategoriBadge[item.kategori] || kategoriBadge['lainnya'];
                    return (
                      <tr key={item._id} className="hover:bg-amber-50/20 transition-colors">
                        <td className="py-4 px-6 font-semibold text-gray-700">{index + 1}</td>
                        <td className="py-4 px-6 font-bold text-gray-900">{item.title || (item as any).judul}</td>
                        <td className="py-4 px-6">
                          <span className={`${badge.bg} ${badge.text} text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider border border-current/10`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 font-medium text-xs">
                          {new Date(item.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} 
                          {' s/d '} 
                          {new Date(item.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-3 text-gray-400">
                            {/* Tombol Edit */}
                            <Link href={`/mi/agenda/${item._id}/edit`} className="hover:text-blue-600 transition" title="Edit">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </Link>
                            {/* Tombol Delete */}
                            <button onClick={() => handleDelete(item._id, item.title)} className="hover:text-red-600 transition" title="Hapus">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Halaman 1</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed">Next</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function AgendaMIPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#faf6f3]">Memuat halaman agenda...</div>}>
      <AgendaListContent />
    </Suspense>
  );
}