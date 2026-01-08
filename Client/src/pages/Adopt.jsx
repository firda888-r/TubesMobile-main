import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';

export default function Adopt() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter
  const [search, setSearch] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("Semua Ras");
  const [breeds, setBreeds] = useState([]);

  // 1. Ambil Data Kucing dari Backend
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cats');
        
        // Format Data & Gambar
        const formattedData = res.data.map(cat => ({
          ...cat,
          // Pastikan URL gambar valid
          image: cat.image ? `http://localhost:5000/images/${cat.image}` : '/images/home/milo.jpg'
        }));

        setCats(formattedData);
        
        // Ambil daftar ras unik untuk dropdown filter
        const uniqueBreeds = [...new Set(formattedData.map(c => c.breed).filter(Boolean))];
        setBreeds(uniqueBreeds);

      } catch (err) {
        console.error("Gagal ambil data kucing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  // 2. Logika Filter (Search + Dropdown)
  const filteredCats = cats.filter(cat => {
    const matchName = cat.name.toLowerCase().includes(search.toLowerCase());
    const matchBreed = selectedBreed === "Semua Ras" || cat.breed === selectedBreed;
    return matchName && matchBreed;
  });

  return (
    <div className="min-h-screen bg-secondary pt-24 pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Judul */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Temukan Teman Barumu</h1>
          <p className="text-gray-500">Kucing-kucing lucu ini menunggu rumah baru.</p>
        </div>

        {/* Filter Bar (Search & Select) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center border border-gray-100">
          
          {/* Input Pencarian */}
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Cari nama kucing..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Dropdown Ras */}
          <div className="relative w-full md:w-1/3">
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
            <select 
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="Semua Ras">Semua Ras</option>
              {breeds.map(breed => (
                <option key={breed} value={breed}>{breed}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Sedang memanggil kucing...</p>
          </div>
        )}

        {/* Grid Katalog Kucing */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredCats.length > 0 ? (
              filteredCats.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group border border-gray-100">
                  
                  {/* Foto Kucing */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-primary shadow-sm">
                      {cat.age} Thn
                    </div>
                  </div>

                  {/* Info Singkat */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-dark mb-1">{cat.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{cat.breed || 'Campuran'}</p>
                    
                    <Link 
                      to={`/adopt/${cat.id}`} 
                      className="block w-full py-2 bg-primary text-white text-center rounded-xl font-medium hover:bg-orange-600 active:scale-95 transition-all"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                Tidak ada kucing yang cocok dengan pencarianmu. 😿
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}