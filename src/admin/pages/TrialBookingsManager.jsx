import React, { useEffect, useState } from 'react';
import { Search, Filter, Trash2, CheckCircle, Clock, AlertCircle, Save, Phone, Mail } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

export default function TrialBookingsManager({ authToken }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  async function fetchBookings() {
    setLoading(true);
    try {
      let url = '/api/admin/trial-bookings?';
      if (statusFilter) url += `status=${encodeURIComponent(statusFilter)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setBookings(json);
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, [authToken, statusFilter, search]);

  const handleStatusChange = async (id, newStatus, currentNotes) => {
    try {
      const res = await fetch(`/api/admin/trial-bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus, notes: currentNotes })
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleSaveNotes = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/trial-bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: currentStatus, notes: notesText })
      });
      if (res.ok) {
        setEditingNotesId(null);
        fetchBookings();
      }
    } catch (err) {
      console.error('Save notes error:', err);
    }
  };

  const confirmDelete = async () => {
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      const res = await fetch(`/api/admin/trial-bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
        <div>
          <h2 className="text-xl font-bold text-primary">Trial Bookings Lead Manager</h2>
          <p className="text-xs text-on-surface-variant">View and process all Free Trial Class requests submitted by parents & athletes</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-high text-xs text-on-surface pl-9 pr-3 py-2 rounded-xl border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container-high text-xs text-on-surface px-3 py-2 rounded-xl border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary-container"
          >
            <option value="">All Statuses</option>
            <option value="New">New Only</option>
            <option value="Contacted">Contacted</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-outline">Loading trial booking entries...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-outline">No trial bookings found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-high text-on-surface-variant uppercase font-label-uppercase text-[10px] border-b border-outline-variant/30">
                <tr>
                  <th className="p-4">Athlete & Age</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Discipline & Location</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Admin Notes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container/60 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-primary block text-sm">{b.athlete_name}</span>
                      <span className="text-[11px] text-on-surface-variant block">Age: {b.age} yrs</span>
                      <span className="text-[10px] text-outline block">{new Date(b.created_at).toLocaleDateString()}</span>
                    </td>

                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-on-surface font-semibold">
                        <Phone className="w-3.5 h-3.5 text-primary-container shrink-0" />
                        <a href={`tel:${b.parent_phone}`} className="hover:underline">{b.parent_phone}</a>
                      </div>
                      <div className="flex items-center gap-1.5 text-outline">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <a href={`mailto:${b.email}`} className="hover:underline">{b.email}</a>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-secondary block">{b.discipline}</span>
                      <span className="text-outline text-[11px] block">{b.location}</span>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface text-[10px] font-bold">
                        {b.experience}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value, b.notes)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer ${
                          b.status === 'New' ? 'bg-primary-container/20 text-primary-container border-primary-container/40' :
                          b.status === 'Contacted' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                          b.status === 'Completed' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                          'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}
                      >
                        <option value="New">● New</option>
                        <option value="Contacted">● Contacted</option>
                        <option value="Confirmed">● Confirmed</option>
                        <option value="Completed">● Completed</option>
                        <option value="Cancelled">● Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 max-w-xs">
                      {editingNotesId === b.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            className="bg-surface-container-high text-xs px-2 py-1 rounded border border-primary-container w-full"
                          />
                          <button
                            onClick={() => handleSaveNotes(b.id, b.status)}
                            className="p-1 rounded bg-primary-container text-on-primary-container"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => { setEditingNotesId(b.id); setNotesText(b.notes || ''); }}
                          className="cursor-pointer text-[11px] text-on-surface-variant hover:text-primary italic truncate border-b border-dashed border-outline-variant/40 pb-0.5"
                        >
                          {b.notes || '+ Add note...'}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setPendingDeleteId(b.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pendingDeleteId !== null && (
        <ConfirmDialog
          title="Delete this trial booking?"
          message="This can't be undone."
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
