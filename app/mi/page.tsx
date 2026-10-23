"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar';

export default function DashboardMI() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ berita: 0, agenda: 0, struktur: 0, ppdb: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('bearer_token');
    const unitCode = localStorage.getItem('unit_code');
    const role = localStorage.getItem('user_role');
    
    if (!token) {
      router.push('/');
      return;
    }

    if (role !== 'superadmin' && unitCode !== 'mi') {
      alert("Akses Ditolak! Anda bukan Admin MI.");
      router.push('/dashboard');
      return;
    }

    const fetchStats = async () => {
      try {
        const [resBerita, resAgenda, resStruktur, resPpdb] = await Promise.all([
          fetch('/api/admin/mi/berita', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/mi/agendas', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/mi/structure', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/mi/ppdb', { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);
        
        const dataBerita = resBerita.ok ? await resBerita.json() : { data: [] };
        const dataAgenda = resAgenda.ok ? await resAgenda.json() : { data: [] };
        const dataStruktur = resStruktur.ok ? await resStruktur.json() : { data: [] };
        const dataPpdb = resPpdb.ok ? await resPpdb.json() : { data: [] };

        setStats({
          berita: dataBerita.data?.length || dataBerita.berita?.length || 0,
          agenda: dataAgenda.data?.length || dataAgenda.agendas?.length || 0,
          struktur: dataStruktur.data?.length || dataStruktur.structure?.length || 0,
          ppdb: dataPpdb.data?.length || dataPpdb.ppdb?.length || 0,
        });
      } catch (error) {
        console.error("Gagal mengambil statistik MI:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">Unit MI</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Dashboard <span className="text-amber-800">Unit MI</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Kelola berita, agenda, struktur organisasi, dan pendaftaran khusus untuk Madrasah Ibtidaiyah.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/mi/berita" className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300 transition group">
            <div className="flex justify-between items-center mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📰</div>
              <span className="text-3xl font-black text-gray-800">{isLoading ? '...' : stats.berita}</span>
            </div>
            <h3 className="font-bold text-gray-700">Kelola Berita</h3>
            <p className="text-xs text-gray-400 mt-1">Tambah, edit, hapus artikel berita MI.</p>
          </Link>

          <Link href="/mi/agenda" className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300 transition group">
            <div className="flex justify-between items-center mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📅</div>
              <span className="text-3xl font-black text-gray-800">{isLoading ? '...' : stats.agenda}</span>
            </div>
            <h3 className="font-bold text-gray-700">Kelola Agenda</h3>
            <p className="text-xs text-gray-400 mt-1">Jadwal kegiatan dan acara MI.</p>
          </Link>

          <Link href="/mi/structure" className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300 transition group">
            <div className="flex justify-between items-center mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👤</div>
              <span className="text-3xl font-black text-gray-800">{isLoading ? '...' : stats.struktur}</span>
            </div>
            <h3 className="font-bold text-gray-700">Kelola Struktur</h3>
            <p className="text-xs text-gray-400 mt-1">Data guru dan pengurus MI.</p>
          </Link>

          <Link href="/mi/ppdb" className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300 transition group">
            <div className="flex justify-between items-center mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🎓</div>
              <span className="text-3xl font-black text-gray-800">{isLoading ? '...' : stats.ppdb}</span>
            </div>
            <h3 className="font-bold text-gray-700">Kelola PPDB</h3>
            <p className="text-xs text-gray-400 mt-1">Data biaya dan pendaftaran siswa baru.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}