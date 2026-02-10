
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useHospital } from '../store/HospitalContext';
import { CalendarCheck, Clock, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppointmentPage = () => {
  const location = useLocation();
  const { doctors, bookAppointment } = useHospital();
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: '', patientEmail: '', patientPhone: '',
    doctorId: location.state?.doctorId || '',
    date: '', timeSlot: '',
  });

  const selectedDoctor = doctors.find(d => d.id === formData.doctorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-24 text-center max-w-2xl mx-auto px-4">
        <div className="bg-emerald-100 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-emerald-600 animate-bounce shadow-xl border border-emerald-200"><CheckCircle size={64} /></div>
        <h2 className="text-5xl font-black mb-6 tracking-tight uppercase">Request Logged!</h2>
        <p className="text-xl text-gray-500 mb-12 font-bold leading-relaxed">Thank you for choosing Bharat Seva Hospital. Our medical desk will contact you at <span className="text-emerald-600">{formData.patientPhone}</span> shortly to finalize your consultation.</p>
        <Link to="/" className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl inline-flex items-center active:scale-95 uppercase tracking-widest"><ArrowLeft size={24} className="mr-3" /> Back to Homepage</Link>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3 bg-emerald-800 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none -mr-16 -mt-16"><CalendarCheck size={300} /></div>
             <div>
               <h2 className="text-4xl font-black mb-10 relative z-10 leading-tight uppercase tracking-tighter">Secure Your Consultation</h2>
               <div className="space-y-10 relative z-10">
                 <div className="flex items-start space-x-6">
                   <div className="bg-white/10 p-4 rounded-3xl"><ShieldCheck size={32} /></div>
                   <div>
                     <h4 className="font-black text-xl uppercase tracking-widest">Verified Staff</h4>
                     <p className="text-emerald-200 text-sm mt-1 font-bold">Direct consultation with New Delhi's top medical experts.</p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-6">
                   <div className="bg-white/10 p-4 rounded-3xl"><Clock size={32} /></div>
                   <div>
                     <h4 className="font-black text-xl uppercase tracking-widest">Instant Booking</h4>
                     <p className="text-emerald-200 text-sm mt-1 font-bold">Paperless digital token management for minimal wait times.</p>
                   </div>
                 </div>
               </div>
             </div>
             <div className="mt-20 p-8 bg-white/5 rounded-[2rem] border border-white/10 relative z-10 backdrop-blur-sm">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300 mb-3">Support Helpdesk</p>
               <p className="text-2xl font-black tracking-tight">+91 98765 43210</p>
             </div>
          </div>
          
          <div className="lg:w-2/3 bg-white p-10 lg:p-16 rounded-[3.5rem] shadow-2xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Patient Full Name</label>
                  <input required className="w-full px-6 py-5 rounded-3xl border-4 border-gray-50 bg-gray-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-black text-xl text-gray-900" placeholder="e.g. Vikram Batra" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Contact Number</label>
                  <input required className="w-full px-6 py-5 rounded-3xl border-4 border-gray-50 bg-gray-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-black text-xl text-gray-900" placeholder="+91 00000 00000" value={formData.patientPhone} onChange={e => setFormData({...formData, patientPhone: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Email Address</label>
                <input required type="email" className="w-full px-6 py-5 rounded-3xl border-4 border-gray-50 bg-gray-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-black text-xl text-gray-900" placeholder="yourname@domain.com" value={formData.patientEmail} onChange={e => setFormData({...formData, patientEmail: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Select Specialist</label>
                  <select required className="w-full px-6 py-5 rounded-3xl border-4 border-gray-50 bg-gray-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-black text-xl text-gray-900" value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})}>
                    <option value="">Choose Specialist...</option>
                    {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name} - {doc.qualification}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Consultation Date</label>
                  <input required type="date" className="w-full px-6 py-5 rounded-3xl border-4 border-gray-50 bg-gray-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-black text-xl text-gray-900" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>

              {selectedDoctor && (
                <div className="p-10 bg-emerald-50/50 rounded-[2.5rem] border-4 border-emerald-50 animate-in zoom-in-95 duration-500 shadow-inner">
                  <h5 className="font-black mb-10 flex items-center text-emerald-900 text-xl uppercase tracking-[0.2em]"><Clock size={28} className="mr-4 text-emerald-600" /> Select Time Slot</h5>
                  <div className="flex flex-wrap gap-5">
                    {selectedDoctor.timeSlots.length === 0 ? (
                      <p className="text-emerald-800 font-black opacity-30 italic">No slots defined for this specialist.</p>
                    ) : selectedDoctor.timeSlots.map(slot => (
                      <button key={slot} type="button" onClick={() => setFormData({...formData, timeSlot: slot})} className={`px-10 py-5 rounded-2xl text-sm font-black transition-all shadow-md tracking-widest uppercase ${formData.timeSlot === slot ? 'bg-emerald-600 text-white shadow-2xl scale-110 ring-8 ring-emerald-100' : 'bg-white text-emerald-900 border-2 border-emerald-100 hover:border-emerald-400'}`}>{slot}</button>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-emerald-600 text-white py-8 rounded-[2rem] font-black text-3xl shadow-2xl hover:bg-emerald-700 transition-all uppercase tracking-[0.3em] active:scale-95">Book Now</button>
              <p className="text-center text-gray-300 font-black text-[10px] uppercase tracking-[0.3em]">Official Bharat Seva Medical Portal</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
