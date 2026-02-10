
import React from 'react';
import { useHospital } from '../store/HospitalContext';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Departments = () => {
  const { departments } = useHospital();

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Medical Departments</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From basic consultations to advanced surgeries, we provide a wide range of medical specialties under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all group border border-gray-50 flex flex-col">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                <span className="text-2xl font-bold">{dept.name.charAt(0)}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{dept.name}</h3>
              <p className="text-gray-500 mb-8 flex-grow">{dept.description}</p>
              <Link 
                to="/doctors" 
                className="inline-flex items-center text-orange-600 font-bold group-hover:translate-x-2 transition-transform"
              >
                View Specialists <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gray-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <h3 className="text-3xl font-extrabold mb-6">Don't see what you're looking for?</h3>
           <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">Our reception team can guide you to the right specialist for your symptoms.</p>
           <Link to="/contact" className="bg-orange-600 px-10 py-4 rounded-full font-bold hover:bg-orange-700 transition-all inline-block">
             Contact Helpdesk
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Departments;
