
import React from 'react';
import { Link } from 'react-router-dom';
import { useHospital } from '../store/HospitalContext';
import { 
  ShieldCheck, 
  Stethoscope, 
  Clock, 
  ArrowRight,
  Bell,
  CalendarCheck,
  Activity,
  Award,
  Heart,
  Loader2
} from 'lucide-react';

const Home = () => {
  const { config, notices, loading } = useHospital();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Connecting to Care Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070" 
            alt="Hospital Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/40 md:bg-transparent md:bg-gradient-to-r md:from-white/90 md:via-white/50 md:to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-gray-900">
            <div className="inline-flex items-center bg-emerald-600 text-white px-4 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase shadow-lg">
              <ShieldCheck size={16} className="mr-2" />
              Trusted Healthcare Partner
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
              {config.name.split(' ')[0]} <br />
              <span className="text-emerald-600">{config.name.split(' ').slice(1).join(' ')}</span> <br />
              <span className="text-[#FF9933]">Compassion</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed font-medium max-w-lg">
              Experience world-class healthcare with Indian values. From advanced diagnostics to specialized surgeries, we are committed to your well-being.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link 
                to="/appointment" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl flex items-center group text-lg"
              >
                Book Appointment <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/pmjay" 
                className="bg-white text-emerald-900 px-10 py-4 rounded-xl font-bold border-2 border-emerald-100 transition-all hover:bg-emerald-50 shadow-md text-lg"
              >
                PMJAY Scheme Info
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-3xl shadow-2xl border-b-4 border-emerald-600 hover:-translate-y-2 transition-transform duration-300">
             <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 shadow-inner">
               <Stethoscope size={32} />
             </div>
             <h3 className="text-2xl font-bold mb-4">Expert Doctors</h3>
             <p className="text-gray-500 mb-6 leading-relaxed">Consult with our nationally acclaimed specialists across 25+ advanced departments.</p>
             <Link to="/doctors" className="text-emerald-700 font-bold flex items-center hover:translate-x-1 transition-transform">Meet Specialists <ArrowRight size={18} className="ml-2" /></Link>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-2xl border-b-4 border-[#FF9933] hover:-translate-y-2 transition-transform duration-300">
             <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF9933] mb-8 shadow-inner">
               <ShieldCheck size={32} />
             </div>
             <h3 className="text-2xl font-bold mb-4">Ayushman Bharat</h3>
             <p className="text-gray-500 mb-6 leading-relaxed">Providing cashless and paperless treatment up to ₹5 Lakhs for eligible Indian citizens.</p>
             <Link to="/pmjay" className="text-[#FF9933] font-bold flex items-center hover:translate-x-1 transition-transform">PMJAY Eligibility <ArrowRight size={18} className="ml-2" /></Link>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-2xl border-b-4 border-blue-600 hover:-translate-y-2 transition-transform duration-300">
             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 shadow-inner">
               <Clock size={32} />
             </div>
             <h3 className="text-2xl font-bold mb-4">24/7 Response</h3>
             <p className="text-gray-500 mb-6 leading-relaxed">Dedicated trauma center and life-support ambulance services available round the clock.</p>
             <a href={`tel:${config.phone}`} className="text-blue-700 font-bold flex items-center hover:translate-x-1 transition-transform">Emergency Helpline <ArrowRight size={18} className="ml-2" /></a>
          </div>
        </div>
      </section>

      {/* Announcements */}
      {notices.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 text-center md:text-left">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center md:justify-start">
                  <Bell className="mr-4 text-emerald-600 animate-pulse" /> Latest Notices
                </h2>
                <p className="text-gray-500 mt-2">Stay updated with hospital events and health camps.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notices.map((notice) => (
                <div key={notice.id} className={`p-8 rounded-[2rem] border-2 transition-all hover:scale-[1.02] ${notice.isImportant ? 'bg-orange-50 border-orange-200 shadow-orange-100' : 'bg-white border-emerald-50 shadow-emerald-50'} shadow-xl relative overflow-hidden`}>
                  {notice.isImportant && <div className="absolute top-0 right-0 bg-[#FF9933] text-white text-[10px] px-4 py-1 font-bold uppercase tracking-widest">Important</div>}
                  <p className="text-emerald-600 text-xs font-bold mb-3 tracking-widest">{notice.date}</p>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{notice.title}</h4>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">{notice.content}</p>
                  <Link to="/appointment" className="inline-flex items-center text-emerald-700 font-extrabold text-sm uppercase tracking-wider hover:underline group">
                    Book This Slot <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PMJAY Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 medical-gradient opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-emerald-50 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-sm border border-emerald-100">
             <div className="absolute top-0 right-0 opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/4">
               <ShieldCheck size={600} className="text-emerald-700" />
             </div>
             
             <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                <div className="lg:w-1/2">
                   <img 
                     src="https://images.unsplash.com/photo-1586773860418-d37222d8fce2?w=800&h=600&fit=crop" 
                     alt="PMJAY Treatment" 
                     className="rounded-3xl shadow-2xl border-4 border-white"
                   />
                </div>
                <div className="lg:w-1/2">
                   <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Ayushman_Bharat_logo.png/250px-Ayushman_Bharat_logo.png" alt="PMJAY Logo" className="w-12" />
                      </div>
                      <div>
                        <h4 className="text-[#FF9933] font-bold uppercase tracking-widest text-xs">Ayushman Bharat Yojana</h4>
                        <h2 className="text-4xl font-extrabold text-gray-900">PM-JAY Scheme Partner</h2>
                      </div>
                   </div>
                   <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                     We provide completely cashless and paperless medical treatment to all PM-JAY cardholders. Our dedicated Ayushman Mitras are here to assist you through the entire process.
                   </p>
                   <ul className="space-y-4 mb-10">
                     {[
                       'Cashless Hospitalization up to ₹5 Lakh',
                       'Pre & Post Hospitalization expenses covered',
                       'Dedicated PMJAY Helpdesk 24/7',
                       'Treatment for 1300+ medical procedures'
                     ].map((item, idx) => (
                       <li key={idx} className="flex items-center text-gray-800 font-semibold text-sm">
                         <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                           <Activity size={14} className="text-emerald-600" />
                         </div>
                         {item}
                       </li>
                     ))}
                   </ul>
                   <Link to="/pmjay" className="inline-block bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg hover:-translate-y-1">
                     Check Your Eligibility
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-24 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Successful Treatments', value: '75,000+', icon: Award },
                { label: 'Empanelled Specialists', value: '140+', icon: Stethoscope },
                { label: 'Years of Trust', value: '18+', icon: Heart },
                { label: 'Patient Satisfaction', value: '99%', icon: ShieldCheck }
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="bg-white/10 p-4 rounded-2xl mb-6">
                    <stat.icon size={32} className="text-emerald-400" />
                  </div>
                  <div className="text-4xl font-extrabold mb-2">{stat.value}</div>
                  <div className="text-emerald-200 text-sm font-medium uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
