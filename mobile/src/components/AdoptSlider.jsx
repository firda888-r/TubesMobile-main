import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import CSS Swiper (Wajib)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function AdoptSlider() {
  const [kittens, setKittens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ambil data kucing dari Backend
  useEffect(() => {
    const fetchKittens = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cats'); // Pastikan port backend benar
        
        // Format URL gambar agar sesuai dengan folder public/uploads server
        const formattedData = response.data.map(cat => ({
          ...cat,
          // Logika gambar: Jika dari upload user vs aset bawaan
          imageUrl: cat.image_url || (cat.image && cat.image.startsWith('/images') ? cat.image : null)
        }));
        
        setKittens(formattedData);
      } catch (err) {
        console.error("Gagal ambil data kucing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKittens();
  }, []);

  if (loading) return <div className="text-center py-10">Memuat data kucing...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto py-10 bg-secondary text-center">
      
      {/* Judul Section */}
      <h2 className="text-3xl font-extrabold text-dark mb-8 font-sans">
        ADOPT UR KITTEN HERE
      </h2>

      {/* Slider Swiper */}
      {kittens.length === 0 ? (
        <p className="text-gray-500">Belum ada kucing yang siap diadopsi.</p>
      ) : (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          loop={kittens.length > 3}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-12 px-4"
        >
          {kittens.map((cat) => (
            <SwiperSlide key={cat.id} className="flex justify-center py-4">
              <div className="bg-[#f7f1e8] rounded-2xl shadow-lg overflow-hidden w-[280px] h-[380px] flex flex-col transform hover:scale-105 transition-transform duration-300 border border-gray-100">
                {/* Foto Kucing */}
                <img 
                  // Logika: Ambil dari folder images di server backend
                  src={cat.image ? `http://localhost:5000/images/${cat.image}` : "/images/home/kucing pesek.jpeg"} 
                  alt={cat.name} 
                  className="w-full h-[250px] object-cover"
                  onError={(e) => { e.target.src = "/images/home/kucing pesek.jpeg" }} // Fallback kalau gambar rusak
                />
                
                {/* Info Kucing */}
                <div className="p-4 text-left flex-grow bg-white/50 backdrop-blur-sm">
                  <p className="text-gray-500 text-sm mb-1">{cat.age ? `${cat.age} Tahun` : 'Usia ?'}</p>
                  <h3 className="text-xl font-bold text-dark">{cat.name}</h3>
                </div>

                {/* Tombol Detail (Overlay/Action) */}
                <button 
                  onClick={() => navigate(`/adopt`)} // Nanti diarahkan ke detail
                  className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition"
                >
                  ➝
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Tombol Lihat Lainnya */}
      <div className="mt-8">
        <Link to="/adopt" className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition-all">
          Lihat Lainnya
        </Link>
      </div>
    </div>
  );
}