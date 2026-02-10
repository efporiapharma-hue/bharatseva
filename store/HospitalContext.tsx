
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Doctor, Department, Service, Appointment, Notice, HospitalConfig } from '../types';

const SUPABASE_URL = 'https://pserlfetpyqoknfzhppc.supabase.co';
/**
 * IMPORTANT: The key below starts with 'sb_publishable_', which is a Vercel key. 
 * Supabase 'anon' keys usually start with 'eyJ...'. 
 * If data doesn't save, replace this with your Supabase Project API Key.
 */
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

const DEFAULT_CONFIG: HospitalConfig = {
  name: 'Bharat Seva Hospital',
  logo: 'https://i.ibb.co/68Xk9wL/medical-logo.png',
  address: '123, Health Avenue, New Delhi, India',
  phone: '+91 98765 43210',
  email: 'contact@bharatsevahospital.in'
};

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [config, setConfig] = useState<HospitalConfig>(DEFAULT_CONFIG);

  const refreshData = async () => {
    try {
      const [rDocs, rDepts, rServs, rApts, rNotes, rCfg] = await Promise.all([
        supabase.from('doctors').select('*'),
        supabase.from('departments').select('*'),
        supabase.from('services').select('*'),
        supabase.from('appointments').select('*').order('id', { ascending: false }),
        supabase.from('notices').select('*').order('date', { ascending: false }),
        supabase.from('hospital_config').select('*').limit(1)
      ]);

      if (rDocs.data) setDoctors(rDocs.data);
      if (rDepts.data) setDepartments(rDepts.data);
      if (rServs.data) setServices(rServs.data);
      if (rApts.data) setAppointments(rApts.data);
      if (rNotes.data) setNotices(rNotes.data);
      if (rCfg.data && rCfg.data.length > 0) setConfig(rCfg.data[0]);

      setDbConnected(![rDocs, rDepts, rServs, rApts, rNotes, rCfg].some(r => r.error));
    } catch (error) {
      console.error('Data sync failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Set up real-time listener for ALL table changes in the 'public' schema
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('Database change received:', payload);
        refreshData();
      })
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
    const { error } = await supabase.from('doctors').insert([doc]);
    if (error) {
      console.error('Error adding doctor:', error);
      alert('Save failed. Check if SQL tables are created and Supabase Key is correct.');
    }
    await refreshData();
  };

  const updateDoctor = async (id: string, doc: Partial<Doctor>) => {
    const { error } = await supabase.from('doctors').update(doc).eq('id', id);
    if (error) console.error('Error updating doctor:', error);
    await refreshData();
  };

  const removeDoctor = async (id: string) => {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) console.error('Error removing doctor:', error);
    await refreshData();
  };

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    const { error } = await supabase.from('departments').insert([dept]);
    if (error) console.error('Error adding department:', error);
    await refreshData();
  };

  const removeDepartment = async (id: string) => {
    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (error) console.error('Error removing department:', error);
    await refreshData();
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    const { error } = await supabase.from('services').insert([service]);
    if (error) console.error('Error adding service:', error);
    await refreshData();
  };

  const removeService = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) console.error('Error removing service:', error);
    await refreshData();
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    const { error } = await supabase.from('notices').insert([notice]);
    if (error) console.error('Error adding notice:', error);
    await refreshData();
  };

  const removeNotice = async (id: string) => {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) console.error('Error removing notice:', error);
    await refreshData();
  };

  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'status'>) => {
    const { error } = await supabase.from('appointments').insert([{ ...apt, status: 'Pending' }]);
    if (error) {
      console.error('Error booking appointment:', error);
      alert('Booking failed. Please ensure the "appointments" table exists in Supabase.');
    }
    await refreshData();
  };

  const updateAppointment = async (id: string, apt: Partial<Appointment>) => {
    const { error } = await supabase.from('appointments').update(apt).eq('id', id);
    if (error) console.error('Error updating appointment:', error);
    await refreshData();
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) console.error('Error updating status:', error);
    await refreshData();
  };

  const updateConfig = async (newConfig: Partial<HospitalConfig>) => {
    const { data: existing } = await supabase.from('hospital_config').select('id').limit(1);
    let error;
    if (existing && existing.length > 0) {
      const res = await supabase.from('hospital_config').update(newConfig).eq('id', existing[0].id);
      error = res.error;
    } else {
      const res = await supabase.from('hospital_config').insert([newConfig]);
      error = res.error;
    }
    if (error) console.error('Error updating config:', error);
    await refreshData();
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
