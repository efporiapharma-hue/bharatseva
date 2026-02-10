
import React, { useState, useRef, useEffect } from 'react';
import { useHospital } from '../store/HospitalContext';
import { 
  Settings, Users, Calendar, Bell, LayoutGrid, Plus, Trash2, Check, X, 
  Image as ImageIcon, Camera, Lock, RefreshCw,
  ShieldPlus, Activity, BriefcaseMedical, UserPlus, History, AlertTriangle, CloudOff, CheckCircle,
  Info, Database, Upload, MessageSquare
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
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [localConfig, setLocalConfig] = useState<HospitalConfig>(config);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [isAddingApt, setIsAddingApt] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

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
      alert("Specialist registered successfully!");
      refreshData(true);
    }
  };

  const handleManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingApt(true);
    try {
      await bookAppointment(newApt);
      setIsAddingApt(false);
      setNewApt({ patientName: '', patientPhone: '', patientEmail: '', doctorId: '', date: '', timeSlot: '' });
      alert("Consultation logged successfully!");
      refreshData(true);
    } catch (err: any) {
      setIsAddingApt(false);
      alert("Database error: " + err.message);
    }
  };

  const handleConfigSave = async () => {
    setIsSavingConfig(true);
    try {
      await updateConfig(localConfig);
      alert("Institution configuration updated!");
    } catch (err: any) {
      alert("Error saving config: " + err.message);
    } finally {
      setIsSavingConfig(false);
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

          {/* Config Tab */}
          {activeTab === 'config' && (
            <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100 space-y-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 <div className="lg:col-span-1">
                    <label className={labelClasses}>Institution Identity (Logo)</label>
                    <div 
                      onClick={() => logoFileInputRef.current?.click()}
                      className="group relative p-8 bg-gray-50 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all border-gray-100 overflow-hidden"
                    >
                      {localConfig.logo ? (
                        <img 
                          src={localConfig.logo} 
                          className="h-32 object-contain" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/hospital.svg';
                          }}
                        />
                      ) : (
                        <ImageIcon className="text-gray-300" size={64} />
                      )}
                      <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/5 transition-all flex items-center justify-center">
                         <Upload className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-all" size={32} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to Upload Logo</p>
                    </div>
                    <input 
                      type="file" 
                      ref={logoFileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) { 
                          const r = new FileReader(); 
                          r.onloadend = () => setLocalConfig({...localConfig, logo: r.result as string}); 
                          r.readAsDataURL(file); 
                        }
                      }} 
                    />
                    <div className="mt-6">
                      <label className={labelClasses}>Logo URL (Optional Override)</label>
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
              <button 
                onClick={handleConfigSave} 
                disabled={isSavingConfig}
                className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl uppercase transition-all active:scale-95 disabled:opacity-50"
              >
                {isSavingConfig ? 'Saving Changes...' : 'Save Registry Details'}
              </button>
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
                  <h3 className="text-xl font-black mb-10 text-emerald-800 uppercase flex items-center"><Plus className="mr-2"/> Specialist Registry</h3>
                  <form onSubmit={handleDocAdd} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                      <label className={labelClasses}>Portrait Upload</label>
                      <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-square bg-gray-50 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden border-gray-100 hover:border-emerald-200 transition-all">
                        {newDoc.photo ? <img src={newDoc.photo} className="w-full h-full object-cover" /> : <div className="text-center"><Camera size={48} className="text-gray-200 mx-auto" /><p className="text-[10px] font-black text-gray-300 uppercase mt-2">Click to Upload</p></div>}
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) { const r = new FileReader(); r.onloadend = () => setNewDoc({...newDoc, photo: r.result as string}); r.readAsDataURL(file); }
                      }} />
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                      <div className="grid grid-cols-2 gap-8">
                        <div><label className={labelClasses}>Doctor Name</label><input className={inputClasses} value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} required placeholder="e.g. Dr. Ajay" /></div>
                        <div><label className={labelClasses}>Qualifications</label><input className={inputClasses} value={newDoc.qualification} onChange={e => setNewDoc({...newDoc, qualification: e.target.value})} required placeholder="MBBS, MD" /></div>
                      </div>
                      <div><label className={labelClasses}>Clinical Department</label><select className={inputClasses} value={newDoc.departmentId} onChange={e => setNewDoc({...newDoc, departmentId: e.target.value})} required><option value="">Select Department...</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                      <div className="grid grid-cols-2 gap-8">
                        <div><label className={labelClasses}>Working Days</label><input className={inputClasses} value={newDoc.availableDays} onChange={e => setNewDoc({...newDoc, availableDays: e.target.value})} /></div>
                        <div><label className={labelClasses}>Hours</label><input className={inputClasses} value={newDoc.timeSlots} onChange={e => setNewDoc({...newDoc, timeSlots: e.target.value})} /></div>
                      </div>
                      <button type="submit" disabled={isAddingDoc} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-700 shadow-xl uppercase transition-all">{isAddingDoc ? 'Registering...' : 'Complete Registration'}</button>
                    </div>
                  </form>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {doctors.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-300 font-black uppercase tracking-[0.3em] border-2 border-dashed rounded-[3rem] bg-white">
                        <CloudOff size={48} className="mx-auto mb-4 opacity-20" />
                        No doctors visible in Roster
                    </div>
                  ) : doctors.map(doc => (
                    <div key={doc.id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                       <div className="flex items-center space-x-6">
                         <img src={doc.photo} className="w-16 h-16 rounded-2xl object-cover border-4 border-emerald-50" />
                         <div>
                            <h4 className="font-black text-gray-900">{doc.name}</h4>
                            <p className="text-[10px] text-emerald-600 font-black uppercase">{departments.find(d => d.id === doc.departmentId)?.name || 'General Registry'}</p>
                         </div>
                       </div>
                       <button onClick={() => { if(confirm("Remove this specialist?")) removeDoctor(doc.id) }} className="text-red-300 hover:text-red-600 p-3 transition-all"><Trash2 size={24} /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Appointments Tab - Restored UI */}
          {activeTab === 'appointments' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100">
                  <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-tighter mb-10">Manual Consultation Entry</h3>
                  <form onSubmit={handleManualBooking} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div><label className={labelClasses}>Patient Name</label><input className={inputClasses} value={newApt.patientName} onChange={e => setNewApt({...newApt, patientName: e.target.value})} required /></div>
                    <div><label className={labelClasses}>Contact Number</label><input className={inputClasses} value={newApt.patientPhone} onChange={e => setNewApt({...newApt, patientPhone: e.target.value})} required /></div>
                    <div><label className={labelClasses}>Assigned Doctor</label><select className={inputClasses} value={newApt.doctorId} onChange={e => setNewApt({...newApt, doctorId: e.target.value})} required><option value="">Select Doctor...</option>{doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelClasses}>Consultation Date</label><input className={inputClasses} type="date" value={newApt.date} onChange={e => setNewApt({...newApt, date: e.target.value})} required /></div>
                      <div><label className={labelClasses}>Time Slot</label><input className={inputClasses} placeholder="10:00 AM" value={newApt.timeSlot} onChange={e => setNewApt({...newApt, timeSlot: e.target.value})} required /></div>
                    </div>
                    <div className="md:col-span-2"><button type="submit" disabled={isAddingApt} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-700 shadow-xl uppercase">{isAddingApt ? 'Logging...' : 'Log Consultation'}</button></div>
                  </form>
               </div>

               <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                 <div className="p-10 border-b border-gray-100 bg-emerald-50/20 flex flex-col md:flex-row justify-between items-center gap-6">
                   <h3 className="text-2xl font-black text-emerald-900 uppercase">Consultation Registry</h3>
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
                        <tr><th className="px-10 py-6">Patient</th><th className="px-10 py-6">Doctor / Schedule</th><th className="px-10 py-6">Status</th><th className="px-10 py-6 text-right">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredAppointments.length === 0 ? (
                          <tr><td colSpan={4} className="py-24 text-center opacity-30 font-black uppercase tracking-widest">No matching records</td></tr>
                        ) : filteredAppointments.map(apt => (
                          <tr key={apt.id} className="hover:bg-emerald-50/10">
                            <td className="px-10 py-8">
                               <div className="text-gray-900 font-black text-lg">{apt.patientName}</div>
                               <div className="text-emerald-600 font-bold text-xs">{apt.patientPhone}</div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="text-gray-800 font-bold">{doctors.find(d => d.id === apt.doctorId)?.name || 'General Registry'}</div>
                               <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{apt.date} • {apt.timeSlot}</div>
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
                            <td className="px-10 py-8 text-right space-x-2">
                               <button onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')} className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl" title="Confirm"><Check size={20} /></button>
                               <button onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')} className="p-3 text-orange-600 hover:bg-orange-50 rounded-xl" title="Cancel"><X size={20} /></button>
                               <button onClick={() => { if(confirm("Permanently wipe record?")) removeAppointment(apt.id) }} className="p-3 text-red-400 hover:bg-red-50 rounded-xl" title="Delete"><Trash2 size={20} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                 </div>
               </div>
            </div>
          )}

          {/* Departments Tab - Restored UI */}
          {activeTab === 'depts' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
                  <h3 className="text-xl font-black mb-10 text-emerald-800 uppercase flex items-center"><LayoutGrid className="mr-2"/> New Medical Unit Registry</h3>
                  <form onSubmit={async (e) => { e.preventDefault(); await addDepartment(newDept); setNewDept({ name: '', description: '', icon: '🏥' }); alert("Department registered!"); }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div><label className={labelClasses}>Unit Name</label><input className={inputClasses} value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} required placeholder="e.g. Cardiology" /></div>
                      <div><label className={labelClasses}>Icon (Emoji)</label><input className={inputClasses} value={newDept.icon} onChange={e => setNewDept({...newDept, icon: e.target.value})} required /></div>
                    </div>
                    <div><label className={labelClasses}>Clinical Description</label><textarea className={`${inputClasses} h-32 resize-none`} value={newDept.description} onChange={e => setNewDept({...newDept, description: e.target.value})} required placeholder="Scope of the medical unit..." /></div>
                    <button type="submit" className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg uppercase shadow-xl transition-all">Confirm Unit Registry</button>
                  </form>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {departments.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-gray-400 font-bold uppercase tracking-widest border-2 border-dashed rounded-[3rem]">No departments found</div>
                  ) : departments.map(dept => (
                    <div key={dept.id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 flex items-center justify-between group">
                       <div className="flex items-center space-x-6">
                         <div className="text-4xl">{dept.icon}</div>
                         <div><h4 className="font-black text-gray-900 uppercase tracking-tighter">{dept.name}</h4><p className="text-[10px] text-gray-400 font-bold uppercase line-clamp-1">{dept.description}</p></div>
                       </div>
                       <button onClick={() => { if(confirm("Delete this department?")) removeDepartment(dept.id) }} className="text-red-200 hover:text-red-600 transition-all"><Trash2 size={20} /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Services Tab - Restored UI */}
          {activeTab === 'services' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
                  <h3 className="text-xl font-black mb-10 text-emerald-800 uppercase flex items-center"><ShieldPlus className="mr-2"/> Facility & Service Registry</h3>
                  <form onSubmit={async (e) => { e.preventDefault(); await addService(newService); setNewService({ title: '', description: '' }); alert("Facility registered!"); }} className="space-y-8">
                    <div><label className={labelClasses}>Facility Title</label><input className={inputClasses} value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required placeholder="e.g. 24/7 Diagnostic Lab" /></div>
                    <div><label className={labelClasses}>Facility Details</label><textarea className={`${inputClasses} h-32 resize-none`} value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required placeholder="Equipment, hours, specific capabilities..." /></div>
                    <button type="submit" className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg uppercase shadow-xl transition-all">Register Facility</button>
                  </form>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-gray-400 font-bold uppercase tracking-widest border-2 border-dashed rounded-[3rem]">No services registered</div>
                  ) : services.map(service => (
                    <div key={service.id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 flex items-center justify-between group">
                       <div className="flex items-center space-x-6">
                         <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600"><BriefcaseMedical size={24} /></div>
                         <div><h4 className="font-black text-gray-900 leading-tight">{service.title}</h4><p className="text-[10px] text-gray-400 font-bold uppercase line-clamp-1">{service.description}</p></div>
                       </div>
                       <button onClick={() => { if(confirm("Remove this service?")) removeService(service.id) }} className="text-red-200 hover:text-red-600 transition-all"><Trash2 size={20} /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Notices Tab - Restored UI */}
          {activeTab === 'notices' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
                  <h3 className="text-xl font-black mb-10 text-emerald-800 uppercase flex items-center"><Bell className="mr-2"/> Medical Bulletin Broadcaster</h3>
                  <form onSubmit={async (e) => { e.preventDefault(); await addNotice(newNotice); setNewNotice({ title: '', content: '', date: new Date().toLocaleDateString(), isImportant: false }); alert("Notice published!"); }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div><label className={labelClasses}>Bulletin Title</label><input className={inputClasses} value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} required /></div>
                      <div><label className={labelClasses}>Effective Date</label><input className={inputClasses} value={newNotice.date} onChange={e => setNewNotice({...newNotice, date: e.target.value})} required /></div>
                    </div>
                    <div><label className={labelClasses}>Message Content</label><textarea className={`${inputClasses} h-32 resize-none`} value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} required></textarea></div>
                    <div className="flex items-center space-x-4 bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-100">
                      <input type="checkbox" id="imp" checked={newNotice.isImportant} onChange={e => setNewNotice({...newNotice, isImportant: e.target.checked})} className="w-6 h-6 accent-emerald-600 cursor-pointer" />
                      <label htmlFor="imp" className="font-black text-xs uppercase tracking-widest text-emerald-800 cursor-pointer">Mark as High Priority (Critical Alert)</label>
                    </div>
                    <button type="submit" className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg uppercase shadow-xl hover:bg-emerald-700 transition-all">Broadcast Bulletin</button>
                  </form>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {notices.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-gray-300 font-bold uppercase tracking-[0.3em] border-2 border-dashed rounded-[3rem]">No bulletins found</div>
                  ) : notices.map(n => (
                    <div key={n.id} className={`p-10 rounded-[3.5rem] shadow-xl border-4 relative group transition-all ${n.isImportant ? 'bg-red-50 border-red-100' : 'bg-white border-emerald-50'}`}>
                       {n.isImportant && <div className="absolute top-0 right-10 bg-red-600 text-white text-[10px] font-black uppercase px-5 py-2 rounded-b-xl shadow-lg">Important Alert</div>}
                       <h4 className="font-black text-2xl mb-4 text-gray-900 leading-tight">{n.title}</h4>
                       <p className="text-gray-500 text-sm font-bold leading-relaxed mb-8 line-clamp-4">{n.content}</p>
                       <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{n.date}</span>
                          <button onClick={() => { if(confirm("Remove this bulletin?")) removeNotice(n.id) }} className="p-3 text-red-200 hover:text-red-600 transition-all"><Trash2 size={24} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating System Health & Diagnostic Dashboard */}
      <div className="fixed bottom-8 right-8 z-50">
         <div className={`bg-white p-8 rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-2 transition-all duration-700 flex flex-col space-y-6 min-w-[300px] ${dbConnected ? 'border-emerald-50' : 'border-red-100 translate-y-2'}`}>
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl ${dbConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600 animate-pulse'}`}>
                     {dbConnected ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
                  </div>
                  <div>
                     <h5 className="font-black text-gray-900 text-sm uppercase tracking-tighter">{dbConnected ? 'Sync Status: Active' : 'Sync Status: Offline'}</h5>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Digital Communique Hub</p>
                  </div>
               </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-3">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span className="flex items-center"><Database size={12} className="mr-1" /> Specialists Table</span>
                  <span className={doctors.length > 0 ? 'text-emerald-600' : 'text-orange-500'}>{doctors.length} Records</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span className="flex items-center"><Calendar size={12} className="mr-1" /> Appointments</span>
                  <span className="text-emerald-600">{appointments.length} Records</span>
               </div>
            </div>

            {lastError && (
               <div className="text-[9px] font-black text-red-400 bg-red-50 px-4 py-3 rounded-2xl uppercase tracking-tighter leading-tight border border-red-100">
                  System Diagnostic: {lastError}
               </div>
            )}

            <button onClick={() => refreshData(true)} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-95 group">
               <RefreshCw size={18} className={`${dbLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
               <span className="text-xs font-black uppercase tracking-[0.2em]">Verify Sync</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default Admin;
