
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Doctor, Department, Service, Appointment, Notice, HospitalConfig } from '../types';

/**
 * SQL SCHEMA SETUP GUIDE (Run this in your Supabase SQL Editor):
 * 
 * -- 1. Create Departments Table
 * CREATE TABLE departments (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name text NOT NULL,
 *   description text,
 *   icon text
 * );
 * 
 * -- 2. Create Doctors Table
 * CREATE TABLE doctors (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name text NOT NULL,
 *   qualification text,
 *   "departmentId" uuid REFERENCES departments(id),
 *   photo text,
 *   "availableDays" text[],
 *   "timeSlots" text[]
 * );
 * 
 * -- 3. Create Services Table
 * CREATE TABLE services (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   title text NOT NULL,
 *   description text
 * );
 * 
 * -- 4. Create Appointments Table
 * CREATE TABLE appointments (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   "patientName" text NOT NULL,
 *   "patientEmail" text,
 *   "patientPhone" text,
 *   "doctorId" uuid REFERENCES doctors(id),
 *   date text,
 *   "timeSlot" text,
 *   status text DEFAULT 'Pending'
 * );
 * 
 * -- 5. Create Notices Table
 * CREATE TABLE notices (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   title text NOT NULL,
 *   content text,
 *   date text,
 *   "isImportant" boolean DEFAULT false
 * );
 * 
 * -- 6. Create Hospital Config Table
 * CREATE TABLE hospital_config (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name text,
 *   logo text,
 *   address text,
 *   phone text,
 *   email text
 * );
 */

const SUPABASE_URL = 'https://pserlfetpyqoknfzhppc.supabase.co';
// WARNING: The key below starts with 'sb_publishable_', which is a Vercel key.
// Supabase usually requires an 'anon public' key starting with 'eyJ...'.
// If saving fails, please verify this key in your Supabase Dashboard.
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
        supabase.from('appointments').select('*').order('date', { ascending: false }),
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

  // Real-time synchronization across browsers
  useEffect(() => {
    refreshData();
    
    const tables = ['doctors', 'departments', 'services', 'appointments', 'notices', 'hospital_config'];
    const channels = tables.map(table => 
      supabase.channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
          console.log(`Change detected in ${table}, refreshing...`);
          refreshData();
        })
        .subscribe()
    );

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const handleError = (error: any, operation: string) => {
    console.error(`Database Error during ${operation}:`, error);
    alert(`Could not save to database. This is likely due to the Vercel key format. Please check console for details.`);
  };

  const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
    setDoctors(prev => [...prev, { ...doc, id: 'temp' }]); // Optimistic UI
    const { error } = await supabase.from('doctors').insert([doc]);
    if (error) handleError(error, 'Add Doctor');
    await refreshData();
  };

  const updateDoctor = async (id: string, doc: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...doc } : d));
    const { error } = await supabase.from('doctors').update(doc).eq('id', id);
    if (error) handleError(error, 'Update Doctor');
    await refreshData();
  };

  const removeDoctor = async (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) handleError(error, 'Remove Doctor');
    await refreshData();
  };

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    setDepartments(prev => [...prev, { ...dept, id: 'temp' }]);
    const { error } = await supabase.from('departments').insert([dept]);
    if (error) handleError(error, 'Add Department');
    await refreshData();
  };

  const removeDepartment = async (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (error) handleError(error, 'Remove Department');
    await refreshData();
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    setServices(prev => [...prev, { ...service, id: 'temp' }]);
    const { error } = await supabase.from('services').insert([service]);
    if (error) handleError(error, 'Add Service');
    await refreshData();
  };

  const removeService = async (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) handleError(error, 'Remove Service');
    await refreshData();
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    setNotices(prev => [{ ...notice, id: 'temp' }, ...prev]);
    const { error } = await supabase.from('notices').insert([notice]);
    if (error) handleError(error, 'Add Notice');
    await refreshData();
  };

  const removeNotice = async (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) handleError(error, 'Remove Notice');
    await refreshData();
  };

  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'status'>) => {
    setAppointments(prev => [{ ...apt, id: 'temp', status: 'Pending' }, ...prev]);
    const { error } = await supabase.from('appointments').insert([{ ...apt, status: 'Pending' }]);
    if (error) handleError(error, 'Book Appointment');
    await refreshData();
  };

  const updateAppointment = async (id: string, apt: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...apt } : a));
    const { error } = await supabase.from('appointments').update(apt).eq('id', id);
    if (error) handleError(error, 'Update Appointment');
    await refreshData();
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) handleError(error, 'Update Status');
    await refreshData();
  };

  const updateConfig = async (newConfig: Partial<HospitalConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    const { data: existing } = await supabase.from('hospital_config').select('id').limit(1);
    const { error } = existing && existing.length > 0 
      ? await supabase.from('hospital_config').update(newConfig).eq('id', existing[0].id)
      : await supabase.from('hospital_config').insert([newConfig]);
    
    if (error) handleError(error, 'Update Config');
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
