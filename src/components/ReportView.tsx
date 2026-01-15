
import React from 'react';
import { AppointmentStatus, Practitioner } from '../types';

interface ReportViewProps {
  data: any;
  user: Practitioner;
}

const ReportView: React.FC<ReportViewProps> = ({ data, user }) => {
  const completedSessions = data.appointments.filter((a: any) => a.status === AppointmentStatus.COMPLETED);

  const handleExportCSV = () => {
    const headers = ["Client Name", "Date", "Start Time", "Duration (min)", "Type", "Mode"];
    const rows = completedSessions.map((appt: any) => {
      const client = data.clients.find((c: any) => c.id === appt.clientId);
      return [
        `"${client?.name || 'Unknown'}"`,
        appt.date,
        appt.startTime,
        appt.duration,
        appt.type,
        appt.mode
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Practice_Activity_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Practice Reports</h2>
          <p className="text-gray-500 mt-1">Track monthly activity, documentation status, and growth.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-10 space-y-10">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between bg-gray-50/50 rounded-2xl gap-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900">Session Activity</h3>
            <p className="text-xs text-gray-500 mt-0.5">Report period summary</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportCSV}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
            >
              <i className="fas fa-file-csv"></i> Export CSV
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Completed Sessions</h3>
          <div className="overflow-x-auto border border-gray-100 rounded-2xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50">
                  <th className="px-6 py-4 border-b border-gray-100">Client</th>
                  <th className="px-6 py-4 border-b border-gray-100">Date</th>
                  <th className="px-6 py-4 border-b border-gray-100">Time</th>
                  <th className="px-6 py-4 border-b border-gray-100">Type</th>
                  <th className="px-6 py-4 border-b border-gray-100">Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {completedSessions.length > 0 ? completedSessions.map((appt: any) => {
                  const client = data.clients.find((c: any) => c.id === appt.clientId);
                  return (
                    <tr key={appt.id} className="text-sm hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{client?.name || '---'}</td>
                      <td className="px-6 py-4 text-gray-600">{appt.date}</td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-xs">{appt.startTime}</td>
                      <td className="px-6 py-4 text-gray-600">{appt.type}</td>
                      <td className="px-6 py-4 text-gray-600">{appt.mode}</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No session data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-gray-100">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Documentation Integrity</h3>
            <div className="flex items-center gap-8 p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-24 h-24 rounded-full border-[10px] border-indigo-600 border-t-indigo-100 flex items-center justify-center relative flex-shrink-0 bg-white">
                <span className="text-2xl font-black text-gray-900">85%</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <span className="text-xs font-bold text-gray-700">Finalized Notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-100 rounded-full"></div>
                  <span className="text-xs font-bold text-gray-400">Pending Drafts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Utilization</h3>
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <span>Retention Index</span>
                  <span className="text-emerald-600">92%</span>
                </div>
                <div className="h-2.5 bg-white rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full bg-emerald-500 w-[92%]"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <span>Capacity</span>
                  <span className="text-indigo-600">65%</span>
                </div>
                <div className="h-2.5 bg-white rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full bg-indigo-500 w-[65%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;