import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

// Tailwind's scanner needs full literal class names, so the two size
// variants are spelled out rather than built with template strings.
function CardActions({ onEdit, onDelete, compact }) {
  if (compact) {
    return (
      <div className="flex items-center justify-end gap-1 pt-1 border-t border-outline-variant/20">
        <button onClick={onEdit} className="p-1 rounded bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary">
          <Edit3 className="w-3 h-3" />
        </button>
        <button onClick={onDelete} className="p-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
      <button onClick={onEdit} className="p-1.5 rounded bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary">
        <Edit3 className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ProgramCard(p, actions) {
  return (
    <div key={p.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">{p.name}</span>
          <span className="text-[10px] text-primary-container font-bold">{p.age_group}</span>
        </div>
        <p className="text-xs text-on-surface-variant line-clamp-2">{p.short_desc}</p>
      </div>
      <CardActions {...actions} />
    </div>
  );
}

export function CoachCard(c, actions) {
  return (
    <div key={c.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <img src={c.photo_url} alt={c.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary-container" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Coach'; }} />
          <div>
            <div className="text-xs font-bold text-primary">{c.name}</div>
            <div className="text-[10px] text-on-surface-variant">{c.position}</div>
          </div>
        </div>
        <div className="text-[11px] text-emerald-400 font-semibold">{c.experience} • {c.specialization}</div>
        <p className="text-xs text-on-surface-variant line-clamp-2">{c.bio}</p>
      </div>
      <CardActions {...actions} />
    </div>
  );
}

export function EventCard(e, actions) {
  return (
    <div key={e.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">{e.title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-primary-container/20 text-primary-container font-bold">{e.registration_status}</span>
        </div>
        <div className="text-[11px] text-cyan-400 font-medium">{e.date_str} • {e.time_str} • {e.location}</div>
        <p className="text-xs text-on-surface-variant line-clamp-2">{e.description}</p>
      </div>
      <CardActions {...actions} />
    </div>
  );
}

export function AchievementCard(a, actions) {
  return (
    <div key={a.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400">{a.title}</span>
          <span className="text-[10px] text-on-surface-variant font-bold">{a.year}</span>
        </div>
        <div className="text-sm font-extrabold text-primary">{a.count_label}</div>
        <p className="text-xs text-on-surface-variant line-clamp-2">{a.description}</p>
      </div>
      <CardActions {...actions} />
    </div>
  );
}

export function GalleryCard(g, actions) {
  return (
    <div key={g.id} className="bg-surface-container-low p-2 rounded-xl border border-outline-variant/30 space-y-2">
      <img src={g.url} alt={g.title} className="w-full h-28 object-cover rounded-lg" onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=Gallery+Image'; }} />
      <div className="px-1">
        <div className="text-xs font-bold text-primary truncate">{g.title || 'Gallery Media'}</div>
        <div className="text-[10px] text-on-surface-variant">{g.category}</div>
      </div>
      <CardActions {...actions} compact />
    </div>
  );
}

export function TestimonialCard(t, actions) {
  return (
    <div key={t.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">{t.name}</span>
          <span className="text-[10px] text-amber-400 font-bold">★ {t.rating}/5</span>
        </div>
        <div className="text-[10px] text-on-surface-variant">{t.role_desc}</div>
        <p className="text-xs text-on-surface-variant italic line-clamp-3">"{t.quote}"</p>
      </div>
      <CardActions {...actions} />
    </div>
  );
}

export function LocationCard(loc, actions) {
  return (
    <div key={loc.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">{loc.name}</span>
          <span className="text-[10px] text-cyan-400 font-bold">{loc.tag_label}</span>
        </div>
        <div className="text-[11px] text-on-surface-variant">{loc.address}</div>
        <div className="text-[11px] text-emerald-400">{loc.schedule}</div>
      </div>
      <CardActions {...actions} />
    </div>
  );
}

export function FaqCard(faq, actions) {
  return (
    <div key={faq.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="text-xs font-bold text-primary">Q: {faq.question}</div>
        <div className="text-xs text-on-surface-variant">A: {faq.answer}</div>
      </div>
      <div className="shrink-0">
        <CardActions {...actions} />
      </div>
    </div>
  );
}
