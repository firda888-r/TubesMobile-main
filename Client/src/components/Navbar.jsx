import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Cat, ClipboardList, Siren, User, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

// Ganti import ini nanti jika AuthContext sudah dibuat. 
// Untuk sekarang kita pakai dummy state agar UI tidak error.
const useAuth = () => {
  const [user, setUser] = useState(null); // Ganti null dengan { name: "Yassar" } untuk tes login
  const logout = () => setUser(null);
  return { user, isLoggedIn: !!user, logout };
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  
  // State untuk Scroll Effect (Desktop)
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- MENU CONFIG ---
  const mobileMenus = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Adopt', path: '/adopt', icon: Cat },
    { name: 'Status', path: '/status', icon: ClipboardList },
    { name: 'Report', path: '/report', icon: Siren },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* ==================================================================
          1. DESKTOP TOP NAVBAR (Muncul di layar md/lg ke atas)
          Porting dari Vue Navbar lama Anda.
         ================================================================== */}
      <header 
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-2" : "bg-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/images/navbar/logoKucing.png" 
              alt="Logo" 
              className="h-10 w-10 rounded-full bg-secondary object-contain group-hover:scale-110 transition-transform"
            />
            <span className={clsx(
              "text-xl font-bold tracking-tight transition-colors",
              scrolled ? "text-primary" : "text-dark"
            )}>
              Adopt Center
            </span>
          </Link>

          {/* Desktop Links (Hidden di Mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition">Home</Link>
            <Link to="/adopt" className="text-gray-700 hover:text-primary font-medium transition">Adopt</Link>
            <Link to="/report" className="text-gray-700 hover:text-primary font-medium transition">Rescue</Link>
            <Link to="/donate" className="text-gray-700 hover:text-primary font-medium transition">Donate</Link>
          </nav>

          {/* Right Side: Auth Buttons (Hidden di Mobile karena pindah ke tab Profile) */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="px-5 py-2 bg-primary text-white rounded-full font-medium hover:bg-orange-600 transition shadow-md hover:shadow-lg">
                  Log in
                </Link>
                <Link to="/signup" className="px-5 py-2 border-2 border-primary text-primary rounded-full font-medium hover:bg-orange-50 transition">
                  Sign up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">Hi, {user.name}</span>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition">
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Top Bar (Cuma Logo, Menu Lain Pindah ke Bawah) */}
          <div className="md:hidden">
             {/* Kosongkan saja atau taruh notifikasi icon di sini */}
          </div>
        </div>
      </header>


      {/* ==================================================================
          2. MOBILE BOTTOM NAVBAR (Hanya muncul di layar kecil / < md)
         ================================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {mobileMenus.map((menu) => {
            const Icon = menu.icon;
            const isActive = location.pathname === menu.path;

            return (
              <Link 
                key={menu.name} 
                to={menu.path} 
                className="flex flex-col items-center justify-center w-full h-full active:scale-95 transition-transform"
              >
                <div className={clsx(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive ? "bg-orange-100" : "bg-transparent"
                )}>
                  <Icon 
                    size={22} 
                    className={clsx(
                      "transition-colors duration-200",
                      isActive ? "text-primary fill-current" : "text-gray-400"
                    )} 
                    // Fill trick khusus lucide: fill-current akan mengisi warna solid
                    fill={isActive ? "currentColor" : "none"} 
                  />
                </div>
                <span className={clsx(
                  "text-[10px] font-medium mt-0.5 transition-colors",
                  isActive ? "text-primary" : "text-gray-400"
                )}>
                  {menu.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}