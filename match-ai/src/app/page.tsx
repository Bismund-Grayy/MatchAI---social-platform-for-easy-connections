import Display from "./display/display";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      
      {/* Card Container */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          MatchAI
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Find meaningful matches with AI
        </p>

        {/* Optional Display Component */}
        <div className="mb-6">
          <Display />
        </div>

        {/* Login/Register Button */}
        <Link href="/users">
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl transition">
            Login / Register
          </button>
        </Link>

        {/* Admin (small + subtle) */}
        <div className="text-center mt-4">
          <Link href="/admin" className="text-xs text-gray-400 hover:underline">
            Admin Access
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-xs text-gray-400">
          <p>support@matchai.com</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="https://youtube.com" className="hover:underline">YouTube</a>
            <a href="https://facebook.com" className="hover:underline">Facebook</a>
          </div>
        </footer>

      </div>
    </main>
  );
}