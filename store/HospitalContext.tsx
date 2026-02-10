
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
  const [lastError, setLastError] = useState<string | null>(null);
  const [config, setConfig] = useState<HospitalConfig>(DEFAULT_CONFIG);
  
  const lastRefresh = useRef(0);

  // Deep Key Search helper to find data even if column names differ
  const findValue = (obj: any, keys: string[]) => {
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return null;
  };

  const mapDoctor = (d: any): Doctor => ({
    id: d.id,
    name: findValue(d, ['name', 'full_name', 'fullName', 'doctor_name', 'doctorName']) || 'Unnamed Doctor',
    qualification: findValue(d, ['qualification', 'degree', 'qualifications', 'specialization']) || 'Specialist',
    departmentId: findValue(d, ['departmentId', 'department_id', 'dept_id', 'deptId']) || '',
    photo: findValue(d, ['photo', 'photo_url', 'photoUrl', 'image', 'image_url']) || DEFAULT_LOGO,
    availableDays: d.availableDays || d.available_days || [],
    timeSlots: d.timeSlots || d.time_slots || []
  });

  const mapAppointment = (a: any): Appointment => ({
    id: a.id,
    patientName: findValue(a, ['patientName', 'patient_name', 'patientname', 'name']) || 'Unknown Patient',
    patientPhone: findValue(a, ['patientPhone', 'patient_phone', 'patientphone', 'phone']) || 'N/A',
    patientEmail: findValue(a, ['patientEmail', 'patient_email', 'patientemail', 'email']) || '',
    doctorId: findValue(a, ['doctorId', 'doctor_id', 'doctorid']) || '',
    date: findValue(a, ['date', 'consultation_date', 'booking_date']) || '',
    timeSlot: findValue(a, ['timeSlot', 'timeslot', 'time_slot', 'slot']) || '',
    status: a.status || 'Pending'
  });

  const mapNotice = (n: any): Notice => ({
    id: n.id,
    title: n.title || 'Bulletin',
    content: n.content || '',
    date: n.date || '',
    isImportant: n.isImportant || n.is_important || false
  });

  const safeFetch = async (tableNames: string[]) => {
    for (const tableName of tableNames) {
      try {
        const { data, error } = await supabase.from(tableName).select('*').limit(100);
        if (!error && data) return data;
      } catch (e) { continue; }
    }
    return null;
  };

  const refreshData = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastRefresh.current < 800) return;
    lastRefresh.current = now;

    try {
      const [rDocs, rDepts, rServs, rApts, rNotes, rCfg] = await Promise.all([
        safeFetch(['doctors', 'doctor', 'specialists']),
        safeFetch(['departments', 'department', 'units']),
        safeFetch(['services', 'service', 'facilities']),
        safeFetch(['appointments', 'appointment', 'bookings']),
        safeFetch(['notices', 'notice', 'bulletins']),
        supabase.from('hospital_config').select('*').limit(1)
      ]);

      if (rDocs) setDoctors(rDocs.map(mapDoctor));
      if (rDepts) setDepartments(rDepts);
      if (rServs) setServices(rServs);
      if (rApts) setAppointments(rApts.map(mapAppointment));
      if (rNotes) setNotices(rNotes.map(mapNotice));
      if (rCfg.data?.[0]) {
        const cfgData = rCfg.data[0];
        setConfig({
          name: findValue(cfgData, ['name', 'hospital_name']) || DEFAULT_CONFIG.name,
          logo: findValue(cfgData, ['logo', 'logo_url']) || DEFAULT_LOGO,
          address: findValue(cfgData, ['address', 'physical_address']) || DEFAULT_CONFIG.address,
          phone: findValue(cfgData, ['phone', 'phone_number']) || DEFAULT_CONFIG.phone,
          email: findValue(cfgData, ['email', 'official_email']) || DEFAULT_CONFIG.email
        });
      }

      setDbConnected(true);
      setLastError(null);
    } catch (err: any) {
      console.error("Critical Sync Failure:", err);
      setDbConnected(false);
      setLastError(err.message || "Connection refused");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData(true);
    const channel = supabase.channel('hospital-realtime-v8')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => refreshData(true))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refreshData]);

  const addDoctor = async (doc: Omit<Doctor, 'id'>) => {
    const payload = {
      name: doc.name,
      full_name: doc.name,
      qualification: doc.qualification,
      degree: doc.qualification,
      photo: doc.photo,
      photo_url: doc.photo,
      departmentId: doc.departmentId || null,
      department_id: doc.departmentId || null,
      availableDays: doc.availableDays,
      available_days: doc.availableDays,
      timeSlots: doc.timeSlots,
      time_slots: doc.timeSlots
    };
    
    const { error } = await supabase.from('doctors').insert([payload]);
    if (error) {
      const retry = await supabase.from('doctor').insert([payload]);
      if (retry.error) {
        setLastError(retry.error.message);
        return false;
      }
    }
    
    await refreshData(true);
    return true;
  };

  const removeDoctor = async (id: string) => {
    await supabase.from('doctors').delete().eq('id', id);
    await supabase.from('doctor').delete().eq('id', id);
    await refreshData(true);
  };

  const addDepartment = async (dept: Omit<Department, 'id'>) => {
    const { error } = await supabase.from('departments').insert([dept]);
    if (error) await supabase.from('department').insert([dept]);
    await refreshData(true);
    return true;
  };

  const removeDepartment = async (id: string) => {
    await supabase.from('departments').delete().eq('id', id);
    await supabase.from('department').delete().eq('id', id);
    await refreshData(true);
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    const { error } = await supabase.from('services').insert([service]);
    if (error) await supabase.from('service').insert([service]);
    await refreshData(true);
    return true;
  };

  const removeService = async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    await supabase.from('service').delete().eq('id', id);
    await refreshData(true);
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    const payload = {
      title: notice.title,
      content: notice.content,
      date: notice.date,
      isImportant: notice.isImportant,
      is_important: notice.isImportant
    };
    const { error } = await supabase.from('notices').insert([payload]);
    if (error) await supabase.from('notice').insert([payload]);
    await refreshData(true);
  };

  const removeNotice = async (id: string) => {
    await supabase.from('notices').delete().eq('id', id);
    await supabase.from('notice').delete().eq('id', id);
    await refreshData(true);
  };

  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'status'>) => {
    const payload = {
      patientName: apt.patientName,
      patient_name: apt.patientName,
      patientPhone: apt.patientPhone,
      patient_phone: apt.patientPhone,
      patientEmail: apt.patientEmail,
      patient_email: apt.patientEmail,
      doctorId: apt.doctorId || null,
      doctor_id: apt.doctorId || null,
      date: apt.date,
      timeSlot: apt.timeSlot,
      time_slot: apt.timeSlot,
      status: 'Pending'
    };

    const { error } = await supabase.from('appointments').insert([payload]);
    if (error) await supabase.from('appointment').insert([payload]);
    await refreshData(true);
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) await supabase.from('appointment').update({ status }).eq('id', id);
    await refreshData(true);
  };

  const removeAppointment = async (id: string) => {
    await supabase.from('appointments').delete().eq('id', id);
    await supabase.from('appointment').delete().eq('id', id);
    await refreshData(true);
  };

  const updateDoctor = async (id: string, doc: Partial<Doctor>) => {
    await supabase.from('doctors').update(doc).eq('id', id);
    await supabase.from('doctor').update(doc).eq('id', id);
    await refreshData(true);
  };

  const updateConfig = async (cfg: Partial<HospitalConfig>) => { 
    const { data } = await supabase.from('hospital_config').select('id').limit(1); 
    const payload = {
      ...cfg,
      logo_url: cfg.logo, // Dual field support
      hospital_name: cfg.name
    };
    if (data?.[0]) { await supabase.from('hospital_config').update(payload).eq('id', data[0].id); } 
    else { await supabase.from('hospital_config').insert([payload]); } 
    await refreshData(true); 
  };

  return (
    <HospitalContext.Provider value={{
      doctors, departments, services, appointments, notices, config, loading, dbConnected, lastError,
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
