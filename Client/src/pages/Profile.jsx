import { useAuth } from "../context/AuthContext";
import { LogOut, User, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f1e8] px-4 pb-20">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Kamu belum login</h1>
        <Link to="/login" className="px-8 py-3 bg-[#ED8B3C] text-white font-bold rounded-xl shadow-md">Login Sekarang</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f1e8] pt-24 px-4 pb-24">
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-400 to-[#ED8B3C] p-8 text-center text-white">
          <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold border-4 border-white/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-orange-100">{user.role || 'Adopter'}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <Mail className="text-gray-400" />
            <div><p className="text-xs text-gray-400 uppercase">Email</p><p className="font-medium">{user.email}</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <Phone className="text-gray-400" />
            <div><p className="text-xs text-gray-400 uppercase">No. HP</p><p className="font-medium">{user.phone || '-'}</p></div>
          </div>
          <button onClick={logout} className="w-full py-4 mt-8 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 flex items-center justify-center gap-2">
            <LogOut size={20} /> Keluar (Logout)
          </button>
        </div>
      </div>
    </div>
  );
}