import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Eğer token varsa otomatik olarak dashboard'a yönlendir
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Rapor Yönetim Sistemi</h1>
        <p className="text-gray-600 mb-6">Hoş geldiniz! Sisteme giriş yapabilirsiniz.</p>
        
        <Link href="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Giriş Yap
          </button>
        </Link>
      </div>
    </div>
  );
}
