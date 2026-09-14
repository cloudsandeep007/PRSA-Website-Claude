import React, { useEffect, useState } from 'react';
import { Mail, Phone, Trash2, CheckCircle, Clock } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ContactEnquiriesManager({ authToken }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  async function fetchEnquiries() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contact-enquiries', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setEnquiries(json);
      }
    } catch (err) {
      console.error('Fetch enquiries error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEnquiries();
  }, [authToken]);

  const handleStatus = async (id, status, notes) => {
    try {
      const res = await fetch(`/api/admin/contact-enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      const res = await fetch(`/api/admin/contact-enquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
        <h2 className="text-xl font-bold text-primary">Contact Enquiries Manager</h2>
        <p className="text-xs text-on-surface-variant">General messages and questions submitted through the website</p>
      </div>

      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-outline">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-outline">No contact enquiries received yet.</div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {enquiries.map((e) => (
              <div key={e.id} className="p-5 hover:bg-surface-container/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-sm">{e.name}</span>
                    <span className="text-outline text-[11px]">• {new Date(e.created_at).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      e.status === 'New' ? 'bg-primary-container/20 text-primary-container' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {e.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-on-surface-variant font-semibold">
                    <a href={`mailto:${e.email}`} className="hover:underline flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-primary-container" /> {e.email}
                    </a>
                    {e.phone && (
                      <a href={`tel:${e.phone}`} className="hover:underline flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-secondary" /> {e.phone}
                      </a>
                    )}
                  </div>

                  <p className="text-on-surface text-xs pt-1 leading-relaxed bg-surface-container-high/60 p-2.5 rounded-lg border border-outline-variant/20">
                    "{e.message}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleStatus(e.id, e.status === 'New' ? 'Read' : 'New', e.notes)}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container font-bold text-[11px] transition-colors"
                  >
                    Mark {e.status === 'New' ? 'Read' : 'Unread'}
                  </button>
                  <button
                    onClick={() => setPendingDeleteId(e.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingDeleteId !== null && (
        <ConfirmDialog
          title="Delete this enquiry?"
          message="This can't be undone."
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
