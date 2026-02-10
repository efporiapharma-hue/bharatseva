
export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  departmentId: string;
  photo: string;
  availableDays: string[]; // e.g., ["Mon", "Wed", "Fri"]
  timeSlots: string[]; // e.g., ["10:00 AM - 12:00 PM", "4:00 PM - 6:00 PM"]
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant: boolean;
}

export interface HospitalConfig {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
}
