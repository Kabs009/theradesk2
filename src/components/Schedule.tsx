import React, { useState, useEffect } from 'react';
import { Appointment, Client, SessionType, MeetingMode, AppointmentStatus, Practitioner } from '../types';
import { addAuditLog } from '../store';

interface ScheduleProps {
  appointments: Appointment[];
  clients: Client[];
  onUpdateData: (newData: any) => void;
  initialOpenModal?: boolean;
  onModalClose?: () => void;
  user: Practitioner;
}

const Schedule: React.FC<ScheduleProps> = ({ appointments, clients, onUpdateData, initialOpenModal, onModalClose, user }) => {
  const [showModal, setShowModal] = useState(initialOpenModal || false);
  const [error, setError] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [newAppt, setNewAppt] = useState<Partial<Appointment>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    duration: 50,
    type: SessionType.INDIVIDUAL,
    mode: MeetingMode.ONLINE,
    status: AppointmentStatus.SCHEDULED
  });

  useEffect(() => {
    if (initialOpenModal) setShowModal(true);
  }, [initialOpenModal]);

  // Calendar Logic
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const totalDays = daysInMonth(currentYear, currentMonth);
  const offset = (startDayOfMonth(currentYear, currentMonth) + 6) % 7; // Adjust for Mon start (0=Mon, 6=Sun)

  const changeMonth = (delta: number) => {
    const nextDate = new Date(viewDate);
    nextDate.setMonth(nextDate.getMonth() + delta);
    setViewDate(nextDate);
  };

  // Helper to convert HH:mm to minutes from midnight
  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const checkConflict = (date: string, startTime: string, duration: number) => {
    const proposedStart = timeToMinutes(startTime);
    const proposedEnd = proposedStart + duration;

    return appointments.find(appt => {
      if (appt.date !== date) return false;
      if (appt.status === AppointmentStatus.CANCELLED) return false;

      const existingStart = timeToMinutes(appt.startTime);
      const existingEnd = existingStart + appt.duration;

      // Overlap logic: (StartA < EndB) and (EndA > StartB)
      return proposedStart < existingEnd && proposedEnd > existingStart;
    });
  };

  const handleSave = () => {
    setError(null);

    if (!newAppt.clientId || !newAppt.date || !newAppt.startTime) {
      setError("Please fill in all required fields.");
      return;
    }

    const conflict = checkConflict(newAppt.date, newAppt.startTime, newAppt.duration || 50);
    
    if (conflict) {
      const client = clients.find(c => c.id === conflict.clientId);
      setError(`Conflict detected: ${conflict.startTime} is occupied by a session with ${client?.name || 'another client'}.`);
      return;
    }
    
    const appt: Appointment = {
      ...newAppt as Appointment,
      id: `a-${Date.now()}`,
      practitionerId: user.id
    };

    onUpdateData({ appointments: [...appointments, appt] });
    addAuditLog(user.id, 'APPOINTMENT_SCHEDULED', `Scheduled ${appt.type} on ${appt.date}`);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setError(null);
    if (onModalClose) onModalClose();
  };

  const renderDayCell = (day: number | null, index: number) => {
    if (day === null) return <div key={`empty-${index}`} className="bg-gray-50/30 min-h-[120px] border border-gray-50"></div>;

    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const dayAppointments = appointments.filter(a => a.date === dateStr && a.status !== AppointmentStatus.CANCELLED);
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    return (
      <div key={day} className={`bg-white min-h-[120px] p-2 hover:bg-gray-50 transition-all border border-gray-100 group relative`}>
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-black ${isToday ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-400'}`}>
            {day}
          </span>
        </div>
        <div className="space-y-1">
          {dayAppointments.sort((a,b) => a.startTime.localeCompare(b.startTime)).map(a => (
            <div key={a.id} className="p-1.5 bg-indigo-50 text-indigo-700 text-[9px] rounded-lg font-bold truncate border border-indigo-100 shadow-sm leading-tight">
              <div className="flex justify-between gap-1">
                <span className="shrink-0">{a.startTime}</span>
                <span className="truncate">{clients.find(c => c.id === a.clientId)?.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const calendarDays = [];
  for (let i = 0; i < offset; i++) calendarDays.push(null);
  for (let i = 1; i <= totalDays; i++) calendarDays.push(i);

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Practice Calendar</h2>
          <p className="text-gray-500 mt-1">Manage weekly availability and session density.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 py-1 shadow-sm">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-all">
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="px-4 font-black text-gray-900 min-w-[140px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-all">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100">
            <i className="fas fa-plus"></i> New Appointment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="bg-gray-50/50 p-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-50 last:border-r-0">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-gray-50/30">
          {calendarDays.map((day, i) => renderDayCell(day, i))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900">Schedule Session</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-2"><i className="fas fa-times text-xl"></i></button>
            </div>
            
            <div className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-start gap-3 animate-shake">
                  <i className="fas fa-exclamation-circle mt-0.5"></i>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="clientId" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Client</label>
                <select 
                  id="clientId"
                  name="clientId"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  onChange={(e) => { setNewAppt({...newAppt, clientId: e.target.value}); setError(null); }}
                  value={newAppt.clientId || ""}
                >
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="apptDate" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                  <input 
                    id="apptDate"
                    name="date"
                    type="date" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                    value={newAppt.date} 
                    onChange={(e) => { setNewAppt({...newAppt, date: e.target.value}); setError(null); }} 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="apptTime" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Time</label>
                  <input 
                    id="apptTime"
                    name="startTime"
                    type="time" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                    value={newAppt.startTime} 
                    onChange={(e) => { setNewAppt({...newAppt, startTime: e.target.value}); setError(null); }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="apptDuration" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration (min)</label>
                  <select 
                    id="apptDuration"
                    name="duration"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={newAppt.duration}
                    onChange={(e) => { setNewAppt({...newAppt, duration: Number(e.target.value)}); setError(null); }}
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={50}>50 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="apptType" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Session Type</label>
                  <select 
                    id="apptType"
                    name="type"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={newAppt.type}
                    onChange={(e) => setNewAppt({...newAppt, type: e.target.value as SessionType})}
                  >
                    <option value={SessionType.INDIVIDUAL}>Individual</option>
                    <option value={SessionType.COUPLE}>Couple</option>
                    <option value={SessionType.GROUP}>Group</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={closeModal} className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
              <button 
                onClick={handleSave} 
                className="px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;