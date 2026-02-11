
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
  const [dbConnected, setDbConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  const [config, setConfig] = useState<HospitalConfig>(DEFAULT_CONFIG);
  
  const lastRefresh = useRef(0);

  const mapDoctor = (d: any): Doctor => ({
    id: d.id,
    name: d.name,
    qualification: d.qualification,
    departmentId: d.department_id || '',
    photo: d.photo || DEFAULT_LOGO,
    availableDays: d.available_days || [],
    timeSlots: d.time_slots || []
  });

  const mapAppointment = (a: any): Appointment => ({
    id: a.id,
    patientName: a.patient_name,
    patientPhone: a.patient_phone,
    patientEmail: a.patient_email || '',
    doctorId: a.doctor_id || '',
    date: a.date,
    timeSlot: a.time_slot,
    status: a.status || 'Pending'
  });

  const refreshData = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastRefresh.current < 800) return;
    lastRefresh.current = now;

    try {
      const [rDocs, rDepts, rServs, rApts, rNotes, rCfg] = await Promise.all([
        supabase.from('doctors').select('*'),
        supabase.from('departments').select('*'),
        supabase.from('services').select('*'),
        supabase.from('appointments').select('*'),
        supabase.from('notices').select('*'),
        supabase.from('hospital_config').select('*').limit(1)
      ]);

      if (rDocs.error || rDepts.error) {
        setDbConnected(false);
        setIsDemoMode(true);
        setLastError("Table not found.");
      } else {
        if (rDocs.data) setDoctors(rDocs.data.map(mapDoctor));
        if (rDepts.data) setDepartments(rDepts.data);
        if (rServs.data) setServices(rServs.data);
        if (rApts.data) setAppointments(rApts.data.map(mapAppointment));
        if (rNotes.data) setNotices(rNotes.data.map(n => ({
          id: n.id,
          title: n.title,
          content: n.content,
          date: n.date,
          isImportant: n.is_important
        })));
        if (rCfg.data?.[0]) setConfig(rCfg.data[0]);
        
        setDbConnected(true);
        setIsDemoMode(false);
        setLastError(null);
      }
    } catch (err: any) {
      setDbConnected(false);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData(true);
  }, [refreshData]);

  const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
    const { error } = await supabase.from('doctors').insert([{
      name: doc.name,
      qualification: doc.qualification,
      department_id: doc.departmentId,
      photo: doc.photo,
      available_days: doc.availableDays,
      time_slots: doc.timeSlots
    }]);
    if (error) return false;
    await refreshData(true);
    return true;
  };

  const removeDoctor = async (id: string) => {
    await supabase.from('doctors').delete().eq('id', id);
    await refreshData(true);
  };

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    await supabase.from('departments').insert([dept]);
    await refreshData(true);
    return true;
  };

  const removeDepartment = async (id: string) => {
    await supabase.from('departments').delete().eq('id', id);
    await refreshData(true);
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    await supabase.from('services').insert([service]);
    await refreshData(true);
    return true;
  };

  const removeService = async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    await refreshData(true);
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    await supabase.from('notices').insert([{
      title: notice.title,
      content: notice.content,
      date: notice.date,
      is_important: notice.isImportant
    }]);
    await refreshData(true);
  };

  const removeNotice = async (id: string) => {
    await supabase.from('notices').delete().eq('id', id);
    await refreshData(true);
  };

  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'status'>) => {
    await supabase.from('appointments').insert([{
      patient_name: apt.patientName,
      patient_phone: apt.patientPhone,
      patient_email: apt.patientEmail,
      doctor_id: apt.doctorId,
      date: apt.date,
      time_slot: apt.timeSlot,
      status: 'Pending'
    }]);
    await refreshData(true);
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    await refreshData(true);
  };

  const removeAppointment = async (id: string) => {
    await supabase.from('appointments').delete().eq('id', id);
    await refreshData(true);
  };

  const updateDoctor = async (id: string, doc: Partial<Doctor>) => {
    const dbPayload: any = { ...doc };
    if (doc.departmentId) dbPayload.department_id = doc.departmentId;
    if (doc.availableDays) dbPayload.available_days = doc.availableDays;
    if (doc.timeSlots) dbPayload.time_slots = doc.timeSlots;
    delete dbPayload.departmentId;
    delete dbPayload.availableDays;
    delete dbPayload.timeSlots;
    await supabase.from('doctors').update(dbPayload).eq('id', id);
    await refreshData(true);
  };

  const updateConfig = async (cfg: Partial<HospitalConfig>) => { 
    const { data } = await supabase.from('hospital_config').select('id').limit(1); 
    if (data?.[0]) await supabase.from('hospital_config').update(cfg).eq('id', data[0].id);
    else await supabase.from('hospital_config').insert([cfg]);
    await refreshData(true); 
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
