import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdoptSlider from "../components/AdoptSlider";

export default function Home() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- PERUBAHAN IP DI SINI ---
    // Pastikan port backend Anda benar (5000 atau 8081 sesuai server.js Anda)
    fetch("http://192.168.64.218:5000/api/news") 
      .then((res) => res.json())
      .then((data) => setNewsData(data))
      .catch((err) => console.error("Error fetching news:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#f7f1e8] min-h-screen pb-24">
      
      {/* --- HERO SECTION (Porting dari Vue) --- */}
      <section className="relative flex flex-col-reverse lg:flex-row items-center min-h-[90vh] overflow-hidden">
        
        {/* Konten Teks (Kiri di Desktop, Bawah di HP) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-12 lg:py-0 text-center lg:text-left z-10">
          <div className="max-w-lg mx-auto lg:mx-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark leading-tight mb-6 font-sans">
              BRING HOME THE <br />
              <span className="text-primary">PURRFECT</span> FRIEND
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
              Kami merawat kucing terlantar dan mengobati mereka sehingga kamu bisa mengadopsi mereka dengan aman.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/adopt" className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 hover:scale-105 transition-all">
                Adopt Now
              </Link>
              <Link to="/report" className="px-8 py-3 bg-white text-primary border-2 border-primary font-bold rounded-xl hover:bg-orange-50 transition-all">
                Lapor Rescue
              </Link>
            </div>
          </div>
        </div>

        {/* Gambar Hero (Kanan di Desktop, Atas di HP) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          {/* Pastikan file ini ada di folder public/images/home/vector.png */}
          <img
            src="/images/home/vector.png" 
            alt="Hero Cat"
            className="w-full max-w-md lg:max-w-full lg:h-screen object-contain lg:object-cover drop-shadow-2xl"
          />
        </div>
      </section>

      {/* --- SLIDER SECTION --- */}
      <AdoptSlider />

      {/* --- NEWS SECTION (Placeholder Dulu) --- */}
      <section className="py-16 px-6">
    <h2 className="text-3xl font-bold text-dark mb-4 text-center">
      News About Us
    </h2>
    <p className="text-gray-500 text-center mb-10">
      Berita terbaru seputar kegiatan rescue dan adopsi.
    </p>

    <div className="grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
      {newsData.map((news) => (
        <div
          key={news.id}
          className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <img
            src={news.image}
            alt={news.title}
            className="h-40 w-full object-cover"
          />

          <div className="p-4">
            <p className="text-sm text-gray-400 mb-1">{news.date}</p>
            <h3 className="font-bold text-lg mb-2">{news.title}</h3>
            <p className="text-gray-600 text-sm">{news.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
    </div>
  );
}