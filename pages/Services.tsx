
import React from 'react';
import { useHospital } from '../store/HospitalContext';
import { CheckCircle2, Thermometer, ShieldPlus, Activity, Bed, Syringe } from 'lucide-react';

const Services = () => {
  const { services } = useHospital();

  const extraServices = [
    { title: '24/7 Pharmacy', icon: Syringe, desc: 'Quality medicines available round the clock.' },
    { title: 'ICU & NICU', icon: Bed, desc: 'Highly specialized intensive care for adults and infants.' },
    { title: 'Pathology Lab', icon: Activity, desc: 'Advanced diagnostics and blood testing facilities.' },
    { title: 'Ambulance Service', icon: ShieldPlus, desc: 'Rapid response emergency transportation.' }
  ];

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">World Class Facilities</h1>
          <p className="text-lg text-gray-600">Equipped with state-of-the-art medical technology to serve you better.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {services.map((service) => (
            <div key={service.id} className="bg-gray-50 p-10 rounded-3xl border border-gray-100 hover:border-orange-200 transition-all shadow-sm">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm mb-6">
                 <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-orange-600 rounded-[3rem] p-12 lg:p-20 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold mb-8 leading-tight">Comprehensive Care Solutions</h2>
              <p className="text-xl text-white/80 mb-12">
                We go beyond treatment. Our ecosystem includes everything you need for a complete recovery journey.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {extraServices.map((s, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="bg-white/20 p-3 rounded-xl mr-4">
                      <s.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{s.title}</h4>
                      <p className="text-sm text-white/60">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop" 
                alt="Medical Services" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-green-500 p-6 rounded-2xl shadow-xl flex items-center">
                 <Activity className="mr-3" />
                 <span className="font-bold">ISO Certified Facility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
