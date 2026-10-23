"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Swal from 'sweetalert2';

interface Berita {
  _id: string;
  title: string;
  createdAt?: string; 
  asalData?: string;
}

export default function BeritaMIPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('bearer_token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchBerita = async () => {
      try {
        const response = await fetch('/api/admin/mi/berita', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        if (response.ok && result.status === 1) {
          setBeritaList(result.data || result.berita || []);
        } else if (response.status === 401) {
          localStorage.clear();
          router.push('/');
        }
      } catch (error) {
        console.error("Gagal mengambil data berita:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBerita();
  }, [router]);

  // Fungsi Hapus Data Berita dengan SweetAlert2
  const handleDelete = async (id: string, title: string) => {
    // 1. Munculkan Popup Konfirmasi (Yes/No)
    const confirmDelete = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: `Berita "${title}" tidak bisa dikembalikan setelah dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', // Warna merah untuk tombol hapus
      cancelButtonColor: '#6b7280',  // Warna abu-abu untuk tombol batal
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    // Jika admin klik 'Batal', hentikan proses
    if (!confirmDelete.isConfirmed) return;

    // Jika admin klik 'Ya, Hapus!', jalankan proses hapus ke API
    const token = localStorage.getItem('bearer_token');
    try {
      // Panggil API Delete
      const response = await fetch(`/api/admin/mi/berita/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Hapus data dari tampilan tabel tanpa perlu refresh halaman
        setBeritaList(beritaList.filter(berita => berita._id !== id));
        
        // 2. Munculkan Notifikasi Sukses
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Berita berhasil dihapus.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal menghapus berita dari database.'
        });
      }
    } catch (error) {
      console.error('Error deleting:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error Jaringan',
        text: 'Terjadi kesalahan pada server.'
      });
    }
  };

  // Filter pencarian
  const filteredBerita = beritaList.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 p-10 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* Header Halaman */}
        <div className="mb-8 flex justify-between items-center border-b border-amber-100/50 pb-5">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Berita</h1>
            <div className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              {filteredBerita.length} Total Data
            </div>
          </div>
          
          <Link href="/mi/berita/create" className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Tambah Berita
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
                placeholder="Cari data berita" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-gray-50 w-64 transition-all"
              />
            </div>
          </div>

          {/* Tabel Utama */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#fcf8f5] text-gray-500 text-[11px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="py-4 px-6 border-b border-gray-100 w-16">NO</th>
                  <th className="py-4 px-6 border-b border-gray-100">JUDUL BERITA</th>
                  <th className="py-4 px-6 border-b border-gray-100">ASAL DATA</th>
                  <th className="py-4 px-6 border-b border-gray-100">WAKTU POSTING</th>
                  <th className="py-4 px-6 border-b border-gray-100 text-center w-32">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-10 text-center text-gray-400">Memuat data...</td></tr>
                ) : filteredBerita.length === 0 ? (
                  <tr><td colSpan={5} className="py-10 text-center text-gray-400">Tidak ada data berita.</td></tr>
                ) : (
                  filteredBerita.map((berita, index) => (
                    <tr key={berita._id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-700">{index + 1}</td>
                      <td className="py-4 px-6 font-bold text-gray-900">{berita.title}</td>
                      <td className="py-4 px-6">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {berita.asalData || 'MANUAL'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {berita.createdAt ? new Date(berita.createdAt).toLocaleString('id-ID') : 'Baru saja'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3 text-gray-400">
                          {/* Tombol Read */}
                          <Link href={`/mi/berita/${berita._id}`} className="hover:text-amber-600 transition" title="Lihat">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </Link>
                          {/* Tombol Edit */}
                          <Link href={`/mi/berita/${berita._id}/edit`} className="hover:text-blue-600 transition" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </Link>
                          {/* Tombol Delete */}
                          <button onClick={() => handleDelete(berita._id, berita.title)} className="hover:text-red-600 transition" title="Hapus">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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