'use client';

import Image from 'next/image';

export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-[80px] rounded-lg shadow-md flex items-center gap-12 max-w-3xl w-full">
        {/* Teks kiri */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">
            You’re seeing this message because either you are not an admin or do not have permission to enter this page
          </p>
          <h1 className="text-3xl font-bold text-indigo-800 mb-6 leading-snug">
            You Are Not Authorized<br />to Acces This Page
          </h1>
          <button
            onClick={() => window.history.back()}
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-2 rounded transition"
          >
            Back
          </button>
        </div>

        {/* Gambar kanan */}
        <div className="flex-shrink-0">
          <Image
            src="/icon warning.svg" 
            alt="Warning Icon"
            width={200}
            height={200}
            priority
          />
        </div>
      </div>
    </div>
  );
}
