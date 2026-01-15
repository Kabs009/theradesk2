import { supabase } from './db';
import { Practitioner, Client, Appointment, ClinicalNote } from './types';

export const fromSnake = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(fromSnake);
  if (obj === null || typeof obj !== 'object') return obj;
  const n: any = {};
  Object.keys(obj).forEach(k => {
    const ck = k.replace(/(_\w)/g, m => m[1].toUpperCase());
    n[ck] = fromSnake(obj[k]);
  });
  return n;
};

export const toSnake = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toSnake);
  if (obj === null || typeof obj !== 'object') return obj;
  const n: any = {};
  Object.keys(obj).forEach(k => {
    const sk = k.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`);
    n[sk] = toSnake(obj[k]);
  });
  return n;
};

export const loadPracticeData = async (practitionerId: string) => {
  try {
    const [c, a, n] = await Promise.all([
      supabase.from('clients').select('*').eq('practitioner_id', practitionerId),
      supabase.from('appointments').select('*').eq('practitioner_id', practitionerId),
      supabase.from('notes').select('*').eq('practitioner_id', practitionerId)
    ]);
    
    if (c.error?.code === '42P01') throw new Error("SCHEMA_MISSING");

    return {
      clients: fromSnake(c.data || []) as Client[],
      appointments: fromSnake(a.data || []) as Appointment[],
      notes: fromSnake(n.data || []) as ClinicalNote[]
    };
  } catch (e: any) {
    if (e.message === "SCHEMA_MISSING") throw e;
    return { clients: [], appointments: [], notes: [] };
  }
};

export const syncClient = async (client: Client) => {
  await supabase.from('clients').upsert(toSnake(client));
};

export const syncAppointment = async (appt: Appointment) => {
  await supabase.from('appointments').upsert(toSnake(appt));
};

export const syncNote = async (note: ClinicalNote) => {
  await supabase.from('notes').upsert(toSnake(note));
};

export const dbUpsertPractitioner = async (p: Practitioner) => {
  await supabase.from('practitioners').upsert(toSnake(p));
};

export const addAuditLog = async (practitionerId: string, action: string, details: string) => {
  const log = {
    id: `log-${Date.now()}`,
    practitionerId,
    action,
    details,
    timestamp: Date.now()
  };
  try {
    await supabase.from('audit_logs').upsert(toSnake(log));
  } catch (err) {
    console.warn("Audit log sync failed:", err);
  }
};