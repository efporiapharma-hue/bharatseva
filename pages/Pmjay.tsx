
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Info, CheckCircle2, ChevronRight, HelpCircle, FileText, ArrowRight } from 'lucide-react';

const Pmjay = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Swirl-like Pattern Vibes */}
      <div className="bg-emerald-700 relative overflow-hidden py-24">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="white" strokeWidth="5" />
             <path d="M0,60 Q25,10 50,60 T100,60" fill="none" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="bg-white inline-block p-6 rounded-3xl mb-8 shadow-2xl">
             <img 
               src="https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Ayushman_Bharat_logo.png/250px-Ayushman_Bharat_logo.png" 
               alt="PMJAY logo" 
               className="h-20"
             />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6">Ayushman Bharat (PM-JAY)</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto font-medium">
            Empowering every underprivileged Indian family with free, world-class healthcare up to ₹5,00,000 per year.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 pb-24">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            <div className="p-12 lg:p-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mr-4">
                   <Info size={24} />
                </div>
                The Mission
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Pradhan Mantri Jan Arogya Yojana is a flagship scheme of the Government of India providing health insurance to the bottom 40% of the population.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Bharat Seva Hospital is a primary empanelled center where you can receive tertiary care, surgeries, and critical treatment without paying a single rupee.
              </p>
            </div>
            <div className="bg-emerald-50/30 p-12 lg:p-16">
               <h3 className="text-emerald-800 font-extrabold mb-8 uppercase tracking-widest text-sm">Core Benefits</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   '₹5 Lakh Coverage',
                   'Cashless Procedures',
                   'No Age Limit',
                   'Family Floater',
                   'Pre-existing cover',
                   'Paperless Claims'
                 ].map((text, idx) => (
                   <div key={idx} className="flex items-center space-x-3 bg-white p-4 rounded-2xl shadow-sm border border-emerald-50">
                     <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                     <span className="font-bold text-gray-800 text-sm">{text}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="px-12 lg:px-16 py-16 border-t border-gray-100">
             <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Your Journey to Recovery</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { step: '01', title: 'Visit Helpdesk', desc: 'Approach our dedicated PMJAY counter with your Ayushman card or Ration card.' },
                  { step: '02', title: 'Verify Details', desc: 'Our Ayushman Mitra will verify your eligibility via Aadhaar-linked biometric authentication.' },
                  { step: '03', title: 'Cashless Care', desc: 'Proceed for the treatment immediately without any deposit or hidden fees.' }
                ].map((item, idx) => (
                  <div key={idx} className="relative text-center">
                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-lg shadow-emerald-100">{item.step}</div>
                    <h4 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h4>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    {idx < 2 && <div className="hidden lg:block absolute top-8 -right-6 text-emerald-200"><ArrowRight size={32} /></div>}
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-[#FF9933] text-white p-12 lg:p-16 text-center">
            <h3 className="text-3xl font-extrabold mb-6">Unsure about your status?</h3>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">Our reception team can check your eligibility instantly using your mobile number or family ID.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="bg-white text-orange-600 px-10 py-4 rounded-2xl font-bold hover:bg-orange-50 transition-all shadow-xl">
                Contact PMJAY Desk
              </Link>
              <a href="tel:14555" className="bg-gray-900/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center">
                National Helpline: 14555
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pmjay;
