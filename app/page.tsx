/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok && result.status === 1) {
        // 1. Simpan Token dan data sesi ke LocalStorage browser
        localStorage.setItem('bearer_token', result.data.token);
        localStorage.setItem('user_role', result.data.role);
        localStorage.setItem('unit_code', result.data.unitCode);
        localStorage.setItem('user_name', result.data.name);

        // 2. Arahkan ke Master Dashboard
        router.push('/dashboard');
      } else {
        setErrorMsg(result.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any ) {
      setErrorMsg('Terjadi kesalahan jaringan atau server mati.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#faf6f3]">
      
      <div className="absolute top-[-15%] left-[-10%] w-[40rem] h-[40rem] bg-amber-200/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[45rem] h-[45rem] bg-orange-200/40 rounded-full mix-blend-multiply filter blur-[150px] opacity-70 pointer-events-none"></div>

      <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[420px] relative z-10 mx-4">
        
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-9 h-9 bg-amber-800 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-sm">
            H
          </div>
          <span className="font-extrabold text-xl tracking-widest text-gray-900">
            HIDATHA
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back!</h1>
          <p className="text-xs text-gray-400">Silakan login dengan akun admin unit Anda.</p>
        </div>
        
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mb-6 rounded-xl text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-2 ml-1">Email Admin</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#f4f7fb] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-700"
              placeholder="admin.tk@yayasan.sch.id"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-2 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#f4f7fb] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-gray-700 pr-12"
                placeholder="••••••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3.5 rounded-xl transition-colors duration-200 disabled:bg-amber-800/60 disabled:cursor-not-allowed mt-4 shadow-md shadow-amber-800/20"
          >
            {isLoading ? 'Memverifikasi...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}