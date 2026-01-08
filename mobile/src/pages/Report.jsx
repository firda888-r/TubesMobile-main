import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Camera, MapPin, Send } from 'lucide-react';
import L from 'leaflet';
import { useAuth } from "../context/AuthContext"; // Import Auth
import { useNavigate } from 'react-router-dom';

// Fix Icon Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

export default function Report() {
  const { user } = useAuth(); // Ambil User Asli
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cat_name: '',
    description: '',
    reporterContact: '',
    locationDetail: ''
  });

  // Cari Lokasi GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Cek Login
    if (!user) {
      alert("Silakan login dulu untuk melapor!");
      navigate('/login');
      return;
    }

    if (!photo || !position) {
      alert("Mohon sertakan foto dan lokasi di peta!");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('user_id', user.id); // <--- PAKAI USER ID ASLI
    data.append('cat_name', formData.cat_name || 'Kucing Tanpa Nama');
    data.append('description', formData.description);
    data.append('reporterContact', formData.reporterContact);
    data.append('location', `${formData.locationDetail} (Lat: ${position.lat}, Lng: ${position.lng})`);
    data.append('photos', photo);
    
    // Dummy fields
    data.append('age', 'Unknown');
    data.append('gender', 'Unknown');
    data.append('breeds', 'Unknown');

    try {
      await axios.post('http://localhost:5000/api/reports', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Laporan berhasil dikirim!");
      navigate('/status'); // Pindah ke tab status
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim laporan. Cek koneksi backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="min-h-screen bg-[#f7f1e8] pt-20 pb-24 px-4">
      <View className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <View className="bg-[#ED8B3C] p-6 text-white text-center">
          <Text className="text-2xl font-bold">Lapor Rescue</Text>
          <Text className="text-orange-100 text-sm">Bantu kucing terlantar mendapatkan pertolongan.</Text>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Foto */}
          <View>
            <label className="block text-sm font-bold text-gray-700 mb-2">Foto Kondisi Kucing</label>
            <View className="relative w-full h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <View className="text-center text-gray-400 p-4">
                  <Camera size={40} className="mx-auto mb-2" />
                  <Text className="text-sm">Klik ambil foto</Text>
                </div>
              )}
              <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
          </div>

          {/* Peta */}
          <View>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16} /> Lokasi</label>
            <View className="h-64 rounded-xl overflow-hidden border border-gray-200 z-0 relative">
              {position ? (
                <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="h-full w-full">
                  <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              ) : <View className="h-full flex items-center justify-center bg-gray-100 text-gray-400">Loading GPS...</div>}
            </div>
          </div>

          {/* Input Text */}
          <input type="text" placeholder="Nama/Ciri-ciri" className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.cat_name} onChange={e => setFormData({...formData, cat_name: e.target.value})} />
          <input type="text" placeholder="Detail Lokasi" required className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.locationDetail} onChange={e => setFormData({...formData, locationDetail: e.target.value})} />
          <input type="text" placeholder="No WA Pelapor" required className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.reporterContact} onChange={e => setFormData({...formData, reporterContact: e.target.value})} />
          <textarea rows="2" placeholder="Kondisi kucing..." className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>

          <button type="submit" disabled={loading} className="w-full py-4 bg-[#ED8B3C] text-white font-bold rounded-xl hover:bg-orange-600 disabled:bg-gray-400">
            {loading ? 'Mengirim...' : <><Send size={20} className="inline mr-2"/> Kirim Laporan</>}
          </button>
        </form>
      </div>
    </div>
  );
}