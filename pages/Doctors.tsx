
import React, { useState } from 'react';
import { useHospital } from '../store/HospitalContext';
import { Link } from 'react-router-dom';
import { Calendar, Search, Filter, ArrowRight } from 'lucide-react';

const Doctors = () => {
  const { doctors, departments } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || doc.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  const getDeptName = (id: string) => departments.find(d => d.id === id)?.name || 'General';

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Medical Specialists</h1>
          <p className="text-lg text-gray-600">A team of dedicated professionals committed to your health.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or qualification..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <Filter className="text-gray-400" size={20} />
            <select 
              className="w-full md:w-64 py-3 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-3xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all border border-gray-100">
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={doc.photo} 
                  alt={doc.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  {getDeptName(doc.departmentId)}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{doc.name}</h3>
                <p className="text-orange-600 font-medium mb-4">{doc.qualification}</p>
                
                <div className="space-y-3 mb-8 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span className="font-semibold mr-1">Days:</span> {doc.availableDays.join(', ')}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span className="font-semibold mr-1">Slots:</span> {doc.timeSlots.join(', ')}
                  </div>
                </div>

                <Link 
                  to="/appointment" 
                  state={{ doctorId: doc.id }}
                  className="w-full flex items-center justify-center bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors group"
                >
                  Book Appointment <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
             <div className="text-gray-400 mb-4 flex justify-center"><Search size={48} /></div>
             <p className="text-xl text-gray-500 font-medium">No doctors found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
