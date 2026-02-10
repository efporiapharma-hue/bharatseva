
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HospitalProvider, useHospital } from './store/HospitalContext';
import Home from './pages/Home';
import About from './pages/About';
import Doctors from './pages/Doctors';
import Departments from './pages/Departments';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AppointmentPage from './pages/Appointment';
import Pmjay from './pages/Pmjay';
import Admin from './pages/Admin';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  Facebook,
  Twitter,
  Instagram,
  Send,
  FileText,
  Globe
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { config } = useHospital();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Departments', path: '/departments' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'PMJAY', path: '/pmjay' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-emerald-600 p-2 rounded-xl">
                <Heart className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden md:block uppercase tracking-tight">
                {config.name}
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  isActive(link.path) 
                    ? 'text-emerald-700 font-bold underline decoration-2 underline-offset-8' 
                    : 'text-gray-600 hover:text-emerald-600 transition-colors'
                } px-1 py-2 text-sm font-semibold uppercase tracking-wider`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/appointment"
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
            >
              Book Appointment
            </Link>
            <Link
              to="/admin"
              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
              title="Admin Panel"
            >
              <LayoutDashboard size={20} />
            </Link>
          </div>

          <div className="lg:hidden flex items-center space-x-4">
            <Link to="/admin" className="p-2 text-gray-400"><LayoutDashboard size={20} /></Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-emerald-600 p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-4 text-base font-medium rounded-md ${
                  isActive(link.path) ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/appointment"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-emerald-600 text-white px-6 py-4 rounded-md font-bold text-lg mt-4"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const { config, departments } = useHospital();
  return (
    <footer className="bg-white text-black border-t-4 border-emerald-600 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
               <div className="bg-emerald-600 p-2 rounded-lg">
                 <Heart className="text-white" size={24} />
               </div>
               <h3 className="text-2xl font-bold tracking-tight">{config.name}</h3>
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed text-sm font-medium">
              Leading the way in medical excellence with state-of-the-art facilities and compassionate care. Official empanelled provider for Ayushman Bharat PM-JAY.
            </p>
            <div className="flex space-x-4">
              <span className="bg-emerald-50 text-emerald-700 p-3 rounded-xl hover:bg-emerald-600 hover:text-white cursor-pointer transition-all shadow-sm"><Facebook size={20} /></span>
              <span className="bg-emerald-50 text-emerald-700 p-3 rounded-xl hover:bg-emerald-600 hover:text-white cursor-pointer transition-all shadow-sm"><Twitter size={20} /></span>
              <span className="bg-emerald-50 text-emerald-700 p-3 rounded-xl hover:bg-emerald-600 hover:text-white cursor-pointer transition-all shadow-sm"><Instagram size={20} /></span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-800 mb-8 pb-2 border-b-2 border-emerald-50 inline-block">Departments</h4>
            <ul className="space-y-4">
              {departments.slice(0, 5).map(dept => (
                <li key={dept.id}>
                  <Link to="/departments" className="text-gray-800 hover:text-emerald-600 transition-colors flex items-center text-sm font-bold">
                    <ChevronRight size={14} className="mr-2 text-emerald-600" /> {dept.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-800 mb-8 pb-2 border-b-2 border-emerald-50 inline-block">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/pmjay" className="text-gray-800 hover:text-emerald-600 transition-colors flex items-center text-sm font-bold"><ChevronRight size={14} className="mr-2 text-emerald-600" /> PMJAY Information</Link></li>
              <li><Link to="/doctors" className="text-gray-800 hover:text-emerald-600 transition-colors flex items-center text-sm font-bold"><ChevronRight size={14} className="mr-2 text-emerald-600" /> Specialist Doctors</Link></li>
              <li><Link to="/appointment" className="text-gray-800 hover:text-emerald-600 transition-colors flex items-center text-sm font-bold"><ChevronRight size={14} className="mr-2 text-emerald-600" /> Book Your Slot</Link></li>
              <li><Link to="/contact" className="text-gray-800 hover:text-emerald-600 transition-colors flex items-center text-sm font-bold"><ChevronRight size={14} className="mr-2 text-emerald-600" /> Contact Support</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-1" id="digital-communique-column">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-800 mb-8 pb-2 border-b-2 border-emerald-50 inline-block">Digital Communique</h4>
            <div className="space-y-6">
              <p className="text-sm text-gray-800 font-bold leading-relaxed">Stay updated with our medical bulletins and health alerts via our digital channel.</p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-emerald-50 border-2 border-emerald-100 text-sm px-4 py-3 rounded-xl outline-none focus:border-emerald-500 w-full font-semibold transition-all text-black"
                />
                <button className="absolute right-1 top-1 bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-all shadow-md">
                  <Send size={18} />
                </button>
              </div>
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-tighter hover:underline cursor-pointer">
                <Globe size={14} />
                <span>Visit digital portal</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-800 mb-8 pb-2 border-b-2 border-emerald-50 inline-block">Reach Us</h4>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <MapPin className="mr-3 text-emerald-600 mt-1 shrink-0" size={16} />
                <span className="text-xs leading-relaxed font-bold text-gray-800">{config.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 text-emerald-600 shrink-0" size={16} />
                <span className="text-xs font-bold text-gray-800">{config.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-3 text-emerald-600 shrink-0" size={16} />
                <span className="text-xs font-bold text-gray-800">{config.email}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center md:text-left">
           <p className="mb-4 md:mb-0">
             © 2026 {config.name}. Professional Healthcare. All Rights Reserved. <span className="text-emerald-600 ml-1">website developed by digital communique</span>
           </p>
           <div className="flex space-x-6">
             <span className="hover:text-emerald-600 cursor-pointer">Ayushman Bharat Partner</span>
             <span className="hover:text-emerald-600 cursor-pointer">Health ID Integrator</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <HospitalProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/pmjay" element={<Pmjay />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </HospitalProvider>
  );
};

export default App;
