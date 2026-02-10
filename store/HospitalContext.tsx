
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Doctor, Department, Service, Appointment, Notice, HospitalConfig } from '../types';

/**
 * 🚨 MASTER SETUP INSTRUCTIONS
 * 1. Ensure the SQL script provided in the prompt is run in the Supabase Editor.
 * 2. If 'Offline Mode' persists, verify your internet or if the project is paused.
 */
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
  const [dbConnected, setDbConnected] = useState(true); 
  const [config, setConfig] = useState<HospitalConfig>(DEFAULT_CONFIG);

  const safeFetch = async (tableName: string, orderField: string = 'created_at', ascending: boolean = true) => {
    try {
      // Primary attempt with sorting
      let { data, error } = await supabase.from(tableName).select('*').order(orderField, { ascending });
      
      // Fallback for missing sorting column
      if (error && error.message.includes('column') && error.message.includes('does not exist')) {
        const fallback = await supabase.from(tableName).select('*');
        data = fallback.data;
        error = fallback.error;
      }

      return { data: data || [], error };
    } catch (e) {
      return { data: [], error: e };
    }
  };

  const refreshData = useCallback(async () => {
    try {
      // 1. Heartbeat check
      const { error: hbError } = await supabase.from('hospital_config').select('id').limit(1);
      if (hbError && hbError.message.includes('FetchError')) {
        setDbConnected(false);
        setLoading(false);
        return;
      }

      // 2. Parallel Fetch with individual error tolerance
      const [rDocs, rDepts, rServs, rApts, rNotes, rCfg] = await Promise.all([
        safeFetch('doctors', 'created_at', true),
        safeFetch('departments', 'created_at', true),
        safeFetch('services', 'created_at', true),
        safeFetch('appointments', 'created_at', false),
        safeFetch('notices', 'created_at', false),
        supabase.from('hospital_config').select('*').limit(1)
      ]);

      // Assign data safely
      if (rDocs.data) setDoctors(rDocs.data);
      if (rDepts.data) setDepartments(rDepts.data);
      if (rServs.data) setServices(rServs.data);
      if (rApts.data) setAppointments(rApts.data);
      if (rNotes.data) setNotices(rNotes.data);
      if (rCfg.data && rCfg.data.length > 0) setConfig(rCfg.data[0]);

      setDbConnected(true);
    } catch (err) {
      console.warn("Refresh encountered a network delay.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    
    // Realtime Sync Subscription
    const channel = supabase
      .channel('master-sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        refreshData();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setDbConnected(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          // Don't immediately set offline, let heartbeat decide
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [refreshData]);

  // CRUD Operations
  const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
    const { error } = await supabase.from('doctors').insert([doc]);
    if (error) alert(error.message);
    await refreshData();
  };

  const updateDoctor = async (id: string, doc: Partial<Doctor>) => {
    const { error } = await supabase.from('doctors').update(doc).eq('id', id);
    if (error) alert(error.message);
    await refreshData();
  };

  const removeDoctor = async (id: string) => {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) alert(error.message);
    await refreshData();
  };

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    const { error } = await supabase.from('departments').insert([dept]);
    if (error) alert(error.message);
    await refreshData();
  };

  const removeDepartment = async (id: string) => {
    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (error) alert(error.message);
    await refreshData();
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    const { error } = await supabase.from('services').insert([service]);
    if (error) alert(error.message);
    await refreshData();
  };

  const removeService = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) alert(error.message);
    await refreshData();
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    const { error } = await supabase.from('notices').insert([notice]);
    if (error) alert(error.message);
    await refreshData();
  };

  const removeNotice = async (id: string) => {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) alert(error.message);
    await refreshData();
  };

  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'status'>) => {
    const { error } = await supabase.from('appointments').insert([{ ...apt, status: 'Pending' }]);
    if (error) alert(error.message);
    await refreshData();
  };

  const updateAppointment = async (id: string, apt: Partial<Appointment>) => {
    const { error } = await supabase.from('appointments').update(apt).eq('id', id);
    if (error) alert(error.message);
    await refreshData();
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) alert(error.message);
    await refreshData();
  };

  const updateConfig = async (newConfig: Partial<HospitalConfig>) => {
    const { data: existing } = await supabase.from('hospital_config').select('id').limit(1);
    if (existing && existing.length > 0) {
      await supabase.from('hospital_config').update(newConfig).eq('id', existing[0].id);
    } else {
      await supabase.from('hospital_config').insert([newConfig]);
    }
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
