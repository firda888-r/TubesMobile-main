import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Heart } from 'lucide-react';
import { useAuth } from "../context/AuthContext"; // Import Auth untuk cek login

export default function AdoptDetail() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const { user } = useAuth(); // Ambil data user yang sedang login
  
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil Data Detail Kucing
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/adoption/${id}`);
        // Normalisasi Gambar
        const data = res.data;
        data.image = data.image ? `http://localhost:5000/images/${data.image}` : '/images/home/milo.jpeg';
setCat(data);
      } catch (err) {
        console.error("Gagal ambil detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Handle Tombol Adopsi
  const handleAdopt = async () => {
    // 1. Cek Login
    if (!user) {
      alert("Silakan login terlebih dahulu untuk mengadopsi!");
      navigate('/login');
      return;
    }

    // 2. Konfirmasi
    const confirm = window.confirm(`Apakah kamu yakin ingin mengajukan adopsi untuk ${cat.name}?`);
    if (!confirm) return;

    try {
      // 3. Kirim ke Backend dengan ID User asli
      await axios.post('http://localhost:5000/api/adopt', {
        user_id: user.id,
        cat_id: cat.id
      });

      // 4. Sukses
      alert("Pengajuan berhasil! Silakan cek status di menu Status.");
      navigate('/status');

    } catch (err) {
      // 5. Error Handling
      console.error(err);
      alert(err.response?.data?.error || "Gagal mengajukan adopsi.");
    }
  };

  if (loading) return <div className="text-center pt-24">Loading...</div>;
  if (!cat) return <div className="text-center pt-24">Kucing tidak ditemukan 😿</div>;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Tombol Back & Gambar Header */}
      <div className="relative h-[40vh] md:h-[50vh] bg-gray-200">
        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-white transition"
        >
          <ArrowLeft size={24} className="text-[#2a2a2a]" />
        </button>
      </div>

      {/* Konten Detail */}
      <div className="px-6 py-6 -mt-6 bg-white rounded-t-3xl relative z-10 min-h-[50vh]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2a2a2a]">{cat.name}</h1>
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">Bandung, Jawa Barat</span>
            </div>
          </div>
          <div className="bg-orange-100 p-3 rounded-2xl">
            <Heart className="text-[#ED8B3C] fill-[#ED8B3C]" size={24} />
          </div>
        </div>

        {/* Statistik Kucing */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#f7f1e8] p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 uppercase">Usia</p>
            <p className="font-bold text-[#2a2a2a]">{cat.age} Tahun</p>
          </div>
          <div className="bg-[#f7f1e8] p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 uppercase">Gender</p>
            <p className="font-bold text-[#2a2a2a]">{cat.gender || 'Unknown'}</p>
          </div>
          <div className="bg-[#f7f1e8] p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 uppercase">Ras</p>
            <p className="font-bold text-[#2a2a2a] truncate">{cat.breed}</p>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#2a2a2a] mb-2">Tentang {cat.name}</h3>
          <p className="text-gray-600 leading-relaxed text-sm text-justify">
            {cat.description || "Tidak ada deskripsi tersedia untuk kucing ini."}
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="fixed bottom-20 left-0 w-full px-6 md:static md:px-0">
          <button 
            onClick={handleAdopt}
            className="w-full py-4 bg-[#ED8B3C] text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Ajukan Adopsi Sekarang
          </button>
        </div>

      </div>
    </div>
  );
}