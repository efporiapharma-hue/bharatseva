
import React, { useState, useRef, useEffect } from 'react';
import { useHospital } from '../store/HospitalContext';
import { 
  Settings, 
  Users, 
  Calendar, 
  Bell, 
  LayoutGrid, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Image as ImageIcon,
  Edit2,
  Save,
  Upload,
  Camera,
  Lock,
  LogIn,
  AlertCircle
} from 'lucide-react';
import { Appointment, Doctor } from '../types';

const Admin = () => {
  const { 
    config, updateConfig, 
    doctors, addDoctor, removeDoctor, 
    departments, addDepartment, removeDepartment,
    services, addService, removeService,
    appointments, updateAppointment, updateAppointmentStatus,
    notices, addNotice, removeNotice 
  } = useHospital();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'config' | 'doctors' | 'appointments' | 'notices' | 'depts'>('config');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const [newDoc, setNewDoc] = useState({ 
    name: '', 
    qualification: '', 
    departmentId: '', 
    photo: '', 
    availableDays: 'Mon, Wed, Fri', 
    timeSlots: '10:00 AM - 1:00 PM, 4:00 PM - 7:00 PM' 
  });

  useEffect(() => {
    if (departments.length > 0 && !newDoc.departmentId) {
      setNewDoc(prev => ({ ...prev, departmentId: departments[0].id }));
    }
  }, [departments]);

  const [newNotice, setNewNotice] = useState({ title: '', content: '', isImportant: false });
  const [newDept, setNewDept] = useState({ name: '', description: '', icon: '' });
  const [newService, setNewService] = useState({ title: '', description: '' });

  const [editingAptId, setEditingAptId] = useState<string | null>(null);
  const [editAptData, setEditAptData] = useState<Partial<Appointment>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginCreds.id === 'admin' && loginCreds.password === 'admin') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Credentials');
    }
  };

  const handleDocAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.photo) {
      alert("Please upload a specialist portrait.");
      return;
    }
    try {
      await addDoctor({
        ...newDoc,
        availableDays: newDoc.availableDays.split(',').map(d => d.trim()),
        timeSlots: newDoc.timeSlots.split(',').map(s => s.trim())
      });
      setNewDoc({ 
        name: '', 
        qualification: '', 
        departmentId: departments[0]?.id || '', 
        photo: '', 
        availableDays: 'Mon, Wed, Fri', 
        timeSlots: '10:00 AM - 1:00 PM, 4:00 PM - 7:00 PM' 
      });
      alert('Doctor registered successfully!');
    } catch (err) {
      alert('Failed to register doctor.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDoc({ ...newDoc, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateConfig({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNoticeAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNotice({ ...newNotice, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) });
    setNewNotice({ title: '', content: '', isImportant: false });
    alert('Announcement published!');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md">
          <div className="text-center mb-10">
            <div className="bg-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/20">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 font-medium mt-2">Sign in as Administrator</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Administrator ID</label>
              <input 
                type="text" 
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold"
                placeholder="ID"
                value={loginCreds.id}
                onChange={e => setLoginCreds({...loginCreds, id: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Secure Password</label>
              <input 
                type="password" 
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold"
                placeholder="Password"
                value={loginCreds.password}
                onChange={e => setLoginCreds({...loginCreds, password: e.target.value})}
              />
            </div>
            {loginError && <p className="text-red-500 text-sm font-bold text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl flex items-center justify-center group">
              Access Dashboard <LogIn size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <p className="text-center mt-8 text-[10px] text-gray-400 font-black uppercase tracking-widest">ID: admin | Pass: admin</p>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white text-gray-900 focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium placeholder-gray-400";
  const labelClasses = "block text-xs font-black text-gray-500 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-[#111827] text-white min-h-screen p-8 hidden lg:block sticky top-0 h-screen shadow-2xl">
        <div className="flex items-center space-x-3 mb-12">
          <div className="bg-emerald-600 p-2 rounded-xl">
             <Settings className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-black tracking-tighter">Admin <span className="text-emerald-500">Panel</span></h2>
        </div>
        
        <nav className="space-y-3">
          {[
            { id: 'config', label: 'General Settings', icon: Settings },
            { id: 'doctors', label: 'Manage Doctors', icon: Users },
            { id: 'depts', label: 'Departments & Services', icon: LayoutGrid },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'notices', label: 'Announcements', icon: Bell },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all font-bold ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 translate-x-1' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <tab.icon className="mr-4" size={20} /> {tab.label}
            </button>
          ))}
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center px-5 py-4 rounded-2xl transition-all font-bold text-red-400 hover:bg-red-500/10 mt-10"
          >
            <Lock className="mr-4" size={20} /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-10 lg:p-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
             <div>
               <h1 className="text-4xl font-black text-gray-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h1>
               <p className="text-gray-500 font-medium mt-1">Real-time Healthcare Management</p>
             </div>
             <div className="flex items-center space-x-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-black">AD</div>
                <div>
                   <span className="block text-sm font-black text-gray-900">Administrator</span>
                   <span className="block text-xs text-emerald-600 font-bold uppercase tracking-tighter">System Superuser</span>
                </div>
             </div>
          </div>

          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div className="space-y-8">
               <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black mb-8 flex items-center text-gray-800"><ImageIcon className="mr-3 text-emerald-600" /> Hospital Branding</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className={labelClasses}>Hospital Public Name</label>
                        <input 
                          type="text" 
                          value={config.name} 
                          onChange={(e) => updateConfig({ name: e.target.value })}
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Upload Brand Logo</label>
                        <div 
                          onClick={() => logoFileInputRef.current?.click()}
                          className="flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all group"
                        >
                           <span className="text-sm font-bold group-hover:text-emerald-700">Click to Select File</span>
                           <Upload size={18} className="text-gray-400 group-hover:text-emerald-600" />
                        </div>
                        <input type="file" ref={logoFileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-8">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[200px] aspect-square flex items-center justify-center">
                           <img src={config.logo} alt="Logo Preview" className="w-full h-auto object-contain max-h-full" />
                        </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="space-y-12">
               <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black mb-10 flex items-center text-gray-800"><Plus className="mr-3 text-emerald-600" /> Register New Specialist</h3>
                  <form onSubmit={handleDocAdd} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-1">
                        <label className={labelClasses}>Specialist Portrait</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group overflow-hidden relative"
                        >
                          {newDoc.photo ? (
                            <img src={newDoc.photo} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center">
                              <Camera size={32} className="text-emerald-600 mb-2 mx-auto" />
                              <span className="text-xs font-bold text-gray-400">Upload Photo</span>
                            </div>
                          )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                      </div>

                      <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                             <label className={labelClasses}>Full Name</label>
                             <input placeholder="Dr. Vikram Singh" className={inputClasses} value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} required />
                          </div>
                          <div>
                             <label className={labelClasses}>Qualifications</label>
                             <input placeholder="MBBS, MD" className={inputClasses} value={newDoc.qualification} onChange={e => setNewDoc({...newDoc, qualification: e.target.value})} required />
                          </div>
                        </div>
                        <div>
                           <label className={labelClasses}>Assigned Department</label>
                           <select className={inputClasses} value={newDoc.departmentId} onChange={e => setNewDoc({...newDoc, departmentId: e.target.value})} required >
                             <option value="">Choose Department...</option>
                             {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                           </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                             <label className={labelClasses}>Working Days (Comma separated)</label>
                             <input placeholder="Mon, Wed, Fri" className={inputClasses} value={newDoc.availableDays} onChange={e => setNewDoc({...newDoc, availableDays: e.target.value})} required />
                          </div>
                          <div>
                             <label className={labelClasses}>Time Slots (Comma separated)</label>
                             <input placeholder="10:00 AM - 1:00 PM" className={inputClasses} value={newDoc.timeSlots} onChange={e => setNewDoc({...newDoc, timeSlots: e.target.value})} required />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl hover:bg-emerald-700 transition-all">
                      Register Specialist
                    </button>
                  </form>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {doctors.map(doc => (
                    <div key={doc.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group">
                       <div className="flex items-center space-x-5">
                         <img src={doc.photo} className="w-16 h-16 rounded-2xl object-cover" />
                         <div>
                            <h4 className="font-black text-gray-900 leading-tight">{doc.name}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{departments.find(d => d.id === doc.departmentId)?.name}</p>
                         </div>
                       </div>
                       <button onClick={() => removeDoctor(doc.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-50 rounded-lg">
                         <Trash2 size={20} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Notices Tab */}
          {activeTab === 'notices' && (
            <div className="space-y-12">
               <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black mb-10 flex items-center text-gray-800"><Bell className="mr-3 text-emerald-600" /> New Announcement</h3>
                  <form onSubmit={handleNoticeAdd} className="space-y-6">
                    <div>
                       <label className={labelClasses}>Notice Title</label>
                       <input placeholder="Free Health Camp" className={inputClasses} value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} required />
                    </div>
                    <div>
                       <label className={labelClasses}>Detailed Content</label>
                       <textarea placeholder="Write announcement details here..." className={`${inputClasses} resize-none`} rows={4} value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} required />
                    </div>
                    <div className="flex items-center space-x-3">
                       <input type="checkbox" id="important" checked={newNotice.isImportant} onChange={e => setNewNotice({...newNotice, isImportant: e.target.checked})} className="w-5 h-5 accent-emerald-600" />
                       <label htmlFor="important" className="font-bold text-gray-700">Mark as High Importance (Orange Badge)</label>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl hover:bg-emerald-700 transition-all">
                      Publish Announcement
                    </button>
                  </form>
               </div>

               <div className="space-y-4">
                  {notices.map(notice => (
                    <div key={notice.id} className={`p-6 rounded-3xl border flex items-center justify-between ${notice.isImportant ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-100'}`}>
                       <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${notice.isImportant ? 'bg-orange-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                             <Bell size={20} />
                          </div>
                          <div>
                             <h4 className="font-black text-gray-900">{notice.title}</h4>
                             <p className="text-xs text-gray-500 font-bold">{notice.date}</p>
                          </div>
                       </div>
                       <button onClick={() => removeNotice(notice.id)} className="text-red-500 p-2 hover:bg-red-100 rounded-xl transition-colors">
                          <Trash2 size={20} />
                       </button>
                    </div>
                  ))}
                  {notices.length === 0 && (
                    <div className="text-center py-20 bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
                       <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                       <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">No announcements published yet</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Patient</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Doctor</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments.map(apt => (
                        <tr key={apt.id} className="hover:bg-emerald-50/30">
                          <td className="px-8 py-6">
                            <div className="font-black text-gray-900">{apt.patientName}</div>
                            <div className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">{apt.patientPhone}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-sm font-bold">{doctors.find(d => d.id === apt.doctorId)?.name || 'N/A'}</div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                              apt.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right space-x-3">
                             <button onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl"><Check size={18} /></button>
                             <button onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded-xl"><X size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* Depts Tab */}
          {activeTab === 'depts' && (
            <div className="space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                      <h3 className="text-xl font-black mb-10 flex items-center text-gray-800"><LayoutGrid className="mr-3 text-blue-500" /> New Department</h3>
                      <form className="space-y-6" onSubmit={async (e) => {
                        e.preventDefault();
                        await addDepartment(newDept);
                        setNewDept({ name: '', description: '', icon: '' });
                        alert('Department created!');
                      }}>
                        <input placeholder="Cardiology" className={inputClasses} value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} required />
                        <textarea placeholder="Description" className={`${inputClasses} resize-none`} rows={3} value={newDept.description} onChange={e => setNewDept({...newDept, description: e.target.value})} required />
                        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl">Create Department</button>
                      </form>
                  </div>
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                      <h3 className="text-xl font-black mb-10 flex items-center text-gray-800"><Settings className="mr-3 text-emerald-500" /> New Service</h3>
                      <form className="space-y-6" onSubmit={async (e) => {
                        e.preventDefault();
                        await addService(newService);
                        setNewService({ title: '', description: '' });
                        alert('Service registered!');
                      }}>
                        <input placeholder="24/7 ICU" className={inputClasses} value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
                        <textarea placeholder="Description" className={`${inputClasses} resize-none`} rows={3} value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
                        <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl">Register Service</button>
                      </form>
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
