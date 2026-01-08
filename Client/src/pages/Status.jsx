import { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, Ticket, Siren, MapPin, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from "../context/AuthContext"; // Import Auth

export default function Status() {
  // 1. Ambil User dari Context
  const { user } = useAuth();

  // State Data
  const [adoptions, setAdoptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('adoptions');

  // 2. useEffect: Hanya jalan kalau user ada
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Menggunakan user.id yang asli dari login
      const [resAdoptions, resReports] = await Promise.all([
        axios.get(`http://localhost:5000/api/my-adoptions/${user.id}`),
        axios.get(`http://localhost:5000/api/my-reports/${user.id}`)
      ]);
      
      setAdoptions(resAdoptions.data);
      setReports(resReports.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC BADGE STATUS ---
  const getAdoptionBadge = (status) => {
    switch(status) {
      case 'Disetujui': return { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Disetujui' };
      case 'Ditolak': return { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Ditolak' };
      default: return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Menunggu Verifikasi' };
    }
  };

  const getReportBadge = (status) => {
    const s = status || 'Diterima'; 
    switch(s) {
      case 'Selesai': return { color: 'bg-blue-100 text-blue-700', icon: CheckCircle, label: 'Selesai Dievakuasi' };
      case 'Diproses': return { color: 'bg-orange-100 text-orange-700', icon: Siren, label: 'Tim OTW Lokasi' };
      default: return { color: 'bg-gray-100 text-gray-600', icon: Clock, label: 'Laporan Diterima' };
    }
  };

  // 3. Pengecekan Login (DI DALAM FUNGSI)
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f1e8] px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
          <h2 className="text-xl font-bold mb-2">Kamu belum login</h2>
          <p className="text-gray-500 mb-6">Silakan login untuk melihat riwayat aktivitasmu.</p>
          <a href="/login" className="px-6 py-3 bg-[#ED8B3C] text-white font-bold rounded-xl shadow-md">
            Login Sekarang
          </a>
        </div>
      </div>
    );
  }

  // --- TAMPILAN UTAMA ---
  return (
    <div className="min-h-screen bg-[#f7f1e8] pt-20 pb-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-dark mb-6 pl-2 border-l-4 border-[#ED8B3C]">
          Aktivitas Saya
        </h1>

        <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <button
            onClick={() => setActiveTab('adoptions')}
            className={clsx("flex-1 py-2 text-sm font-bold rounded-lg transition-all", activeTab === 'adoptions' ? "bg-[#ED8B3C] text-white shadow-md" : "text-gray-400 hover:bg-gray-50")}
          >
            Adopsi
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={clsx("flex-1 py-2 text-sm font-bold rounded-lg transition-all", activeTab === 'reports' ? "bg-[#ED8B3C] text-white shadow-md" : "text-gray-400 hover:bg-gray-50")}
          >
            Laporan Rescue
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ED8B3C] mx-auto"></div></div>
        ) : (
          <div className="space-y-4">
            
            {/* LIST ADOPSI */}
            {activeTab === 'adoptions' && (
              adoptions.length === 0 ? (
                <EmptyState msg="Belum ada pengajuan adopsi." link="/adopt" btn="Cari Kucing" />
              ) : (
                adoptions.map((item) => {
                  const badge = getAdoptionBadge(item.status);
                  const Icon = badge.icon;
                  return (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                      <img 
                        // Adopsi ambil dari folder 'images'
                        src={item.cat_image ? `http://localhost:5000/images/${item.cat_image}` : '/images/home/kucing pesek.jpeg'} 
                        alt="Cat" 
                        className="w-20 h-20 rounded-xl object-cover bg-gray-100"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-dark">{item.cat_name}</h3>
                          <span className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-bold ${badge.color}`}>
                            <Icon size={10} /> {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">Tgl: {new Date(item.adoption_date).toLocaleDateString('id-ID')}</p>
                        
                        {item.status === 'Disetujui' && (
                          <button onClick={() => alert("QR Code Tiket Penjemputan")} className="w-full py-2 bg-[#ED8B3C] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2">
                            <Ticket size={14} /> Tiket Penjemputan
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )
            )}

            {/* LIST LAPORAN */}
            {activeTab === 'reports' && (
              reports.length === 0 ? (
                <EmptyState msg="Kamu belum pernah melapor." link="/report" btn="Lapor Sekarang" />
              ) : (
                reports.map((item) => {
                  const badge = getReportBadge(item.status);
                  const Icon = badge.icon;
                  let displayImage = '/images/home/milo.jpeg';
                  try {
                    const photos = JSON.parse(item.image);
                    if (photos && photos.length > 0) {
                      // Laporan ambil dari folder 'uploads'
                      displayImage = `http://localhost:5000/uploads/${photos[0]}`;
                    }
                  } catch (e) { /* ignore */ }

                  return (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex gap-4 mb-3">
                        <img src={displayImage} alt="Rescue" className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-bold ${badge.color}`}>
                              <Icon size={10} /> {badge.label}
                            </span>
                            <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                          </div>
                          <p className="text-sm font-bold text-dark line-clamp-1">{item.location}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            )}

          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ msg, link, btn }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Siren className="text-gray-300" />
      </div>
      <p className="text-gray-500 text-sm mb-4">{msg}</p>
      <a href={link} className="inline-flex items-center gap-2 px-4 py-2 bg-[#ED8B3C] text-white text-sm font-bold rounded-lg hover:bg-orange-600">
        {btn} <ArrowRight size={14} />
      </a>
    </div>
  );
}