
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useHospital } from '../store/HospitalContext';
import { CalendarCheck, User, Phone, Mail, Clock, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppointmentPage = () => {
  const location = useLocation();
  const { doctors, bookAppointment } = useHospital();
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctorId: location.state?.doctorId || '',
    date: '',
    timeSlot: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const selectedDoctor = doctors.find(d => d.id === formData.doctorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment(formData);
    setSubmitted(true);
    setFormData({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      doctorId: '',
      date: '',
      timeSlot: '',
    });
  };

  if (submitted) {
    return (
      <div className="py-24 text-center max-w-2xl mx-auto px-4">
        <div className="bg-emerald-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-600 animate-bounce shadow-emerald-50 shadow-xl">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Booking Requested!</h2>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed font-medium">
          Your appointment request has been logged. Our administrative team will reach out to you within 30 minutes to finalize your slot.
        </p>
        <Link 
          to="/"
          className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg inline-flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Info Card */}
          <div className="lg:w-1/3 space-y-8">
             <div className="bg-emerald-700 text-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <CalendarCheck size={180} />
               </div>
               <h2 className="text-3xl font-extrabold mb-8 relative z-10">Reserve Your Consultation</h2>
               <p className="text-emerald-100 mb-10 leading-relaxed font-medium relative z-10">
                 Skip the queues. Book your specialist consultation online and receive instant priority at our reception.
               </p>
               <div className="space-y-6 relative z-10">
                 <div className="flex items-center space-x-4">
                   <div className="bg-white/20 p-3 rounded-xl"><ShieldCheck size={20} /></div>
                   <span className="font-bold">Verified Senior Staff</span>
                 </div>
                 <div className="flex items-center space-x-4">
                   <div className="bg-white/20 p-3 rounded-xl"><Clock size={20} /></div>
                   <span className="font-bold">Short Waiting Times</span>
                 </div>
                 <div className="flex items-center space-x-4">
                   <div className="bg-white/20 p-3 rounded-xl"><CalendarCheck size={20} /></div>
                   <span className="font-bold">PMJAY Enabled Slots</span>
                 </div>
               </div>
             </div>
             
             <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-emerald-50 text-center">
                <h4 className="font-bold text-gray-900 mb-2">Need Assistance?</h4>
                <p className="text-sm text-gray-500 mb-6">Our helpdesk is available 24/7 for manual bookings.</p>
                <a href="tel:9876543210" className="text-2xl font-black text-emerald-600 tracking-tight hover:scale-105 inline-block transition-transform">+91 98765 43210</a>
             </div>
          </div>

          {/* Booking Form */}
          <div className="lg:w-2/3">
            <div className="bg-white p-10 lg:p-16 rounded-[2.5rem] shadow-2xl border border-white">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                      <User size={14} className="mr-2 text-emerald-600" /> Patient Full Name
                    </label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-emerald-500 focus:bg-white bg-gray-50 outline-none transition-all font-semibold"
                      value={formData.patientName}
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                      <Phone size={14} className="mr-2 text-emerald-600" /> Contact Number
                    </label>
                    <input 
                      required
                      type="tel" 
                      placeholder="+91 00000 00000"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-emerald-500 focus:bg-white bg-gray-50 outline-none transition-all font-semibold"
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                    <Mail size={14} className="mr-2 text-emerald-600" /> Email Address
                  </label>
                  <input 
                    required
                    type="email" 
                    placeholder="name@healthcare.com"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-emerald-500 focus:bg-white bg-gray-50 outline-none transition-all font-semibold"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Select Specialist</label>
                    <select 
                      required
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-emerald-500 focus:bg-white bg-gray-50 outline-none transition-all font-semibold"
                      value={formData.doctorId}
                      onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name} - {doc.qualification}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Consultation Date</label>
                    <input 
                      required
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-emerald-500 focus:bg-white bg-gray-50 outline-none transition-all font-semibold"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                {selectedDoctor && (
                  <div className="p-10 bg-emerald-50 rounded-[2rem] border-2 border-emerald-100 animate-in fade-in duration-500">
                    <h5 className="text-emerald-800 font-extrabold mb-6 flex items-center">
                      <Clock size={18} className="mr-3" /> Preferred Time Slot
                    </h5>
                    <div className="flex flex-wrap gap-4">
                      {selectedDoctor.timeSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData({...formData, timeSlot: slot})}
                          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                            formData.timeSlot === slot 
                              ? 'bg-emerald-600 text-white shadow-lg scale-105' 
                              : 'bg-white text-emerald-800 border-2 border-emerald-100 hover:border-emerald-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    <p className="mt-6 text-xs text-emerald-600 font-bold uppercase tracking-widest">
                      Typical OPD days: {selectedDoctor.availableDays.join(', ')}
                    </p>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl shadow-2xl hover:bg-emerald-700 transition-all hover:scale-[1.01] active:scale-[0.98] uppercase tracking-widest"
                >
                  Request Appointment
                </button>
                <p className="text-center text-xs text-gray-400 font-medium tracking-tight">
                  Security notice: Your data is encrypted and handled per medical privacy standards.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
