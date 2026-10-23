/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function AdminStrukturMTSPage() {
  const unitCode = "mts";
  const [strukturList, setStrukturList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch Data dari Backend (DENGAN TOKEN LOGIN)
  const fetchStruktur = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token"); // Ambil token dari storage
      const response = await fetch(`/api/admin/${unitCode}/structure`, {
        cache: "no-store",
        headers: {
          "Authorization": `Bearer ${token}`, // Kirim token ke backend
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (response.ok && result.status === 1) {
        setStrukturList(result.data || []);
      } else {
        console.error("Ditolak Server:", result.message);
      }
    } catch (error) {
      console.error("Gagal mengambil data struktur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStruktur();
  }, []);

  // Fungsi Hapus Pengurus (DENGAN TOKEN LOGIN)
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data pengurus ini akan dihapus dari bagan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#853502",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("bearer_token"); // Ambil token
        const response = await fetch(`/api/admin/${unitCode}/structure/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`, // Kirim token saat menghapus
          }
        });
        const result = await response.json();
        
        if (response.ok && result.status === 1) {
          Swal.fire("Terhapus!", "Data pengurus berhasil dihapus.", "success");
          fetchStruktur(); // Refresh tabel setelah hapus
        } else {
          Swal.fire("Gagal!", result.message || "Gagal menghapus data.", "error");
        }
      } catch (error) {
        console.error("Error deleting structure:", error);
        Swal.fire("Error!", "Terjadi kesalahan pada sistem.", "error");
      }
    }
  };

  const getKategoriBadge = (kategori: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      pimpinan: { label: "Pucuk Pimpinan", color: "bg-red-50 text-red-700 border-red-200" },
      komite: { label: "Komite", color: "bg-amber-50 text-amber-700 border-amber-200" },
      wakil_tu: { label: "Wakil & Staf TU", color: "bg-blue-50 text-blue-700 border-blue-200" },
      walikelas: { label: "Wali Kelas / Guru", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    };
    const b = badges[kategori] || { label: kategori, color: "bg-gray-50 text-gray-700 border-gray-200" };

    return (
      <span className={`px-3 py-1 rounded-md text-xs font-bold border ${b.color}`}>
        {b.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex">
      {/* Sidebar Admin Kiri */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content dengan Margin Left Dinamis sesuai status Sidebar */}
      <main
        className={`flex-1 transition-all duration-300 p-8 w-full ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header Halaman */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Struktur Kepengurusan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola data pimpinan, dewan guru, dan staf pengurus MTs Hidayatut Thalibin
            </p>
          </div>
          <Link
            href="/mts/structure/create"
            className="bg-[#853502] hover:bg-[#6c2b02] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Pengurus
          </Link>
        </div>

        {/* Card Tabel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-4 w-12 text-center">NO</th>
                  <th className="pb-4">NAMA PENGURUS & GELAR</th>
                  <th className="pb-4">JABATAN SPESIFIK</th>
                  <th className="pb-4">KATEGORI & POSISI BAGAN</th>
                  <th className="pb-4 text-center w-24">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Memuat data pengurus...
                    </td>
                  </tr>
                ) : strukturList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Belum ada data kepengurusan.
                    </td>
                  </tr>
                ) : (
                  strukturList.map((item, idx) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-semibold text-gray-500 text-center">{idx + 1}</td>
                      <td className="py-4 font-bold text-gray-900">{item.nama}</td>
                      <td className="py-4 text-gray-600">{item.jabatan}</td>
                      <td className="py-4">{getKategoriBadge(item.kategori)}</td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                           href={`/${unitCode}/structure/edit/${item._id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                          title="Edit"
                          >
                          <Pencil className="w-4 h-4" />
                           </Link>   
                          <button 
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}