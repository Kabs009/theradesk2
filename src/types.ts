export enum ClientStatus {
  PROSPECT = 'Prospect',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DISCHARGED = 'Discharged'
}

export enum SessionType {
  INDIVIDUAL = 'Individual',
  COUPLE = 'Couple',
  GROUP = 'Group'
}

export enum MeetingMode {
  ONLINE = 'Online',
  PHYSICAL = 'Physical'
}

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'No-show'
}

export enum NoteStatus {
  DRAFT = 'Draft',
  FINALIZED = 'Finalized'
}

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  PENDING = 'Pending',
  PAID = 'Paid',
  REFUNDED = 'Refunded'
}

export enum UserPlan {
  FREE = 'Free',
  PAID = 'Paid'
}

export type NoteCategory = 'Clinical Intake' | 'Progress Note';

export interface Practitioner {
  id: string;
  email: string;
  fullName: string;
  plan: UserPlan;
  practiceName: string;
}

export interface Client {
  id: string;
  practitionerId: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  status: ClientStatus;
  presentingConcern: string;
  emergencyContact: string;
  consentSigned: boolean;
  createdAt: number;
}

export interface Appointment {
  id: string;
  practitionerId: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  duration: number; // minutes
  type: SessionType;
  mode: MeetingMode;
  status: AppointmentStatus;
}

export interface SessionRecord {
  id: string;
  practitionerId: string;
  appointmentId: string;
  clientId: string;
  noteId?: string;
  isLocked: boolean;
  completedAt: number;
}

export interface ClinicalNote {
  id: string;
  practitionerId: string;
  clientId: string;
  sessionId?: string;
  category: NoteCategory;
  title: string;
  content: string; 
  status: NoteStatus;
  createdAt: number;
  finalizedAt?: number;
}

export interface Invoice {
  id: string;
  practitionerId: string;
  clientId: string;
  appointmentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  issuedAt: number;
  paidAt?: number;
}

export interface PracticeDocument {
  id: string;
  practitionerId: string;
  clientId: string;
  name: string;
  category: 'Informed Consent' | 'Assessment' | 'Identification' | 'Other';
  mimeType: string;
  data: string; // base64 string
  uploadedAt: number;
  aiVerified?: boolean;
  aiVerificationReason?: string;
  clinicianVerifiedAt?: number;
}

export interface Assessment {
  id: string;
  practitionerId: string;
  clientId: string;
  type: 'PHQ-9' | 'GAD-7';
  score: number;
  data: Record<string, any>;
  date: string;
}

export interface AuditLogEntry {
  id: string;
  practitionerId: string;
  action: string;
  timestamp: number;
  details: string;
}