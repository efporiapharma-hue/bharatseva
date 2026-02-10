
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Doctor, Department, Service, Appointment, Notice, HospitalConfig } from '../types';

const SUPABASE_URL = 'https://pserlfetpyqoknfzhppc.supabase.co';
// Note: This key format (sb_publishable_...) is common for Vercel-Supabase integrations.
// If syncing fails across devices, ensure "Realtime" is enabled in your Supabase Dashboard for all tables.
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
        supabase.from('doctors').select('*').order('created_at', { ascending: true }),
        supabase.from('departments').select('*').order('created_at', { ascending: true }),
        supabase.from('services').select('*').order('created_at', { ascending: true }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('notices').select('*').order('created_at', { ascending: false }),
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
    
    // Subscribe to ALL changes in the public schema for real-time multi-browser sync
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('Real-time sync update from table:', payload.table);
        refreshData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
    const { error } = await supabase.from('doctors').insert([doc]);
    if (error) console.error('Add Doctor Error:', error);
    await refreshData();
  };

  const updateDoctor = async (id: string, doc: Partial<Doctor>) => {
    const { error } = await supabase.from('doctors').update(doc).eq('id', id);
    if (error) console.error('Update Doctor Error:', error);
    await refreshData();
  };

  const removeDoctor = async (id: string) => {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) console.error('Remove Doctor Error:', error);
    await refreshData();
  };

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    const { error } = await supabase.from('departments').insert([dept]);
    if (error) console.error('Add Dept Error:', error);
    await refreshData();
  };

  const removeDepartment = async (id: string) => {
    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (error) console.error('Remove Dept Error:', error);
    await refreshData();
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    const { error } = await supabase.from('services').insert([service]);
    if (error) console.error('Add Service Error:', error);
    await refreshData();
  };

  const removeService = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) console.error('Remove Service Error:', error);
    await refreshData();
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    const { error } = await supabase.from('notices').insert([notice]);
    if (error) console.error('Add Notice Error:', error);
    await refreshData();
  };

  const removeNotice = async (id: string) => {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) console.error('Remove Notice Error:', error);
    await refreshData();
  };

  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'status'>) => {
    const { error } = await supabase.from('appointments').insert([{ ...apt, status: 'Pending' }]);
    if (error) console.error('Booking Error:', error);
    await refreshData();
  };

  const updateAppointment = async (id: string, apt: Partial<Appointment>) => {
    const { error } = await supabase.from('appointments').update(apt).eq('id', id);
    if (error) console.error('Update Appointment Error:', error);
    await refreshData();
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) console.error('Status Update Error:', error);
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
    if (error) console.error('Config Error:', error);
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
