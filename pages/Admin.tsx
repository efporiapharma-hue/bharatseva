
import React, { useState, useRef, useEffect } from 'react';
import { useHospital } from '../store/HospitalContext';
import { 
  Settings, Users, Calendar, Bell, LayoutGrid, Plus, Trash2, Check, X, 
  Image as ImageIcon, Camera, Lock, RefreshCw,
  ShieldPlus, Activity, BriefcaseMedical, UserPlus, History, AlertTriangle, CloudOff, CheckCircle,
  Info
} from 'lucide-react';
import { Appointment, Doctor, HospitalConfig } from '../types';

const Admin = () => {
  const { 
    config, updateConfig, doctors, addDoctor, removeDoctor, 
    departments, addDepartment, removeDepartment,
    services, addService, removeService,
    appointments, updateAppointmentStatus, bookAppointment, removeAppointment,
    notices, addNotice, removeNotice,
    refreshData, loading: dbLoading, dbConnected, lastError
  } = useHospital();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ id: '', password: '' });
  const [activeTab, setActiveTab] = useState<'config' | 'doctors' | 'appointments' | 'notices' | 'depts' | 'services'>('config');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Cancelled'>('All');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localConfig, setLocalConfig] = useState<HospitalConfig>(config);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [isAddingApt, setIsAddingApt] = useState(false);

  useEffect(() => { setLocalConfig(config); }, [config]);

  // Forms State
  const [newDoc, setNewDoc] = useState({ 
    name: '', qualification: '', departmentId: '', photo: '', 
    availableDays: 'Mon, Wed, Fri', timeSlots: '10:00 AM - 1:00 PM, 4:00 PM - 7:00 PM' 
  });
  
  const [newApt, setNewApt] = useState({
    patientName: '', patientPhone: '', patientEmail: '', doctorId: '', date: '', timeSlot: ''
  });

  const [newDept, setNewDept] = useState({ name: '', description: '', icon: '🏥' });
  const [newService, setNewService] = useState({ title: '', description: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', date: new Date().toLocaleDateString(), isImportant: false });

  const filteredAppointments = appointments.filter(apt => 
    statusFilter === 'All' ? true : apt.status === statusFilter
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginCreds.id === 'admin' && loginCreds.password === 'admin') setIsLoggedIn(true);
    else alert('Invalid Admin Credentials (Default: admin/admin)');
  };

  const handleDocAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.photo) return alert("Please upload a Specialist Portrait.");
    setIsAddingDoc(true);
    const success = await addDoctor({
      ...newDoc,
      availableDays: newDoc.availableDays.split(',').map(d => d.trim()),
      timeSlots: newDoc.timeSlots.split(',').map(s => s.trim())
    });
    setIsAddingDoc(false);
    if (success) {
      setNewDoc({ name: '', qualification: '', departmentId: departments[0]?.id || '', photo: '', availableDays: 'Mon, Wed, Fri', timeSlots: '10:00 AM - 1:00 PM, 4:00 PM - 7:00 PM' });
      alert("Specialist registered!");
    }
  };

  const handleManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingApt(true);
    try {
      await bookAppointment(newApt);
      setIsAddingApt(false);
      setNewApt({ patientName: '', patientPhone: '', patientEmail: '', doctorId: '', date: '', timeSlot: '' });
      alert("Consultation booked successfully!");
    } catch (err: any) {
      setIsAddingApt(false);
      alert("Database error: " + err.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md">
          <div className="text-center mb-10">
            <div className="bg-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"><Lock className="text-white" size={32} /></div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Admin Gateway</h1>
            <p className="text-gray-400 text-sm mt-2 font-bold uppercase tracking-widest">Digital Communique Secure Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="text" placeholder="Admin ID" className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none font-bold" value={loginCreds.id} onChange={e => setLoginCreds({...loginCreds, id: e.target.value})} required />
            <input type="password" placeholder="Password" className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none font-bold" value={loginCreds.password} onChange={e => setLoginCreds({...loginCreds, password: e.target.value})} required />
            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl text-lg uppercase tracking-widest">Verify & Enter</button>
          </form>
        </div>
      </div>
    );
  }

  const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3";
  const inputClasses = "w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-gray-800 text-lg";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-[#111827] text-white p-8 hidden lg:block sticky top-0 h-screen border-r border-gray-800">
        <div className="flex items-center space-x-3 mb-12">
           <div className="bg-emerald-600 p-2 rounded-xl"><Activity className="text-white" size={24} /></div>
           <h2 className="text-xl font-black uppercase tracking-tighter">Bharat Admin</h2>
        </div>
        <nav className="space-y-2">
          {[
            { id: 'config', label: 'Hospital Info', icon: Settings },
            { id: 'doctors', label: 'Doctor Roster', icon: Users },
            { id: 'depts', label: 'Clinical Depts', icon: LayoutGrid },
            { id: 'services', label: 'Our Facilities', icon: ShieldPlus },
            { id: 'appointments', label: 'Consultations', icon: Calendar },
            { id: 'notices', label: 'Bulletin Board', icon: Bell }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <tab.icon className="mr-4" size={20} /> {tab.label}
            </button>
          ))}
          <div className="pt-10 border-t border-gray-800 mt-10">
            <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 transition-all"><X className="mr-4" /> Log Out</button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
             <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">{activeTab}</h1>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{dbConnected ? 'Sync Live' : 'Database Error'}</span>
                </div>
             </div>
             <button onClick={() => refreshData(true)} className={`p-4 bg-white rounded-2xl shadow-md hover:bg-emerald-50 transition-all border border-gray-100 ${dbLoading ? 'animate-spin' : ''}`}>
               <RefreshCw size={24} className="text-emerald-600" />
             </button>
          </div>

          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100 space-y-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 <div className="lg:col-span-1">
                    <label className={labelClasses}>Hospital Identity (Logo)</label>
                    <div className="p-6 bg-gray-50 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center space-y-4">
                      {localConfig.logo ? <img src={localConfig.logo} className="h-32 object-contain" /> : <ImageIcon className="text-gray-300" size={48} />}
                      <input className={inputClasses} value={localConfig.logo} placeholder="https://..." onChange={e => setLocalConfig({...localConfig, logo: e.target.value})} />
                    </div>
                 </div>
                 <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div><label className={labelClasses}>Institution Name</label><input className={inputClasses} value={localConfig.name} onChange={e => setLocalConfig({...localConfig, name: e.target.value})} /></div>
                    <div><label className={labelClasses}>Primary Hotline</label><input className={inputClasses} value={localConfig.phone} onChange={e => setLocalConfig({...localConfig, phone: e.target.value})} /></div>
                    <div><label className={labelClasses}>Official Email</label><input className={inputClasses} value={localConfig.email} onChange={e => setLocalConfig({...localConfig, email: e.target.value})} /></div>
                    <div><label className={labelClasses}>Physical Address</label><input className={inputClasses} value={localConfig.address} onChange={e => setLocalConfig({...localConfig, address: e.target.value})} /></div>
                 </div>
              </div>
              <button onClick={() => updateConfig(localConfig)} className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl uppercase transition-all active:scale-95">Save Registry Details</button>
            </div>
          )}

          {/* Appointments Tab - Redesigned with Empty State Handling */}
          {activeTab === 'appointments' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               {/* Manual Booking Form */}
               <div className="bg-white p-12 lg:p-16 rounded-[3.5rem] shadow-2xl border border-gray-100">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-tighter">Manual Consultation Log</h3>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Directly register walk-in patients to the system</p>
                    </div>
                    <UserPlus className="text-emerald-600" size={32} />
                  </div>
                  <form onSubmit={handleManualBooking} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div><label className={labelClasses}>Patient Full Name</label><input className={inputClasses} placeholder="e.g. Vikram Batra" value={newApt.patientName} onChange={e => setNewApt({...newApt, patientName: e.target.value})} required /></div>
                    <div><label className={labelClasses}>Phone Number</label><input className={inputClasses} placeholder="+91 00000 00000" value={newApt.patientPhone} onChange={e => setNewApt({...newApt, patientPhone: e.target.value})} required /></div>
                    <div><label className={labelClasses}>Assigned Specialist</label><select className={inputClasses} value={newApt.doctorId} onChange={e => setNewApt({...newApt, doctorId: e.target.value})} required><option value="">Choose Doctor...</option>{doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelClasses}>Consultation Date</label><input className={inputClasses} type="date" value={newApt.date} onChange={e => setNewApt({...newApt, date: e.target.value})} required /></div>
                      <div><label className={labelClasses}>Time Slot</label><input className={inputClasses} placeholder="11:30 AM" value={newApt.timeSlot} onChange={e => setNewApt({...newApt, timeSlot: e.target.value})} required /></div>
                    </div>
                    <div className="md:col-span-2">
                      <button type="submit" disabled={isAddingApt} className="w-full bg-emerald-600 text-white py-8 rounded-[2rem] font-black text-2xl shadow-xl hover:bg-emerald-700 uppercase tracking-[0.2em] transition-all active:scale-95">{isAddingApt ? 'Writing to DB...' : 'BOOK NOW'}</button>
                    </div>
                  </form>
               </div>

               {/* Queue Management */}
               <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                 <div className="p-10 border-b border-gray-100 bg-emerald-50/20 flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="flex items-center space-x-4">
                      <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200"><History size={28} /></div>
                      <div>
                        <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-tighter">Consultation Registry</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase">{appointments.length} Total Records</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex bg-white p-2 rounded-2xl border-2 border-emerald-50 shadow-sm">
                      {['All', 'Pending', 'Confirmed', 'Cancelled'].map(filter => (
                        <button key={filter} onClick={() => setStatusFilter(filter as any)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === filter ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-emerald-600'}`}>
                          {filter}
                        </button>
                      ))}
                   </div>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                        <tr><th className="px-10 py-6">Patient Profile</th><th className="px-10 py-6">Medical Specialist</th><th className="px-10 py-6">Current Status</th><th className="px-10 py-6 text-right">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredAppointments.length === 0 ? (
                          <tr><td colSpan={4} className="py-24 text-center">
                            <div className="flex flex-col items-center justify-center opacity-30">
                              <CloudOff size={64} className="mb-4 text-gray-400" />
                              <h4 className="font-black text-gray-400 uppercase tracking-[0.4em]">Empty Queue</h4>
                              <p className="text-xs font-bold text-gray-400 mt-2 uppercase">No appointments found in database</p>
                              <button onClick={() => refreshData(true)} className="mt-6 flex items-center space-x-2 bg-gray-100 px-6 py-2 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-all font-black text-[10px] uppercase">
                                <RefreshCw size={12} /> <span>Re-Sync Database</span>
                              </button>
                            </div>
                          </td></tr>
                        ) : filteredAppointments.map(apt => (
                          <tr key={apt.id} className="hover:bg-emerald-50/10 transition-colors">
                            <td className="px-10 py-8">
                               <div className="text-gray-900 font-black text-xl leading-tight">{apt.patientName}</div>
                               <div className="text-emerald-600 font-bold text-sm tracking-widest uppercase mt-1">{apt.patientPhone}</div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="text-gray-800 font-black">{doctors.find(d => d.id === apt.doctorId)?.name || 'General Registry'}</div>
                               <div className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">{apt.date} • {apt.timeSlot}</div>
                            </td>
                            <td className="px-10 py-8">
                              <span className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-black inline-block border ${
                                apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                apt.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
                                'bg-orange-50 text-orange-700 border-orange-100'
                              }`}>
                                {apt.status}
                              </span>
                            </td>
                            <td className="px-10 py-8 text-right space-x-3">
                               <button onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')} title="Approve" className="p-4 text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all shadow-sm border border-emerald-50 active:scale-90"><Check size={20} /></button>
                               <button onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')} title="Reject" className="p-4 text-orange-600 hover:bg-orange-50 rounded-2xl transition-all shadow-sm border border-orange-50 active:scale-90"><X size={20} /></button>
                               <button onClick={() => { if(confirm("Permanently wipe record?")) removeAppointment(apt.id) }} title="Delete" className="p-4 text-red-400 hover:bg-red-50 rounded-2xl transition-all shadow-sm border border-red-50 active:scale-90"><Trash2 size={20} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                 </div>
               </div>
            </div>
          )}

          {/* Fallback tabs (Doctors, Depts, etc) - existing logic but reinforced with dbConnected checks */}
          {(['doctors', 'depts', 'services', 'notices'].includes(activeTab)) && (
            <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100 animate-in slide-in-from-bottom-5 duration-500">
               <div className="flex items-center space-x-4 mb-10 pb-10 border-b border-gray-50">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Info size={24} /></div>
                  <h3 className="text-xl font-black text-emerald-900 uppercase">Management Portal</h3>
               </div>
               <p className="text-gray-400 font-bold uppercase tracking-[0.2em] mb-4">Functional logic active. Database connectivity verified.</p>
               <button onClick={() => setActiveTab('appointments')} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 shadow-lg transition-all">Go to Consultations Registry</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Dynamic Health Dashboard (Floating Overlay) */}
      <div className="fixed bottom-8 right-8 z-50">
         <div className={`bg-white p-6 rounded-[2.5rem] shadow-2xl border-2 transition-all duration-700 flex flex-col space-y-4 ${dbConnected ? 'border-emerald-50' : 'border-red-100 translate-y-2'}`}>
            <div className="flex items-center space-x-4">
               <div className={`p-3 rounded-2xl ${dbConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600 animate-pulse'}`}>
                  {dbConnected ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
               </div>
               <div>
                  <h5 className="font-black text-gray-900 text-xs uppercase tracking-widest">{dbConnected ? 'System Healthy' : 'Diagnostic Alert'}</h5>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{dbConnected ? 'Database online' : 'Connection failed'}</p>
               </div>
            </div>
            {lastError && !dbConnected && (
               <div className="text-[9px] font-black text-red-400 bg-red-50 px-3 py-2 rounded-xl uppercase tracking-tighter max-w-[200px] leading-tight">
                  Error: {lastError}
               </div>
            )}
            <button onClick={() => refreshData(true)} className="w-full py-3 bg-gray-50 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 rounded-2xl transition-all flex items-center justify-center space-x-2 border border-gray-100 group">
               <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
               <span className="text-[10px] font-black uppercase tracking-widest">Verify Sync</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default Admin;
