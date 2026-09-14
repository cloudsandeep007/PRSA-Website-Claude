import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Image,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export default function Dashboard({ authToken, isSuperAdmin }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    if (authToken) fetchDashboard();
  }, [authToken]);

  if (loading) {
    return <div className="text-primary text-sm p-4">Loading Admin Dashboard metrics...</div>;
  }

  if (!data) return <div className="text-red-400 p-4">Failed to load dashboard.</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 text-primary-container text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>PRSA MAINTENANCE HUB</span>
          </div>
          <h2 className="text-2xl font-bold text-primary">Academy Operations Overview</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage programs, coaches, events, trial bookings, and website content in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/trial-bookings"
            className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-bold text-xs shadow-md hover:shadow-cyan-500/40 transition-all flex items-center gap-1.5"
          >
            <span>View Leads ({data.newBookings} New)</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className={`grid grid-cols-2 ${isSuperAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4`}>
        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/20 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">TOTAL TRIAL BOOKINGS</span>
            <Users className="w-5 h-5 text-primary-container" />
          </div>
          <div className="text-3xl font-bold text-primary">{data.totalBookings}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">{data.newBookings} Pending Review</div>
        </div>

        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">CONTACT ENQUIRIES</span>
            <MessageSquare className="w-5 h-5 text-secondary" />
          </div>
          <div className="text-3xl font-bold text-secondary">{data.totalEnquiries}</div>
          <div className="text-[11px] text-secondary font-semibold">{data.newEnquiries} Unread</div>
        </div>

        {isSuperAdmin && (
          <>
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant">ACTIVE PROGRAMS</span>
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">{data.totalPrograms}</div>
              <div className="text-[11px] text-outline">Published Disciplines</div>
            </div>

            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant">MEDIA GALLERY</span>
                <Image className="w-5 h-5 text-primary-container" />
              </div>
              <div className="text-3xl font-bold text-primary-container">{data.totalGallery}</div>
              <div className="text-[11px] text-outline">Photos & Videos</div>
            </div>
          </>
        )}
      </div>

      {/* Main Grid: Recent Bookings & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Trial Bookings */}
        <div className={`${isSuperAdmin ? 'lg:col-span-7' : 'lg:col-span-12'} bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-4`}>
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <h3 className="text-base font-bold text-primary">Recent Free Trial Requests</h3>
            <Link to="/admin/trial-bookings" className="text-xs text-primary-container hover:underline font-semibold">
              View All
            </Link>
          </div>

          {(data.recentBookings || []).length === 0 ? (
            <div className="text-xs text-outline py-4">No trial bookings submitted yet.</div>
          ) : (
            <div className="space-y-3">
              {data.recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-primary block">{b.athlete_name} (Age {b.age})</span>
                    <span className="text-on-surface-variant block">{b.discipline} • {b.parent_phone}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    b.status === 'New' ? 'bg-primary-container/20 text-primary-container' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Audit Log — Super Admin only */}
        {isSuperAdmin && (
          <div className="lg:col-span-5 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-container" />
                <h3 className="text-base font-bold text-primary">Recent System Activity</h3>
              </div>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {(data.recentLogs || []).map((log) => (
                <div key={log.id} className="text-xs space-y-0.5 border-b border-outline-variant/10 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface">{log.action}</span>
                    <span className="text-[10px] text-outline">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
