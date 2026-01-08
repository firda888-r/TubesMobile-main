import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Adopt from './pages/Adopt';
import AdoptDetail from './pages/AdoptDetail';
import Status from './pages/Status';
import Report from './pages/Report';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f7f1e8] pb-20 md:pb-0 md:pt-0"> 
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/adopt" element={<Adopt />} />
            <Route path="/adopt/:id" element={<AdoptDetail />} />
            <Route path="/status" element={<Status />} />
            <Route path="/report" element={<Report />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}