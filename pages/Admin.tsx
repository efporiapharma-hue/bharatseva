
import React, { useState, useRef, useEffect } from 'react';
import { useHospital } from '../store/HospitalContext';
import { 
  Settings, Users, Calendar, Bell, LayoutGrid, Plus, Trash2, Check, X, 
  Image as ImageIcon, Camera, Lock, RefreshCw,
  ShieldPlus, Activity, BriefcaseMedical, UserPlus, History, AlertTriangle, CloudOff, CheckCircle,
  Info, Database, Upload, Terminal, Copy
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

  const SQL_SNIPPET = `-- RUN THIS IN SUPABASE SQL EDITOR TO FIX ERRORS
CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT, qualification TEXT, photo TEXT, department_id TEXT,
  available_days TEXT[], time_slots TEXT[]
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT, patient_phone TEXT, patient_email TEXT,
  doctor_id TEXT, date TEXT, time_slot TEXT, status TEXT DEFAULT 'Pending'
);`;

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
      alert(isDemoMode ? "Doctor added to Local Storage (Demo Mode)." : "Specialist registered successfully!");
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
      alert("Consultation logged!");
      refreshData(true);
    } catch (err: any) {
      setIsAddingApt(false);
      alert("Error: " + err.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md">
          <div className="text-center mb-10">
            <div className="bg-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"><Lock className="text-white" size={32} /></div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Admin Gateway</h1>
            <p className="text-gray-400 text-sm mt-2 font-bold uppercase tracking-widest">Secure Institutional Access</p>
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
            { id: 'notices', label: 'Bulletin Board', icon: Bell },
            { id: 'diagnostics', label: 'DB Diagnostics', icon: Terminal }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <tab.icon className="mr-4" size={20} /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header Status Bar */}
          <div className="flex justify-between items-center mb-12">
             <div className="flex items-center space-x-6">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">{activeTab}</h1>
                <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm border">
                  <div className={`w-3 h-3 rounded-full ${dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`}></div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{dbConnected ? 'Live Connection' : 'Local/Demo Mode'}</span>
                </div>
             </div>
             <button onClick={() => refreshData(true)} className={`p-4 bg-white rounded-2xl shadow-md hover:bg-emerald-50 transition-all border border-gray-100 ${dbLoading ? 'animate-spin' : ''}`}>
               <RefreshCw size={24} className="text-emerald-600" />
             </button>
          </div>

          {/* Diagnostics Tab - Fix for Database Errors */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-red-50 border-4 border-red-100 p-10 rounded-[3rem]">
                  <div className="flex items-start space-x-6">
                     <AlertTriangle className="text-red-600 mt-1" size={48} />
                     <div>
                        <h2 className="text-2xl font-black text-red-900 uppercase mb-4">Database Schema Error Detected</h2>
                        <p className="text-red-700 font-bold mb-6">Your Supabase project is missing the required tables. Follow the steps below to fix "Table not found" errors.</p>
                        <div className="bg-gray-900 p-8 rounded-3xl relative">
                           <button 
                             onClick={() => { navigator.clipboard.writeText(SQL_SNIPPET); alert("SQL Copied!"); }}
                             className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all flex items-center text-xs font-black uppercase tracking-widest"
                           >
                             <Copy size={16} className="mr-2" /> Copy SQL
                           </button>
                           <pre className="text-emerald-400 font-mono text-sm overflow-x-auto">
                              {SQL_SNIPPET}
                           </pre>
                        </div>
                        <ol className="mt-8 space-y-4 text-red-900 font-bold list-decimal pl-6">
                           <li>Go to your Supabase Dashboard</li>
                           <li>Click on "SQL Editor" in the sidebar</li>
                           <li>Paste the code above and click "Run"</li>
                           <li>Refresh this Admin panel</li>
                        </ol>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Doctors Tab - Redesigned for reliability */}
          {activeTab === 'doctors' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100">
                  <h3 className="text-xl font-black mb-10 text-emerald-800 uppercase flex items-center"><Plus className="mr-2"/> New Specialist Entry</h3>
                  <form onSubmit={handleDocAdd} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                      <label className={labelClasses}>Specialist Photo</label>
                      <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-square bg-gray-50 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-emerald-200 transition-all">
                        {newDoc.photo ? <img src={newDoc.photo} className="w-full h-full object-cover" /> : <div className="text-center"><Camera size={48} className="text-gray-200 mx-auto" /><p className="text-[10px] font-black text-gray-300 uppercase mt-2">Click to Upload</p></div>}
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
                      <button type="submit" disabled={isAddingDoc} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-700 shadow-xl uppercase transition-all">{isAddingDoc ? 'Registering...' : 'Add Specialist'}</button>
                    </div>
                  </form>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {doctors.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-300 font-black uppercase tracking-[0.3em] border-2 border-dashed rounded-[3rem] bg-white">
                        <CloudOff size={48} className="mx-auto mb-4 opacity-20" />
                        No records found
                    </div>
                  ) : doctors.map(doc => (
                    <div key={doc.id} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                       <div className="flex items-center space-x-6">
                         <img src={doc.photo} className="w-16 h-16 rounded-2xl object-cover border-4 border-emerald-50" />
                         <div className="overflow-hidden">
                            <h4 className="font-black text-gray-900 truncate">{doc.name}</h4>
                            <p className="text-[10px] text-emerald-600 font-black uppercase">{doc.qualification}</p>
                         </div>
                       </div>
                       <button onClick={() => { if(confirm("Remove this entry?")) removeDoctor(doc.id) }} className="text-red-300 hover:text-red-600 p-3 transition-all"><Trash2 size={24} /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Configuration Tab */}
          {activeTab === 'config' && (
             <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100 space-y-12 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                   <div className="lg:col-span-1">
                      <label className={labelClasses}>Institution Logo</label>
                      <div onClick={() => logoFileInputRef.current?.click()} className="group relative p-8 bg-gray-50 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-emerald-200 transition-all overflow-hidden">
                         {localConfig.logo ? <img src={localConfig.logo} className="h-32 object-contain" /> : <ImageIcon className="text-gray-300" size={64} />}
                         <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/5 transition-all flex items-center justify-center">
                            <Upload className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-all" size={32} />
                         </div>
                      </div>
                      <input type="file" ref={logoFileInputRef} className="hidden" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) { const r = new FileReader(); r.onloadend = () => setLocalConfig({...localConfig, logo: r.result as string}); r.readAsDataURL(file); }
                      }} />
                   </div>
                   <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div><label className={labelClasses}>Institution Name</label><input className={inputClasses} value={localConfig.name} onChange={e => setLocalConfig({...localConfig, name: e.target.value})} /></div>
                      <div><label className={labelClasses}>Contact Number</label><input className={inputClasses} value={localConfig.phone} onChange={e => setLocalConfig({...localConfig, phone: e.target.value})} /></div>
                   </div>
                </div>
                <button onClick={() => updateConfig(localConfig)} disabled={isSavingConfig} className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl uppercase transition-all">Save Institutional Details</button>
             </div>
          )}

          {/* Simple Info tabs for others */}
          {['appointments', 'depts', 'services', 'notices'].includes(activeTab) && (
            <div className="bg-white p-20 rounded-[3rem] shadow-xl border border-gray-100 text-center">
               <Info size={48} className="mx-auto text-emerald-600 mb-6" />
               <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">{activeTab} Interface Online</h3>
               <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-10">Data syncing is active. Add specialist from Doctors Roster to begin.</p>
               <button onClick={() => setActiveTab('doctors')} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-sm shadow-xl">Back to Doctors Roster</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating System Health & Diagnostic Dashboard */}
      <div className="fixed bottom-8 right-8 z-50">
         <div className={`bg-white p-8 rounded-[3rem] shadow-2xl border-2 transition-all duration-700 min-w-[320px] ${dbConnected ? 'border-emerald-50' : 'border-orange-100'}`}>
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl ${dbConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600 animate-pulse'}`}>
                     {dbConnected ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
                  </div>
                  <div>
                     <h5 className="font-black text-gray-900 text-sm uppercase tracking-tighter">{dbConnected ? 'Sync: Healthy' : 'Mode: Local'}</h5>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Bharat Seva Digital Hub</p>
                  </div>
               </div>
            </div>
            
            {!dbConnected && (
               <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-100 rounded-2xl">
                  <p className="text-[10px] font-black text-orange-800 uppercase leading-tight mb-3 flex items-center">
                     <Terminal size={12} className="mr-2" /> Action Required
                  </p>
                  <button onClick={() => setActiveTab('diagnostics')} className="w-full py-3 bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-orange-700 transition-all">Setup Live Database</button>
               </div>
            )}

            <button onClick={() => refreshData(true)} className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-95 group">
               <RefreshCw size={18} className={`${dbLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
               <span className="text-xs font-black uppercase tracking-[0.2em]">Check Registry Sync</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default Admin;
