
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Doctor, Department, Service, Appointment, Notice, HospitalConfig } from '../types';

// Supabase Credentials
const SUPABASE_URL = 'https://pserlfetpyqoknfzhppc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PVKJQTJ6rOMfjiFC-euVTQ_YMtX9tW9'; 

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

interface HospitalContextType {
  doctors: Doctor[];
  departments: Department[];
  services: Service[];
  appointments: Appointment[];
  notices: Notice[];
  config: HospitalConfig;
  loading: boolean;
  dbConnected: boolean;
  addDoctor: (doc: Omit<Doctor, 'id'>) => Promise<void>;
  updateDoctor: (id: string, doc: Partial<Doctor>) => Promise<void>;
  removeDoctor: (id: string) => Promise<void>;
  addDepartment: (dept: Omit<Department, 'id'>) => Promise<void>;
  removeDepartment: (id: string) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  addNotice: (notice: Omit<Notice, 'id'>) => Promise<void>;
  removeNotice: (id: string) => Promise<void>;
  bookAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  updateAppointment: (id: string, apt: Partial<Appointment>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  updateConfig: (config: Partial<HospitalConfig>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

// Default mock data to ensure the website is NEVER blank
const DEFAULT_DEPTS: Department[] = [
  { id: '1', name: 'Cardiology', description: 'Advanced heart care and surgery.', icon: 'Heart' },
  { id: '2', name: 'Orthopedics', description: 'Bone, joint and muscle specialists.', icon: 'Activity' },
  { id: '3', name: 'Pediatrics', description: 'Comprehensive child healthcare.', icon: 'Users' }
];

const DEFAULT_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Vikram Singh', qualification: 'MD, Cardiology', departmentId: '1', photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop', availableDays: ['Mon', 'Wed', 'Fri'], timeSlots: ['10 AM - 12 PM', '4 PM - 6 PM'] },
  { id: '2', name: 'Dr. Ananya Sharma', qualification: 'MBBS, MS Ortho', departmentId: '2', photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop', availableDays: ['Tue', 'Thu', 'Sat'], timeSlots: ['11 AM - 2 PM'] }
];

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(DEFAULT_DOCTORS);
  const [departments, setDepartments] = useState<Department[]>(DEFAULT_DEPTS);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([
    { id: '1', title: 'Free Health Camp', content: 'Join us this Sunday for a free cardiac screening camp under PMJAY initiative.', date: '2024-05-20', isImportant: true }
  ]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [config, setConfig] = useState<HospitalConfig>({
    name: 'Bharat Seva Hospital',
    logo: 'https://i.ibb.co/68Xk9wL/medical-logo.png',
    address: '123, Health Avenue, New Delhi, India',
    phone: '+91 98765 43210',
    email: 'contact@bharatsevahospital.in'
  });

  const refreshData = async () => {
    try {
      const fetchJobs = [
        supabase.from('doctors').select('*'),
        supabase.from('departments').select('*'),
        supabase.from('services').select('*'),
        supabase.from('appointments').select('*').order('date', { ascending: false }),
        supabase.from('notices').select('*').order('date', { ascending: false }),
        supabase.from('hospital_config').select('*').limit(1)
      ];

      const results = await Promise.all(fetchJobs);
      const [rDocs, rDepts, rServs, rApts, rNotes, rCfg] = results;

      if (rDocs.data && rDocs.data.length > 0) setDoctors(rDocs.data);
      if (rDepts.data && rDepts.data.length > 0) setDepartments(rDepts.data);
      if (rServs.data && rServs.data.length > 0) setServices(rServs.data);
      if (rApts.data) setAppointments(rApts.data);
      if (rNotes.data) setNotices(rNotes.data);
      
      if (rCfg.data && rCfg.data.length > 0) {
        setConfig(rCfg.data[0]);
      }

      const hasError = results.some(r => r.error);
      setDbConnected(!hasError);

    } catch (error) {
      console.error('HospitalApp: Sync Error:', error);
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // Force end loading after 2 seconds to ensure the site is visible regardless of DB status
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
    try { await supabase.from('doctors').insert([doc]); await refreshData(); } catch (e) { console.error(e); }
  };

  const updateDoctor = async (id: string, doc: Partial<Doctor>) => {
    try { await supabase.from('doctors').update(doc).eq('id', id); await refreshData(); } catch (e) { console.error(e); }
  };

  const removeDoctor = async (id: string) => {
    try { await supabase.from('doctors').delete().eq('id', id); await refreshData(); } catch (e) { console.error(e); }
  };

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    try { await supabase.from('departments').insert([dept]); await refreshData(); } catch (e) { console.error(e); }
  };

  const removeDepartment = async (id: string) => {
    try { await supabase.from('departments').delete().eq('id', id); await refreshData(); } catch (e) { console.error(e); }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    try { await supabase.from('services').insert([service]); await refreshData(); } catch (e) { console.error(e); }
  };

  const removeService = async (id: string) => {
    try { await supabase.from('services').delete().eq('id', id); await refreshData(); } catch (e) { console.error(e); }
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    try { await supabase.from('notices').insert([notice]); await refreshData(); } catch (e) { console.error(e); }
  };

  const removeNotice = async (id: string) => {
    try { await supabase.from('notices').delete().eq('id', id); await refreshData(); } catch (e) { console.error(e); }
  };

  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'status'>) => {
    try {
      const { error } = await supabase.from('appointments').insert([{ ...apt, status: 'Pending' }]);
      if (error) throw error;
      await refreshData();
    } catch (e) { 
      console.error('Booking failed, using local fallback:', e); 
      setAppointments(prev => [{...apt, id: Math.random().toString(), status: 'Pending'}, ...prev]);
    }
  };

  const updateAppointment = async (id: string, apt: Partial<Appointment>) => {
    try { await supabase.from('appointments').update(apt).eq('id', id); await refreshData(); } catch (e) { console.error(e); }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try { await supabase.from('appointments').update({ status }).eq('id', id); await refreshData(); } catch (e) { console.error(e); }
  };

  const updateConfig = async (newConfig: Partial<HospitalConfig>) => {
    try {
      const { data: existing } = await supabase.from('hospital_config').select('id').limit(1);
      if (existing && existing.length > 0) {
        await supabase.from('hospital_config').update(newConfig).eq('id', existing[0].id);
      } else {
        await supabase.from('hospital_config').insert([newConfig]);
      }
      await refreshData();
    } catch (e) { 
      setConfig(prev => ({ ...prev, ...newConfig }));
      console.error(e); 
    }
  };

  return (
    <HospitalContext.Provider value={{
      doctors, departments, services, appointments, notices, config, loading, dbConnected,
      addDoctor, updateDoctor, removeDoctor, addDepartment, removeDepartment, 
      addService, removeService, addNotice, removeNotice, 
      bookAppointment, updateAppointment, updateAppointmentStatus, updateConfig,
      refreshData
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) throw new Error('useHospital must be used within HospitalProvider');
  return context;
};
