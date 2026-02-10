
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Doctor, Department, Service, Appointment, Notice, HospitalConfig } from '../types';

// Supabase Credentials provided by user
const SUPABASE_URL = 'https://pserlfetpyqoknfzhppc.supabase.co';
// User provided: sb_publishable_PVKJQTJ6rOMfjiFC-euVTQ_YMtX9tW9
// Note: This looks like a Vercel key. Supabase keys usually start with 'eyJ...'
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

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
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
        supabase.from('hospital_config').select('*').limit(1) // Avoid .single() to prevent error if 0 rows
      ];

      const results = await Promise.all(fetchJobs);
      
      const [rDocs, rDepts, rServs, rApts, rNotes, rCfg] = results;

      if (rDocs.data) setDoctors(rDocs.data);
      if (rDepts.data) setDepartments(rDepts.data);
      if (rServs.data) setServices(rServs.data);
      if (rApts.data) setAppointments(rApts.data);
      if (rNotes.data) setNotices(rNotes.data);
      
      // Update config only if data exists to avoid setting it to null/undefined
      if (rCfg.data && rCfg.data.length > 0) {
        setConfig(rCfg.data[0]);
      }

      // Log warnings for debugging if tables are missing or unauthorized
      results.forEach((res, i) => {
        if (res.error) {
          console.warn(`Supabase fetch error for index ${i}:`, res.error.message);
        }
      });

    } catch (error) {
      console.error('Critical Error in HospitalContext refreshData:', error);
    } finally {
      // ALWAYS set loading to false to prevent a permanent blank screen
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Subscribe to real-time changes
    const channels = [
      supabase.channel('public:doctors').on('postgres_changes', { event: '*', schema: 'public', table: 'doctors' }, refreshData).subscribe(),
      supabase.channel('public:appointments').on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, refreshData).subscribe(),
      supabase.channel('public:hospital_config').on('postgres_changes', { event: '*', schema: 'public', table: 'hospital_config' }, refreshData).subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
    try {
      await supabase.from('doctors').insert([doc]);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const updateDoctor = async (id: string, doc: Partial<Doctor>) => {
    try {
      await supabase.from('doctors').update(doc).eq('id', id);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const removeDoctor = async (id: string) => {
    try {
      await supabase.from('doctors').delete().eq('id', id);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    try {
      await supabase.from('departments').insert([dept]);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const removeDepartment = async (id: string) => {
    try {
      await supabase.from('departments').delete().eq('id', id);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      await supabase.from('services').insert([service]);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const removeService = async (id: string) => {
    try {
      await supabase.from('services').delete().eq('id', id);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    try {
      await supabase.from('notices').insert([notice]);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const removeNotice = async (id: string) => {
    try {
      await supabase.from('notices').delete().eq('id', id);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'status'>) => {
    try {
      await supabase.from('appointments').insert([{ ...apt, status: 'Pending' }]);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const updateAppointment = async (id: string, apt: Partial<Appointment>) => {
    try {
      await supabase.from('appointments').update(apt).eq('id', id);
      await refreshData();
    } catch (e) { console.error(e); }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      await supabase.from('appointments').update({ status }).eq('id', id);
      await refreshData();
    } catch (e) { console.error(e); }
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
    } catch (e) { console.error(e); }
  };

  return (
    <HospitalContext.Provider value={{
      doctors, departments, services, appointments, notices, config, loading,
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
