
import React, { useState, useRef, useEffect } from 'react';
import { useHospital } from '../store/HospitalContext';
import { 
  Settings, Users, Calendar, Bell, LayoutGrid, Plus, Trash2, Check, X, 
  Image as ImageIcon, Camera, Lock, RefreshCw,
  ShieldPlus, Activity, BriefcaseMedical, UserPlus, History, AlertTriangle, CloudOff, CheckCircle,
  Info, Database, Upload, Terminal, Copy, Globe, Server, MessageSquare
} from 'lucide-react';
import { Appointment, Doctor, HospitalConfig } from '../types';

const Admin = () => {
  const { 
    config, updateConfig, doctors, addDoctor, removeDoctor, 
    departments, addDepartment, removeDepartment,
    services, addService, removeService,
    appointments, updateAppointmentStatus, bookAppointment, removeAppointment,
    notices, addNotice, removeNotice,
    refreshData, loading: dbLoading, dbConnected, isDemoMode, lastError
  } = useHospital();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ id: '', password: '' });
  const [activeTab, setActiveTab] = useState<'config' | 'doctors' | 'appointments' | 'notices' | 'depts' | 'services' | 'diagnostics'>('config');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Cancelled'>('All');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [localConfig, setLocalConfig] = useState<HospitalConfig>(config);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [isAddingApt, setIsAddingApt] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => { setLocalConfig(config); }, [config]);

  // Form States
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

  const SQL_SNIPPET = `-- MASTER LIVE INITIALIZATION SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR TO GO LIVE

CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  qualification TEXT,
  photo TEXT,
  department_id TEXT,
  available_days TEXT[],
  time_slots TEXT[]
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  patient_email TEXT,
  doctor_id TEXT,
  date TEXT,
  time_slot TEXT,
  status TEXT DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  date TEXT,
  is_important BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS hospital_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  logo TEXT,
  address TEXT,
  phone TEXT,
  email TEXT
);`;

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
      alert("Live Registry Updated!");
      refreshData(true);
    }
  };

  const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3";
  const inputClasses = "w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-gray-800 text-lg";

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      await updateConfig(localConfig);
      alert("Institutional Identity Broadcast Successful!");
    } catch (err) {
      alert("Broadcast failed. Check system health.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center">
          <div className="bg-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"><Lock className="text-white" size={32} /></div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-8">Admin Gateway</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="text" placeholder="Admin ID" className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none font-bold" value={loginCreds.id} onChange={e => setLoginCreds({...loginCreds, id: e.target.value})} required />
            <input type="password" placeholder="Password" className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none font-bold" value={loginCreds.password} onChange={e => setLoginCreds({...loginCreds, password: e.target.value})} required />
            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl text-lg uppercase tracking-widest">Login to Sync</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-72 bg-[#111827] text-white p-8 hidden lg:block sticky top-0 h-screen border-r border-gray-800">
        <div className="flex items-center space-x-3 mb-12">
           <div className="bg-emerald-600 p-2 rounded-xl"><Activity className="text-white" size={24} /></div>
           <h2 className="text-xl font-black uppercase tracking-tighter">Bharat Live</h2>
        </div>
        <nav className="space-y-2">
          {[
            { id: 'config', label: 'Hospital Info', icon: Settings },
            { id: 'doctors', label: 'Doctor Roster', icon: Users },
            { id: 'depts', label: 'Clinical Depts', icon: LayoutGrid },
            { id: 'services', label: 'Our Facilities', icon: ShieldPlus },
            { id: 'appointments', label: 'Consultations', icon: Calendar },
            { id: 'notices', label: 'Bulletin Board', icon: Bell },
            { id: 'diagnostics', label: 'System Health', icon: Globe }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <tab.icon className="mr-4" size={20} /> {tab.label}
            </button>
          ))}
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 transition-all mt-10 border-t border-gray-800 pt-10"><X className="mr-4" /> Log Out</button>
        </nav>
      </div>

      <div className="flex-grow p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
             <div className="flex items-center space-x-6">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">{activeTab}</h1>
                <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm border">
                  <div className={`w-3 h-3 rounded-full ${dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{dbConnected ? 'Live Connection' : 'Sync Required'}</span>
                </div>
             </div>
             <button onClick={() => refreshData(true)} className={`p-4 bg-white rounded-2xl shadow-md hover:bg-emerald-50 transition-all border border-gray-100 ${dbLoading ? 'animate-spin' : ''}`}>
               <RefreshCw size={24} className="text-emerald-600" />
             </button>
          </div>

          {activeTab === 'config' && (
             <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100 space-y-12 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                   <div className="lg:col-span-1">
                      <label className={labelClasses}>Live Identity (Logo)</label>
                      <div onClick={() => logoFileInputRef.current?.click()} className="group relative p-8 bg-gray-50 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-emerald-200 transition-all overflow-hidden">
                         {localConfig.logo ? <img src={localConfig.logo} className="h-48 w-full object-contain" /> : <ImageIcon className="text-gray-300" size={64} />}
                         <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-all flex items-center justify-center">
                            <Upload className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-all" size={32} />
                         </div>
                      </div>
                      <input type="file" ref={logoFileInputRef} className="hidden" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) { const r = new FileReader(); r.onloadend = () => setLocalConfig({...localConfig, logo: r.result as string}); r.readAsDataURL(file); }
                      }} />
                   </div>
                   <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className={labelClasses}>Hospital Name</label>
                        <input className={inputClasses} value={localConfig.name} onChange={e => setLocalConfig({...localConfig, name: e.target.value})} placeholder="Full Institutional Name" />
                      </div>
                      <div>
                        <label className={labelClasses}>Contact Phone</label>
                        <input className={inputClasses} value={localConfig.phone} onChange={e => setLocalConfig({...localConfig, phone: e.target.value})} placeholder="+91 00000 00000" />
                      </div>
                      <div>
                        <label className={labelClasses}>Official Email</label>
                        <input className={inputClasses} value={localConfig.email} onChange={e => setLocalConfig({...localConfig, email: e.target.value})} placeholder="contact@hospital.in" />
                      </div>
                      <div>
                        <label className={labelClasses}>Institution Address</label>
                        <input className={inputClasses} value={localConfig.address} onChange={e => setLocalConfig({...localConfig, address: e.target.value})} placeholder="Complete Postal Address" />
                      </div>
                   </div>
                </div>
                <button 
                  onClick={handleSaveConfig} 
                  disabled={isSavingConfig}
                  className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl uppercase transition-all disabled:opacity-50"
                >
                  {isSavingConfig ? 'Broadcasting...' : 'Broadcast Identity'}
                </button>
             </div>
          )}

          {activeTab === 'doctors' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100">
                  <h3 className="text-xl font-black mb-10 text-emerald-800 uppercase flex items-center"><Plus className="mr-2"/> New Live Specialist</h3>
                  <form onSubmit={handleDocAdd} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                      <label className={labelClasses}>Portrait Upload</label>
                      <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-square bg-gray-50 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-emerald-200 transition-all">
                        {newDoc.photo ? <img src={newDoc.photo} className="w-full h-full object-cover" /> : <div className="text-center"><Camera size={48} className="text-gray-200 mx-auto" /><p className="text-[10px] font-black text-gray-300 uppercase mt-2">Upload Photo</p></div>}
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) { const r = new FileReader(); r.onloadend = () => setNewDoc({...newDoc, photo: r.result as string}); r.readAsDataURL(file); }
                      }} />
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                      <div className="grid grid-cols-2 gap-8">
                        <div><label className={labelClasses}>Full Name</label><input className={inputClasses} value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} required placeholder="e.g. Dr. Ajay" /></div>
                        <div><label className={labelClasses}>Degree / Qual</label><input className={inputClasses} value={newDoc.qualification} onChange={e => setNewDoc({...newDoc, qualification: e.target.value})} required placeholder="MBBS, MD" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div><label className={labelClasses}>Available Days</label><input className={inputClasses} value={newDoc.availableDays} onChange={e => setNewDoc({...newDoc, availableDays: e.target.value})} placeholder="Mon, Wed, Fri" /></div>
                        <div><label className={labelClasses}>Time Slots</label><input className={inputClasses} value={newDoc.timeSlots} onChange={e => setNewDoc({...newDoc, timeSlots: e.target.value})} placeholder="10:00 AM - 1:00 PM" /></div>
                      </div>
                      <button type="submit" disabled={isAddingDoc} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-700 shadow-xl uppercase transition-all">Add Specialist to Cloud</button>
                    </div>
                  </form>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {doctors.map(doc => (
                    <div key={doc.id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                         <img src={doc.photo} className="w-16 h-16 rounded-2xl object-cover border-4 border-emerald-50" />
                         <div className="overflow-hidden">
                            <h4 className="font-black text-gray-900 truncate">{doc.name}</h4>
                            <p className="text-[10px] text-emerald-600 font-black uppercase">{doc.qualification}</p>
                         </div>
                       </div>
                       <button onClick={() => { if(confirm("Remove?")) removeDoctor(doc.id) }} className="text-red-300 hover:text-red-600 p-3 transition-all"><Trash2 size={24} /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'depts' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
                  <h3 className="text-xl font-black mb-10 text-emerald-800 uppercase flex items-center"><LayoutGrid className="mr-2"/> New Medical Unit</h3>
                  <form onSubmit={async (e) => { e.preventDefault(); await addDepartment(newDept); setNewDept({ name: '', description: '', icon: '🏥' }); alert("Unit Added!"); }} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div><label className={labelClasses}>Unit Name</label><input className={inputClasses} value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} required /></div>
                      <div><label className={labelClasses}>Icon (Emoji)</label><input className={inputClasses} value={newDept.icon} onChange={e => setNewDept({...newDept, icon: e.target.value})} required /></div>
                    </div>
                    <div><label className={labelClasses}>Clinical Description</label><textarea className={`${inputClasses} h-32 resize-none`} value={newDept.description} onChange={e => setNewDept({...newDept, description: e.target.value})} required /></div>
                    <button type="submit" className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg uppercase shadow-xl transition-all">Register Unit</button>
                  </form>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {departments.map(dept => (
                    <div key={dept.id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 flex items-center justify-between">
                       <div className="flex items-center space-x-6">
                         <div className="text-4xl">{dept.icon}</div>
                         <div><h4 className="font-black text-gray-900 uppercase tracking-tighter">{dept.name}</h4></div>
                       </div>
                       <button onClick={() => removeDepartment(dept.id)} className="text-red-200 hover:text-red-600 transition-all"><Trash2 size={20} /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
                  <h3 className="text-xl font-black mb-10 text-emerald-800 uppercase flex items-center"><ShieldPlus className="mr-2"/> Register Facility</h3>
                  <form onSubmit={async (e) => { e.preventDefault(); await addService(newService); setNewService({ title: '', description: '' }); alert("Service Added!"); }} className="space-y-8">
                    <div><label className={labelClasses}>Service Title</label><input className={inputClasses} value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required /></div>
                    <div><label className={labelClasses}>Facility Details</label><textarea className={`${inputClasses} h-32 resize-none`} value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required /></div>
                    <button type="submit" className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg uppercase shadow-xl transition-all">Register Facility</button>
                  </form>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map(s => (
                    <div key={s.id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 flex items-center justify-between">
                       <div><h4 className="font-black text-gray-900">{s.title}</h4></div>
                       <button onClick={() => removeService(s.id)} className="text-red-200 hover:text-red-600 transition-all"><Trash2 size={20} /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
                  <h3 className="text-xl font-black mb-10 text-emerald-800 uppercase flex items-center"><Bell className="mr-2"/> Broadcast Bulletin</h3>
                  <form onSubmit={async (e) => { e.preventDefault(); await addNotice(newNotice); setNewNotice({ title: '', content: '', date: new Date().toLocaleDateString(), isImportant: false }); alert("Published!"); }} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div><label className={labelClasses}>Bulletin Title</label><input className={inputClasses} value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} required /></div>
                      <div><label className={labelClasses}>Broadcasting Date</label><input className={inputClasses} value={newNotice.date} onChange={e => setNewNotice({...newNotice, date: e.target.value})} required /></div>
                    </div>
                    <div><label className={labelClasses}>Message Body</label><textarea className={`${inputClasses} h-32 resize-none`} value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} required /></div>
                    <div className="flex items-center space-x-4 bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-100">
                      <input type="checkbox" id="imp" checked={newNotice.isImportant} onChange={e => setNewNotice({...newNotice, isImportant: e.target.checked})} className="w-6 h-6 accent-emerald-600" />
                      <label htmlFor="imp" className="font-black text-xs uppercase tracking-widest text-emerald-800 cursor-pointer">Mark as Critical Alert</label>
                    </div>
                    <button type="submit" className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg uppercase shadow-xl hover:bg-emerald-700 transition-all">Broadcast Bulletin</button>
                  </form>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {notices.map(n => (
                    <div key={n.id} className={`p-10 rounded-[3.5rem] shadow-xl border-4 ${n.isImportant ? 'bg-red-50 border-red-100' : 'bg-white border-emerald-50'}`}>
                       <h4 className="font-black text-2xl mb-4 text-gray-900 leading-tight">{n.title}</h4>
                       <p className="text-gray-500 text-sm font-bold mb-8 line-clamp-3">{n.content}</p>
                       <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{n.date}</span>
                          <button onClick={() => removeNotice(n.id)} className="text-red-200 hover:text-red-600 transition-all"><Trash2 size={24} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                 <div className="p-10 border-b border-gray-100 bg-emerald-50/20 flex justify-between items-center">
                   <h3 className="text-2xl font-black text-emerald-900 uppercase">Live Registry Feed</h3>
                   <div className="flex bg-white p-2 rounded-2xl border-2 border-emerald-50">
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
                        <tr><th className="px-10 py-6">Patient</th><th className="px-10 py-6">Schedule</th><th className="px-10 py-6">Status</th><th className="px-10 py-6 text-right">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredAppointments.map(apt => (
                          <tr key={apt.id} className="hover:bg-emerald-50/10 transition-colors">
                            <td className="px-10 py-8">
                               <div className="text-gray-900 font-black text-lg">{apt.patientName}</div>
                               <div className="text-emerald-600 font-bold text-xs">{apt.patientPhone}</div>
                            </td>
                            <td className="px-10 py-8 text-gray-600 font-bold uppercase text-xs tracking-widest">
                               {apt.date} • {apt.timeSlot}
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
                               <button onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')} className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl"><Check size={20} /></button>
                               <button onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')} className="p-3 text-orange-600 hover:bg-orange-50 rounded-xl"><X size={20} /></button>
                               <button onClick={() => removeAppointment(apt.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-10 rounded-[3rem] border-4 border-gray-100 shadow-xl relative">
                  <button onClick={() => { navigator.clipboard.writeText(SQL_SNIPPET); alert("SQL Copied!"); }} className="absolute top-10 right-10 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-black transition-all flex items-center text-xs font-black uppercase tracking-widest shadow-xl">
                    <Copy size={16} className="mr-2" /> Copy Full SQL
                  </button>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-8">Master Initialization Script</h3>
                  <div className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-100 max-h-[400px] overflow-y-auto">
                     <pre className="text-gray-700 font-mono text-sm leading-relaxed">{SQL_SNIPPET}</pre>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
