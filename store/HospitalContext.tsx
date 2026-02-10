
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Doctor, Department, Service, Appointment, Notice, HospitalConfig } from '../types';

// Supabase Credentials provided by user
const SUPABASE_URL = 'https://pserlfetpyqoknfzhppc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PVKJQTJ6rOMfjiFC-euVTQ_YMtX9tW9'; // Note: Ensure this is the correct ANON key

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
      const [
        { data: docs },
        { data: depts },
        { data: servs },
        { data: apts },
        { data: notes },
        { data: cfg }
      ] = await Promise.all([
        supabase.from('doctors').select('*'),
        supabase.from('departments').select('*'),
        supabase.from('services').select('*'),
        supabase.from('appointments').select('*').order('date', { ascending: false }),
        supabase.from('notices').select('*').order('date', { ascending: false }),
        supabase.from('hospital_config').select('*').single()
      ]);

      if (docs) setDoctors(docs);
      if (depts) setDepartments(depts);
      if (servs) setServices(servs);
      if (apts) setAppointments(apts);
      if (notes) setNotices(notes);
      if (cfg) setConfig(cfg);
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    } finally {
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
    await supabase.from('doctors').insert([doc]);
    await refreshData();
  };

  const updateDoctor = async (id: string, doc: Partial<Doctor>) => {
    await supabase.from('doctors').update(doc).eq('id', id);
    await refreshData();
  };

  const removeDoctor = async (id: string) => {
    await supabase.from('doctors').delete().eq('id', id);
    await refreshData();
  };

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    await supabase.from('departments').insert([dept]);
    await refreshData();
  };

  const removeDepartment = async (id: string) => {
    await supabase.from('departments').delete().eq('id', id);
    await refreshData();
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    await supabase.from('services').insert([service]);
    await refreshData();
  };

  const removeService = async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    await refreshData();
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    await supabase.from('notices').insert([notice]);
    await refreshData();
  };

  const removeNotice = async (id: string) => {
    await supabase.from('notices').delete().eq('id', id);
    await refreshData();
  };

  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'status'>) => {
    await supabase.from('appointments').insert([{ ...apt, status: 'Pending' }]);
    await refreshData();
  };

  const updateAppointment = async (id: string, apt: Partial<Appointment>) => {
    await supabase.from('appointments').update(apt).eq('id', id);
    await refreshData();
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    await refreshData();
  };

  const updateConfig = async (newConfig: Partial<HospitalConfig>) => {
    const { data: existing } = await supabase.from('hospital_config').select('id').single();
    if (existing) {
      await supabase.from('hospital_config').update(newConfig).eq('id', existing.id);
    } else {
      await supabase.from('hospital_config').insert([newConfig]);
    }
    await refreshData();
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
