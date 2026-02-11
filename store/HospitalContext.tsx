
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Doctor, Department, Service, Appointment, Notice, HospitalConfig } from '../types';

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
  isDemoMode: boolean;
  lastError: string | null;
  addDoctor: (doc: Omit<Doctor, 'id'>) => Promise<boolean>;
  updateDoctor: (id: string, doc: Partial<Doctor>) => Promise<void>;
  removeDoctor: (id: string) => Promise<void>;
  addDepartment: (dept: Omit<Department, 'id'>) => Promise<boolean>;
  removeDepartment: (id: string) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<boolean>;
  removeService: (id: string) => Promise<void>;
  addNotice: (notice: Omit<Notice, 'id'>) => Promise<void>;
  removeNotice: (id: string) => Promise<void>;
  bookAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
  removeAppointment: (id: string) => Promise<void>;
  updateConfig: (config: Partial<HospitalConfig>) => Promise<void>;
  refreshData: (force?: boolean) => Promise<void>;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const DEFAULT_LOGO = 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/hospital.svg';

const DEFAULT_CONFIG: HospitalConfig = {
  name: 'Bharat Seva Hospital',
  logo: DEFAULT_LOGO,
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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [config, setConfig] = useState<HospitalConfig>(DEFAULT_CONFIG);
  
  const lastRefresh = useRef(0);

  // Storage Keys for Offline Fallback
  const STORAGE_KEYS = {
    DOCTORS: 'bharat_doctors_v1',
    DEPTS: 'bharat_depts_v1',
    SERVICES: 'bharat_services_v1',
    APPOINTMENTS: 'bharat_apts_v1',
    NOTICES: 'bharat_notices_v1',
    CONFIG: 'bharat_config_v1'
  };

  const saveToLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
  const getFromLocal = (key: string) => {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : null;
  };

  const findValue = (obj: any, keys: string[]) => {
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return null;
  };

  const mapDoctor = (d: any): Doctor => ({
    id: d.id || Math.random().toString(36).substr(2, 9),
    name: findValue(d, ['name', 'full_name', 'fullName', 'doctor_name']) || 'Unnamed Doctor',
    qualification: findValue(d, ['qualification', 'degree', 'specialization']) || 'Specialist',
    departmentId: findValue(d, ['departmentId', 'department_id', 'dept_id']) || '',
    photo: findValue(d, ['photo', 'photo_url', 'image']) || DEFAULT_LOGO,
    availableDays: d.availableDays || d.available_days || [],
    timeSlots: d.timeSlots || d.time_slots || []
  });

  const mapAppointment = (a: any): Appointment => ({
    id: a.id || Math.random().toString(36).substr(2, 9),
    patientName: findValue(a, ['patientName', 'patient_name', 'name']) || 'Unknown Patient',
    patientPhone: findValue(a, ['patientPhone', 'patient_phone', 'phone']) || 'N/A',
    patientEmail: findValue(a, ['patientEmail', 'patient_email', 'email']) || '',
    doctorId: findValue(a, ['doctorId', 'doctor_id']) || '',
    date: findValue(a, ['date', 'consultation_date']) || '',
    timeSlot: findValue(a, ['timeSlot', 'time_slot', 'slot']) || '',
    status: a.status || 'Pending'
  });

  const refreshData = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastRefresh.current < 800) return;
    lastRefresh.current = now;

    try {
      const { data: dDocs, error: eDocs } = await supabase.from('doctors').select('*');
      const { data: dDepts, error: eDepts } = await supabase.from('departments').select('*');
      const { data: dServs, error: eServs } = await supabase.from('services').select('*');
      const { data: dApts, error: eApts } = await supabase.from('appointments').select('*');
      const { data: dNotes, error: eNotes } = await supabase.from('notices').select('*');
      const { data: dCfg, error: eCfg } = await supabase.from('hospital_config').select('*').limit(1);

      // If any core table fails with "not found", we trigger Demo Mode logic
      if (eDocs?.code === 'PGRST116' || eDocs?.message.includes('not found')) {
        setIsDemoMode(true);
        setDoctors(getFromLocal(STORAGE_KEYS.DOCTORS) || []);
        setDepartments(getFromLocal(STORAGE_KEYS.DEPTS) || []);
        setServices(getFromLocal(STORAGE_KEYS.SERVICES) || []);
        setAppointments(getFromLocal(STORAGE_KEYS.APPOINTMENTS) || []);
        setNotices(getFromLocal(STORAGE_KEYS.NOTICES) || []);
        const localCfg = getFromLocal(STORAGE_KEYS.CONFIG);
        if (localCfg) setConfig(localCfg);
        setLastError("Database Tables Missing. Running in Local Mode.");
        setDbConnected(false);
      } else {
        if (dDocs) { setDoctors(dDocs.map(mapDoctor)); saveToLocal(STORAGE_KEYS.DOCTORS, dDocs.map(mapDoctor)); }
        if (dDepts) { setDepartments(dDepts); saveToLocal(STORAGE_KEYS.DEPTS, dDepts); }
        if (dServs) { setServices(dServs); saveToLocal(STORAGE_KEYS.SERVICES, dServs); }
        if (dApts) { setAppointments(dApts.map(mapAppointment)); saveToLocal(STORAGE_KEYS.APPOINTMENTS, dApts.map(mapAppointment)); }
        if (dNotes) { setNotices(dNotes); saveToLocal(STORAGE_KEYS.NOTICES, dNotes); }
        if (dCfg?.[0]) { setConfig(dCfg[0]); saveToLocal(STORAGE_KEYS.CONFIG, dCfg[0]); }
        
        setDbConnected(true);
        setIsDemoMode(false);
        setLastError(null);
      }
    } catch (err: any) {
      setIsDemoMode(true);
      setLastError("Connection Issue. Using Offline Data.");
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData(true);
  }, [refreshData]);

  const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
    const payload = { ...doc, id: Math.random().toString(36).substr(2, 9) };
    
    if (isDemoMode) {
      const newList = [...doctors, payload];
      setDoctors(newList);
      saveToLocal(STORAGE_KEYS.DOCTORS, newList);
      return true;
    }

    const { error } = await supabase.from('doctors').insert([doc]);
    if (error) {
      setLastError(error.message);
      // Fallback to local if insert fails
      const newList = [...doctors, payload];
      setDoctors(newList);
      saveToLocal(STORAGE_KEYS.DOCTORS, newList);
      return true;
    }
    
    await refreshData(true);
    return true;
  };

  const removeDoctor = async (id: string) => {
    if (isDemoMode) {
      const newList = doctors.filter(d => d.id !== id);
      setDoctors(newList);
      saveToLocal(STORAGE_KEYS.DOCTORS, newList);
    } else {
      await supabase.from('doctors').delete().eq('id', id);
      await refreshData(true);
    }
  };

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    if (isDemoMode) {
      const newList = [...departments, { ...dept, id: Math.random().toString(36).substr(2, 9) }];
      setDepartments(newList);
      saveToLocal(STORAGE_KEYS.DEPTS, newList);
    } else {
      await supabase.from('departments').insert([dept]);
      await refreshData(true);
    }
    return true;
  };

  const removeDepartment = async (id: string) => {
    if (isDemoMode) {
      setDepartments(departments.filter(d => d.id !== id));
    } else {
      await supabase.from('departments').delete().eq('id', id);
      await refreshData(true);
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    if (isDemoMode) {
      setServices([...services, { ...service, id: Math.random().toString(36).substr(2, 9) }]);
    } else {
      await supabase.from('services').insert([service]);
      await refreshData(true);
    }
    return true;
  };

  const removeService = async (id: string) => {
    if (isDemoMode) {
      setServices(services.filter(s => s.id !== id));
    } else {
      await supabase.from('services').delete().eq('id', id);
      await refreshData(true);
    }
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    if (isDemoMode) {
      setNotices([...notices, { ...notice, id: Math.random().toString(36).substr(2, 9) }]);
    } else {
      await supabase.from('notices').insert([notice]);
      await refreshData(true);
    }
  };

  const removeNotice = async (id: string) => {
    if (isDemoMode) {
      setNotices(notices.filter(n => n.id !== id));
    } else {
      await supabase.from('notices').delete().eq('id', id);
      await refreshData(true);
    }
  };

  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'status'>) => {
    if (isDemoMode) {
      setAppointments([...appointments, { ...apt, id: Math.random().toString(36).substr(2, 9), status: 'Pending' }]);
    } else {
      await supabase.from('appointments').insert([{ ...apt, status: 'Pending' }]);
      await refreshData(true);
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    if (isDemoMode) {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    } else {
      await supabase.from('appointments').update({ status }).eq('id', id);
      await refreshData(true);
    }
  };

  const removeAppointment = async (id: string) => {
    if (isDemoMode) {
      setAppointments(appointments.filter(a => a.id !== id));
    } else {
      await supabase.from('appointments').delete().eq('id', id);
      await refreshData(true);
    }
  };

  const updateDoctor = async (id: string, doc: Partial<Doctor>) => {
    if (isDemoMode) {
      setDoctors(doctors.map(d => d.id === id ? { ...d, ...doc } : d));
    } else {
      await supabase.from('doctors').update(doc).eq('id', id);
      await refreshData(true);
    }
  };

  const updateConfig = async (cfg: Partial<HospitalConfig>) => { 
    if (isDemoMode) {
      const newCfg = { ...config, ...cfg };
      setConfig(newCfg);
      saveToLocal(STORAGE_KEYS.CONFIG, newCfg);
    } else {
      const { data } = await supabase.from('hospital_config').select('id').limit(1); 
      if (data?.[0]) { await supabase.from('hospital_config').update(cfg).eq('id', data[0].id); } 
      else { await supabase.from('hospital_config').insert([cfg]); } 
      await refreshData(true); 
    }
  };

  return (
    <HospitalContext.Provider value={{
      doctors, departments, services, appointments, notices, config, loading, dbConnected, isDemoMode, lastError,
      addDoctor, updateDoctor, removeDoctor, addDepartment, removeDepartment, 
      addService, removeService, addNotice, removeNotice, 
      bookAppointment, updateAppointmentStatus, removeAppointment, updateConfig,
      refreshData
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) throw new Error('useHospital missing provider');
  return context;
};
