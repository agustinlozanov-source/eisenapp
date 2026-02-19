import Layout from '@/components/layout/Layout';
import { useState } from 'react';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const TICKETS_DATA = [
  {
    id: 'EM26-01',
    cliente: 'Eurospec Mfg.',
    contacto: 'James Whitfield',
    planta: 'Fisher Dynamics',
    ciudad: 'Newmarket, ON',
    issue: 'Missing Tabs — Mal Troquelado',
    descripcion: 'Piezas con tabs faltantes detectadas en línea de producción. Cliente requiere inspección 100% del lote en planta.',
    parte: '195364',
    lote: '02226',
    qty: '9,720',
    oc: '',
    estado: 'En Proceso',
    ec: '#10B981',
    eb: '#ECFDF5',
    asignado: 'A. Serrano',
    fecha: '2026-02-10',
    semana: 'Sem 07',
  },
  {
    id: 'RD26-01',
    cliente: 'Ranger Die Inc.',
    contacto: 'Bob Ranger',
    planta: 'Adient',
    ciudad: 'Matamoros, MX',
    issue: 'Metal Split — Bkt Reinforcement',
    descripcion: 'Metal split encontrado en bracket de refuerzo. Lote completo en warehouse pendiente de disposición. OC requerida para continuar.',
    parte: '3232903',
    lote: '32825',
    qty: '6,290',
    oc: 'PO-31764',
    estado: 'En Espera',
    ec: '#EF4444',
    eb: '#FEF2F2',
    asignado: 'O. Pech',
    fecha: '2026-02-12',
    semana: 'Sem 07',
  },
];

const TABS = ['Todos', 'En Proceso', 'En Espera', 'Cerrados'];

type Ticket = typeof TICKETS_DATA[0];

export default function Tickets() {
  const [activeTab, setActiveTab] = useState('Todos');
  const [tickets, setTickets] = useState(TICKETS_DATA);
  const [selected, setSelected] = useState<Ticket>(TICKETS_DATA[1]);
  const [showModal, setShowModal] = useState(false);
  const [ocInput, setOcInput] = useState('');
  const [ocError, setOcError] = useState('');

  const handleRegistrarOC = () => {
    if (!ocInput.trim()) { setOcError('Ingresa el numero de OC'); return; }
    const updated = tickets.map(t =>
      t.id === selected.id ? { ...t, oc: ocInput.trim(), estado: 'En Proceso', ec: '#10B981', eb: '#ECFDF5' } : t
    );
    setTickets(updated);
    setSelected(updated.find(t => t.id === selected.id)!);
    setShowModal(false); setOcInput(''); setOcError('');
  };

  const filtered = tickets.filter(t => {
    if (activeTab === 'Todos') return true;
    return t.estado === activeTab;
  });

  return (
    <Layout title="Tickets de Servicio">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
          {TICKETS_DATA.length} tickets activos
        </div>
        <button style={{ padding: '7px 14px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
          + Nuevo Ticket
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', marginBottom: '16px' }}>
        {TABS.map(tab => {
          const count = tab === 'Todos' ? TICKETS_DATA.length : TICKETS_DATA.filter(t => t.estado === tab).length;
          const isActive = activeTab === tab;
          return (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '9px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              color: isActive ? 'var(--gray-900)' : 'var(--gray-500)',
              borderBottom: isActive ? '2px solid var(--gray-900)' : '2px solid transparent',
              marginBottom: '-1px', whiteSpace: 'nowrap',
            }}>
              {tab} {count > 0 && <span style={{ fontSize: '11px', color: isActive ? 'var(--gray-600)' : 'var(--gray-400)' }}>({count})</span>}
            </div>
          );
        })}
      </div>

      {/* 2 columns: list + detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }}>

        {/* LIST */}
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                {['Ticket','Cliente','Issue','Parte','OC','Estado','Asignado'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const isSelected = selected?.id === t.id;
                return (
                  <tr key={t.id}
                    onClick={() => setSelected(t)}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--gray-100)' : 'none',
                      cursor: 'pointer',
                      background: isSelected ? '#EFF6FF' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--gray-50)'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '12.5px', fontWeight: 600, color: 'var(--gray-900)' }}>{t.id}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-800)' }}>{t.cliente}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--gray-400)' }}>{t.planta}</div>
                    </td>
                    <td style={{ padding: '13px 14px', fontSize: '13px', color: 'var(--gray-700)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.issue}</td>
                    <td style={{ padding: '13px 14px', fontSize: '12px', fontFamily: MONO, color: 'var(--gray-500)' }}>{t.parte}</td>
                    <td style={{ padding: '13px 14px', fontSize: '12px', fontFamily: MONO, fontWeight: 500, color: t.oc ? 'var(--gray-900)' : 'var(--gray-300)' }}>{t.oc || '—'}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 500, background: t.eb, color: t.ec }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: t.ec, display: 'inline-block' }} />
                        {t.estado}
                      </span>
                    </td>
                    <td style={{ padding: '13px 14px', fontSize: '12.5px', color: 'var(--gray-500)' }}>{t.asignado}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* DETAIL PANEL */}
        {selected && (
          <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: '11px', color: 'var(--gray-400)', marginBottom: '2px' }}>{selected.id}</div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.3 }}>{selected.issue}</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: selected.eb, color: selected.ec, flexShrink: 0, marginLeft: '8px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: selected.ec, display: 'inline-block' }} />
                {selected.estado}
              </span>
            </div>

            {selected.estado === 'En Espera' && (
              <div style={{ margin: '14px 18px 0', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', marginBottom: '3px' }}>⏱ OC VENCIDA — 72h</div>
                <div style={{ fontSize: '12px', color: '#7F1D1D' }}>Proyecto bloqueado hasta registrar OC.</div>
              </div>
            )}

            <div style={{ padding: '14px 18px' }}>
              {[
                { label: 'Cliente',  value: selected.cliente },
                { label: 'Contacto', value: selected.contacto },
                { label: 'Planta',   value: `${selected.planta} — ${selected.ciudad}` },
                { label: 'Parte',    value: selected.parte, mono: true },
                { label: 'Lote',     value: selected.lote, mono: true },
                { label: 'Cantidad', value: `${selected.qty} pzas` },
                { label: 'OC',       value: selected.oc || 'Pendiente', mono: true },
                { label: 'Semana',   value: selected.semana },
                { label: 'Asignado', value: selected.asignado },
                { label: 'Fecha',    value: selected.fecha, mono: true },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--gray-50)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>{f.label}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-800)', fontFamily: f.mono ? MONO : 'inherit', textAlign: 'right', maxWidth: '180px' }}>{f.value}</span>
                </div>
              ))}

              <div style={{ marginTop: '4px', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '6px' }}>Descripción</div>
                <div style={{ fontSize: '12.5px', color: 'var(--gray-700)', lineHeight: 1.55 }}>{selected.descripcion}</div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { if (selected.estado === 'En Espera') setShowModal(true); }} style={{ flex: 1, padding: '8px', background: '#F97316', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                  {selected.estado === 'En Espera' ? 'Registrar OC' : 'Ver Inspecciones'}
                </button>
                <button style={{ padding: '8px 12px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '12.5px', color: 'var(--gray-600)', cursor: 'pointer' }}>
                  Notas
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '28px', width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Registrar OC</div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>{selected?.id} - {selected?.cliente}</div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '5px' }}>Numero de OC *</label>
            <input value={ocInput} onChange={e => { setOcInput(e.target.value); setOcError(''); }} placeholder='PO-31764' autoFocus onKeyDown={e => { if (e.key === 'Enter') handleRegistrarOC(); }} style={{ width: '100%', padding: '9px 12px', border: ocError ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            {ocError && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px' }}>{ocError}</div>}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button onClick={() => { setShowModal(false); setOcInput(''); }} style={{ flex: 1, padding: '9px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '7px', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleRegistrarOC} style={{ flex: 1, padding: '9px', background: '#F97316', color: 'white', border: 'none', borderRadius: '7px', fontWeight: 600, cursor: 'pointer' }}>Registrar OC</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
