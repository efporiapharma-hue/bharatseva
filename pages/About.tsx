
import React from 'react';
import { useHospital } from '../store/HospitalContext';
import { Heart, Target, Users, Award } from 'lucide-react';

const About = () => {
  const { config } = useHospital();
  
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About {config.name}</h1>
          <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Legacy of Care</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded with the vision to provide high-quality, affordable healthcare to all sections of society, {config.name} has grown into a premier multi-specialty institution in the heart of India.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We combine traditional Indian hospitality with the latest medical technology. Our team of doctors and medical professionals are dedicated to delivering patient-centric care that prioritizes comfort and recovery.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <h4 className="text-orange-800 font-bold mb-1">Our Mission</h4>
                <p className="text-sm text-gray-600">To heal with compassion and lead in medical innovation.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <h4 className="text-green-800 font-bold mb-1">Our Vision</h4>
                <p className="text-sm text-gray-600">A healthy nation where quality care is accessible to every citizen.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop" 
              alt="Hospital Facility" 
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
              <div className="flex items-center space-x-4">
                 <div className="bg-orange-600 p-3 rounded-full text-white">
                   <Award size={24} />
                 </div>
                 <div>
                   <p className="text-2xl font-bold text-gray-900">15+ Years</p>
                   <p className="text-gray-500 text-sm">Of Clinical Excellence</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { icon: Heart, title: 'Patient Centric', desc: 'Every decision we make starts with the patients health and comfort.' },
             { icon: Target, title: 'Precision Medicine', desc: 'Utilizing advanced diagnostics for accurate treatment planning.' },
             { icon: Users, title: 'Expert Team', desc: 'A diverse group of specialists from India’s top medical colleges.' }
           ].map((item, idx) => (
             <div key={idx} className="bg-white p-10 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow border border-gray-50">
                <div className="inline-flex items-center justify-center p-4 bg-orange-50 text-orange-600 rounded-full mb-6">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default About;
