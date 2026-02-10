
import React, { useState, useRef } from 'react';
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
  Camera
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

  const [activeTab, setActiveTab] = useState<'config' | 'doctors' | 'appointments' | 'notices' | 'depts'>('config');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [newDoc, setNewDoc] = useState({ 
    name: '', 
    qualification: '', 
    departmentId: departments[0]?.id || '', 
    photo: '', 
    availableDays: 'Mon, Wed, Fri', 
    timeSlots: '10 AM - 1 PM' 
  });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', isImportant: false });
  const [newDept, setNewDept] = useState({ name: '', description: '', icon: '' });
  const [newService, setNewService] = useState({ title: '', description: '' });

  // Appointment Edit State
  const [editingAptId, setEditingAptId] = useState<string | null>(null);
  const [editAptData, setEditAptData] = useState<Partial<Appointment>>({});

  const handleDocAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctor({
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
      timeSlots: '10 AM - 1 PM' 
    });
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

  const handleNoticeAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addNotice({ ...newNotice, date: new Date().toLocaleDateString() });
    setNewNotice({ title: '', content: '', isImportant: false });
  };

  const startEditingApt = (apt: Appointment) => {
    setEditingAptId(apt.id);
    setEditAptData(apt);
  };

  const saveAptEdit = () => {
    if (editingAptId) {
      updateAppointment(editingAptId, editAptData);
      setEditingAptId(null);
    }
  };

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
        </nav>

        <div className="absolute bottom-8 left-8 right-8">
           <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center text-emerald-400 text-sm font-bold">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                 System Online
              </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-10 lg:p-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
             <div>
               <h1 className="text-4xl font-black text-gray-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h1>
               <p className="text-gray-500 font-medium mt-1">Manage your hospital core operations and data.</p>
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        <input 
                          type="file" 
                          ref={logoFileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-8">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Current Brand Identity</p>
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[200px] aspect-square flex items-center justify-center">
                           <img src={config.logo} alt="Logo Preview" className="w-full h-auto object-contain max-h-full" />
                        </div>
                    </div>
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black mb-8 flex items-center text-gray-800">Operational Contacts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClasses}>Emergency Phone</label>
                      <input 
                        type="text" 
                        value={config.phone} 
                        onChange={(e) => updateConfig({ phone: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Official Email</label>
                      <input 
                        type="email" 
                        value={config.email} 
                        onChange={(e) => updateConfig({ email: e.target.value })}
                        className={inputClasses}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClasses}>Main Physical Address</label>
                      <textarea 
                        value={config.address} 
                        onChange={(e) => updateConfig({ address: e.target.value })}
                        className={`${inputClasses} resize-none`}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {/* Add Doctor Form */}
               <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black mb-10 flex items-center text-gray-800"><Plus className="mr-3 text-[#FF9933]" /> Register New Specialist</h3>
                  <form onSubmit={handleDocAdd} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      
                      {/* Photo Upload Section */}
                      <div className="lg:col-span-1">
                        <label className={labelClasses}>Specialist Portrait</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group overflow-hidden relative"
                        >
                          {newDoc.photo ? (
                            <>
                              <img src={newDoc.photo} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Upload className="text-white" size={32} />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 text-emerald-600">
                                <Camera size={32} />
                              </div>
                              <span className="text-sm font-bold text-gray-400 group-hover:text-emerald-600">Click to Upload</span>
                            </>
                          )}
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handlePhotoUpload}
                        />
                        <p className="mt-3 text-[10px] text-gray-400 font-bold text-center uppercase">Recommended: 400x400px JPG/PNG</p>
                      </div>

                      {/* Info Fields */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                             <label className={labelClasses}>Full Name (inc. Prefix)</label>
                             <input 
                               placeholder="e.g. Dr. Amitabh Singh" 
                               className={inputClasses}
                               value={newDoc.name}
                               onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                               required
                             />
                          </div>
                          <div>
                             <label className={labelClasses}>Qualifications</label>
                             <input 
                               placeholder="e.g. MBBS, MD (Ortho)" 
                               className={inputClasses}
                               value={newDoc.qualification}
                               onChange={e => setNewDoc({...newDoc, qualification: e.target.value})}
                               required
                             />
                          </div>
                        </div>

                        <div>
                           <label className={labelClasses}>Assigned Department</label>
                           <select 
                             className={`${inputClasses} bg-white appearance-none`}
                             value={newDoc.departmentId}
                             onChange={e => setNewDoc({...newDoc, departmentId: e.target.value})}
                             required
                           >
                             <option value="">Choose Department...</option>
                             {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                           </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                             <label className={labelClasses}>OPD Available Days</label>
                             <input 
                               placeholder="Mon, Tue, Wed" 
                               className={inputClasses}
                               value={newDoc.availableDays}
                               onChange={e => setNewDoc({...newDoc, availableDays: e.target.value})}
                             />
                          </div>
                          <div>
                             <label className={labelClasses}>Working Time Slots</label>
                             <input 
                               placeholder="10 AM - 1 PM" 
                               className={inputClasses}
                               value={newDoc.timeSlots}
                               onChange={e => setNewDoc({...newDoc, timeSlots: e.target.value})}
                             />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-[#FF9933] text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-orange-200 hover:bg-orange-600 transition-all hover:scale-[1.01] active:scale-[0.98]">
                      Register Specialist
                    </button>
                  </form>
               </div>

               {/* Doctor List */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {doctors.map(doc => (
                    <div key={doc.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                       <div className="flex items-center space-x-5">
                         <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-50">
                            <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <h4 className="font-black text-gray-900 leading-tight">{doc.name}</h4>
                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-tighter mt-1">{doc.qualification}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{departments.find(d => d.id === doc.departmentId)?.name}</p>
                         </div>
                       </div>
                       <button onClick={() => removeDoctor(doc.id)} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                         <Trash2 size={20} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Patient</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Specialist</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Schedule</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments.length === 0 ? (
                        <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold italic">No active appointment requests.</td></tr>
                      ) : (
                        appointments.map(apt => (
                          <tr key={apt.id} className="hover:bg-emerald-50/30 transition-colors group">
                            <td className="px-8 py-6">
                               {editingAptId === apt.id ? (
                                 <input 
                                   className={`${inputClasses} py-2 px-3 text-sm`}
                                   value={editAptData.patientName}
                                   onChange={e => setEditAptData({...editAptData, patientName: e.target.value})}
                                 />
                               ) : (
                                 <>
                                   <div className="font-black text-gray-900 text-base">{apt.patientName}</div>
                                   <div className="text-xs text-emerald-600 font-bold uppercase tracking-tighter mt-1">{apt.patientPhone}</div>
                                 </>
                               )}
                            </td>
                            <td className="px-8 py-6">
                               <div className="text-sm font-bold text-gray-700">{doctors.find(d => d.id === apt.doctorId)?.name || 'Unknown Specialist'}</div>
                            </td>
                            <td className="px-8 py-6">
                               {editingAptId === apt.id ? (
                                 <div className="space-y-2">
                                   <input 
                                     type="date"
                                     className={`${inputClasses} py-1 px-2 text-xs`}
                                     value={editAptData.date}
                                     onChange={e => setEditAptData({...editAptData, date: e.target.value})}
                                   />
                                   <input 
                                     className={`${inputClasses} py-1 px-2 text-xs`}
                                     value={editAptData.timeSlot}
                                     onChange={e => setEditAptData({...editAptData, timeSlot: e.target.value})}
                                   />
                                 </div>
                               ) : (
                                 <>
                                   <div className="text-sm font-bold text-gray-900">{apt.date}</div>
                                   <div className="text-xs font-black text-[#FF9933] uppercase mt-1">{apt.timeSlot}</div>
                                 </>
                               )}
                            </td>
                            <td className="px-8 py-6">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                 apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 
                                 apt.status === 'Pending' ? 'bg-orange-100 text-orange-700 shadow-sm' : 'bg-red-100 text-red-700 shadow-sm'
                               }`}>
                                 {apt.status}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex justify-end space-x-3">
                                 {editingAptId === apt.id ? (
                                   <button onClick={saveAptEdit} className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-all"><Save size={18} /></button>
                                 ) : (
                                   <button onClick={() => startEditingApt(apt)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-white hover:text-emerald-600 shadow-sm transition-all"><Edit2 size={18} /></button>
                                 )}
                                 <button onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Check size={18} /></button>
                                 <button onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><X size={18} /></button>
                               </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* Notices Tab */}
          {activeTab === 'notices' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black mb-10 flex items-center text-gray-800"><Bell className="mr-3 text-emerald-600" /> Dispatch Announcement</h3>
                  <form onSubmit={handleNoticeAdd} className="space-y-6">
                    <div>
                      <label className={labelClasses}>Notice Title</label>
                      <input 
                        placeholder="e.g. Health Camp Announcement" 
                        className={inputClasses}
                        value={newNotice.title}
                        onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Detailed Content</label>
                      <textarea 
                        placeholder="Provide details about the event, location, and dates..." 
                        className={`${inputClasses} resize-none`}
                        rows={4}
                        value={newNotice.content}
                        onChange={e => setNewNotice({...newNotice, content: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                       <input 
                         type="checkbox" 
                         id="important" 
                         className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                         checked={newNotice.isImportant}
                         onChange={e => setNewNotice({...newNotice, isImportant: e.target.checked})}
                       />
                       <label htmlFor="important" className="text-sm font-black text-gray-700 uppercase tracking-tighter">Emergency / High Priority Notice</label>
                    </div>
                    <button type="submit" className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-2xl active:scale-95">
                      Publish Official Bulletin
                    </button>
                  </form>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {notices.map(notice => (
                    <div key={notice.id} className={`p-8 rounded-[2rem] shadow-sm border transition-all hover:scale-[1.02] ${notice.isImportant ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'} flex flex-col`}>
                       <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notice.date}</span>
                          <button onClick={() => removeNotice(notice.id)} className="text-gray-300 hover:text-red-500 transition-all">
                            <Trash2 size={20} />
                          </button>
                       </div>
                       <h4 className="font-black text-xl text-gray-900 mb-4">{notice.title}</h4>
                       <p className="text-sm text-gray-600 leading-relaxed flex-grow">{notice.content}</p>
                       {notice.isImportant && <div className="mt-6 inline-block w-fit bg-[#FF9933] text-white text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest">Urgent</div>}
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Depts & Services Tab */}
          {activeTab === 'depts' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                      <h3 className="text-xl font-black mb-10 flex items-center text-gray-800"><LayoutGrid className="mr-3 text-blue-500" /> New Department</h3>
                      <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        addDepartment(newDept);
                        setNewDept({ name: '', description: '', icon: '' });
                      }}>
                        <div>
                          <label className={labelClasses}>Dept Name</label>
                          <input placeholder="e.g. Cardiology" className={inputClasses} value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} required />
                        </div>
                        <div>
                          <label className={labelClasses}>Description</label>
                          <textarea placeholder="Service overview..." className={`${inputClasses} resize-none`} rows={3} value={newDept.description} onChange={e => setNewDept({...newDept, description: e.target.value})} required />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all">Create Department</button>
                      </form>
                  </div>
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                      <h3 className="text-xl font-black mb-10 flex items-center text-gray-800"><Settings className="mr-3 text-emerald-500" /> New Service</h3>
                      <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        addService(newService);
                        setNewService({ title: '', description: '' });
                      }}>
                        <div>
                          <label className={labelClasses}>Service Title</label>
                          <input placeholder="e.g. 24/7 ICU Care" className={inputClasses} value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
                        </div>
                        <div>
                          <label className={labelClasses}>Description</label>
                          <textarea placeholder="Facility details..." className={`${inputClasses} resize-none`} rows={3} value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
                        </div>
                        <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition-all">Register Service</button>
                      </form>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                     <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Catalogued Departments</h4>
                     <div className="space-y-3">
                        {departments.map(d => (
                           <div key={d.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
                              <span className="font-bold text-gray-800">{d.name}</span>
                              <button onClick={() => removeDepartment(d.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                     <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Active Service List</h4>
                     <div className="space-y-3">
                        {services.map(s => (
                           <div key={s.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
                              <span className="font-bold text-gray-800">{s.title}</span>
                              <button onClick={() => removeService(s.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                           </div>
                        ))}
                     </div>
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
