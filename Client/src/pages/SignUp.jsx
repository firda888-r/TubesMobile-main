import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Gagal daftar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f1e8] px-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#ED8B3C] mb-6">Buat Akun Baru 🚀</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Nama Lengkap" required className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="text" placeholder="No. HP" required className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <button type="submit" className="w-full py-3 bg-[#ED8B3C] text-white font-bold rounded-xl hover:bg-orange-600">Daftar</button>
        </form>
        <p className="mt-6 text-center text-gray-500 text-sm">Sudah punya akun? <Link to="/login" className="text-[#ED8B3C] font-bold">Login</Link></p>
      </div>
    </div>
  );
}