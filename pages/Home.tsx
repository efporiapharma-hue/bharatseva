
import React from 'react';
import { Link } from 'react-router-dom';
import { useHospital } from '../store/HospitalContext';
import { 
  ShieldCheck, 
  Stethoscope, 
  Clock, 
  ArrowRight,
  Bell,
  Activity,
  Award,
  Heart,
  Loader,
  Phone
} from 'lucide-react';

const Home = () => {
  const { config, notices, loading } = useHospital();

  const nameParts = (config?.name || 'Bharat Seva Hospital').split(' ');
  const firstName = nameParts[0];
  const restOfName = nameParts.slice(1).join(' ');

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop" 
            alt="Hospital Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-gray-900">
            {loading && (
              <div className="flex items-center space-x-2 mb-6 bg-emerald-50 text-emerald-700 w-fit px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-emerald-100">
                <Loader className="animate-spin" size={14} />
                <span>Syncing Database...</span>
              </div>
            )}
            <div className="inline-flex items-center bg-emerald-600 text-white px-5 py-2 rounded-full mb-8 text-xs font-black tracking-[0.2em] uppercase shadow-xl ring-4 ring-emerald-50">
              <ShieldCheck size={18} className="mr-2" />
              Trusted Healthcare Partner
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[1.1] tracking-tight">
              {firstName} <br />
              <span className="text-emerald-600">{restOfName}</span> <br />
              <span className="text-[#FF9933] drop-shadow-sm">Compassion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed font-bold max-w-lg">
              Experience world-class healthcare integrated with Indian values. Official Ayushman Bharat PM-JAY Partner.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link 
                to="/appointment" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-2xl font-black transition-all shadow-2xl flex items-center group text-xl active:scale-95"
              >
                Book Appointment <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/pmjay" 
                className="bg-white text-emerald-900 px-12 py-5 rounded-2xl font-black border-4 border-emerald-50 transition-all hover:bg-emerald-50 shadow-xl text-xl active:scale-95"
              >
                PMJAY Scheme
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights - Stats cards overlay */}
      <section className="max-w-7xl mx-auto px-4 -mt-24 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-b-8 border-emerald-600 hover:-translate-y-3 transition-transform duration-500 group">
             <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-10 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
               <Stethoscope size={40} />
             </div>
             <h3 className="text-3xl font-black mb-4">Expert Doctors</h3>
             <p className="text-gray-500 mb-8 leading-relaxed font-bold">Consult with nationally acclaimed specialists across 25+ advanced departments.</p>
             <Link to="/doctors" className="text-emerald-700 font-black flex items-center hover:translate-x-2 transition-transform uppercase tracking-widest text-sm">Meet Specialists <ArrowRight size={20} className="ml-2" /></Link>
          </div>
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-b-8 border-[#FF9933] hover:-translate-y-3 transition-transform duration-500 group">
             <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-[#FF9933] mb-10 shadow-inner group-hover:bg-[#FF9933] group-hover:text-white transition-all">
               <ShieldCheck size={40} />
             </div>
             <h3 className="text-3xl font-black mb-4">Ayushman Bharat</h3>
             <p className="text-gray-500 mb-8 leading-relaxed font-bold">Providing cashless treatment up to ₹5 Lakhs for eligible Indian citizens. Completely paperless.</p>
             <Link to="/pmjay" className="text-[#FF9933] font-black flex items-center hover:translate-x-2 transition-transform uppercase tracking-widest text-sm">PMJAY Details <ArrowRight size={20} className="ml-2" /></Link>
          </div>
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-b-8 border-blue-600 hover:-translate-y-3 transition-transform duration-500 group">
             <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-10 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
               <Clock size={40} />
             </div>
             <h3 className="text-3xl font-black mb-4">24/7 Helpline</h3>
             <p className="text-gray-500 mb-8 leading-relaxed font-bold">Dedicated trauma center and life-support ambulance services available round the clock.</p>
             <a href={`tel:${config?.phone || ''}`} className="text-blue-700 font-black flex items-center hover:translate-x-2 transition-transform uppercase tracking-widest text-sm">Emergency Call <ArrowRight size={20} className="ml-2" /></a>
          </div>
        </div>
      </section>

      {/* Latest Notices */}
      {notices.length > 0 && (
        <section className="py-24 bg-gray-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none"><Bell size={400} /></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-5xl font-black text-gray-900 flex items-center tracking-tight">
                  <Bell className="mr-5 text-emerald-600 animate-bounce" size={44} /> Latest Communique
                </h2>
                <p className="text-gray-400 mt-4 text-xl font-bold uppercase tracking-widest">Hospital Bulletins & Alerts</p>
              </div>
              <Link to="/contact" className="text-emerald-700 font-black flex items-center text-lg hover:underline group">View All News <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-all" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className={`p-10 rounded-[3rem] border-4 transition-all hover:scale-[1.03] shadow-2xl relative overflow-hidden ${notice.isImportant ? 'bg-orange-50 border-orange-200 shadow-orange-100' : 'bg-white border-emerald-50 shadow-emerald-50'}`}>
                  {notice.isImportant && <div className="absolute top-0 right-0 bg-[#FF9933] text-white text-[11px] px-6 py-2 font-black uppercase tracking-[0.2em]">High Priority</div>}
                  <div className="flex items-center space-x-3 mb-6">
                    <Activity size={20} className="text-emerald-600" />
                    <p className="text-emerald-600 text-sm font-black tracking-widest uppercase">{notice.date}</p>
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-6 leading-tight">{notice.title}</h4>
                  <p className="text-gray-500 font-bold mb-8 leading-relaxed line-clamp-4">{notice.content}</p>
                  <Link to="/appointment" className="inline-flex items-center text-emerald-700 font-black text-sm uppercase tracking-[0.2em] hover:underline group">
                    Action Required <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Counter Section */}
      <section className="py-32 bg-[#111827] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><Activity className="w-full h-full text-emerald-500" /></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
              {[
                { label: 'Patient Recoveries', value: '85,000+', icon: Award },
                { label: 'Expert Specialists', value: '160+', icon: Stethoscope },
                { label: 'Trust Experience', value: '20+ Yrs', icon: Heart },
                { label: 'ISO Certified', value: 'Grade-A', icon: ShieldCheck }
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                  <div className="bg-emerald-600/20 p-6 rounded-[2rem] mb-8 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                    <stat.icon size={44} className="text-emerald-400" />
                  </div>
                  <div className="text-5xl font-black mb-3 tracking-tight">{stat.value}</div>
                  <div className="text-emerald-400/60 text-xs font-black uppercase tracking-[0.3em]">{stat.label}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Emergency Call-to-action */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="text-white text-center md:text-left">
              <h2 className="text-4xl font-black mb-4">Emergency Medical Support?</h2>
              <p className="text-emerald-50 text-xl font-bold">Contact our trauma center for immediate ambulance dispatch.</p>
           </div>
           <a href={`tel:${config?.phone}`} className="bg-white text-emerald-700 px-12 py-6 rounded-3xl font-black text-2xl shadow-2xl flex items-center hover:bg-gray-100 transition-all active:scale-95">
             <Phone size={32} className="mr-4 animate-pulse" /> {config?.phone}
           </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
