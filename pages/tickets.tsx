import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";
const TABS = ['Todos', 'En Proceso', 'En Espera', 'Cerrados'];

type Ticket = {
  id: string; cliente: string; contacto: string; planta: string;
  ciudad: string; issue: string; descripcion: string; parte: string;
  lote: string; qty: string; oc: string; estado: string;
  asignado: string; fecha: string; semana: string; tarifa: string;
};

const estadoColor = (estado: string) => {
  if (estado === 'En Proceso') return { ec: '#10B981', eb: '#ECFDF5' };
  if (estado === 'En Espera')  return { ec: '#EF4444', eb: '#FEF2F2' };
  return { ec: '#6B7280', eb: '#F9FAFB' };
};

export default function Tickets() {
  con  con  con  con  conr();
  const [activeTab, setActiveTab] = useState('Todos');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected,  const [selected,  const [selected,  >(null);
  const [loading, setLoading] = useState(true);
  const [show  const [show  const [show  const [show  const [show  const [show  const seState('');
  const [ocError, setOcError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tickets'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Ticket));
      setTicke      setTicke      setTicke      setrev ? data.find(t => t.id === prev.id) || data[0] : data[0]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = tickets.filter(t => activeTab === 'Todos' ? true : t.e  const filtered = tickets.filter(t => activeTab === 'Todos' ? true :if   const filtered = tickets.filter(t => ael nume  const filtered = tickets.filter(ected) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'tickets', selected.id), { oc: ocInput.trim(), estado: 'En Proceso' });
      setShowModal(false); setOcInput(''); setOcError('');
    } catch (e) { setOcError('Error al guardar.'); }
    setSaving(false);
  };

  if (loading) return <Layout title="Tickets"><div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Cargando...</div></Layout>;

  return (
    <Layout title="Tickets de Servicio">
      <div style={{ display: 'flex', justifyConten      <div style={{ display: 'flex', justifyConten      <div style={{ d    <di      <div style={{ display: 'flex', justifyConten      <div style={{ display: 'flex', justifyConten      <nk href="/tickets/nuevo"><button style={{ padding: '7px 14px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>+ Nuevo Ticket</button></Link>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', marginBottom: '16px' }}>
        {TABS.map(tab => {
          const count = tab === 'Todos' ? tickets.length : tickets.filter(t => t.estado === tab).length;
          const isActive = activeTab === tab;
          return <div key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '9px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: isActive ? 'var(--gray-900)' : 'var(--gray-500)', borderBottom: isActive ? '2px solid var(--gray-900)' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap' }}>{tab} {count > 0 && <span style={{ fontSize: '11px' }}>({count})</span>}</div>;
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }}>
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                {['Ticket','Cliente','Issue','Parte','OC','Estado','Asignado'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const isSelected = selected?.id === t.id;
                const { ec, eb } = estadoColor(t.estado);
                return <tr key={t.id} onClick={() => setSelected(t)} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--gray-100)' : 'none', cursor: 'pointer', background: isSelected ? '#EFF6FF' : 'transparent' }} onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--gray-50)'; }} onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '12.5px', fontWeight: 600, color: 'var(--gray-900)' }}>{t.id}</td>
                  <td style={{ padding: '13px 14px' }}><div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-800)' }}>{t.cliente}</div><div style={{ fontSize: '11.5px', color: 'var(--gray-400)' }}          }</div></t                  <  <td style={{ padding: '13px 14px', fontSize: '13px', color:                   <td style={{ padding: '13px 14px' }}><,                   <td style={{ padding: '13px 14px' }}><ue}</td>
                  <td style={{ padding: '13px 14px', fontSize: '12px', fontFamily: MONO, color: 'var(--gray-500)' }}>{t.parte}</td>
                  <td style={{ padding: '13px 14px', fontSize: '12px', fontFamily: MONO, fontWeight: 500, color: t.oc ? 'var(--gray-900)' : 'var(--gray-300)' }}>{t.oc || '—'}</td>
                  <td style={{ padding: '13px 14px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px',                   <td style={{ padding: '13px 14px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px',              ht: '5px', borderRadius: '50%', background: ec, display: 'inline-block' }} />{t.estado}</span></td>
                  <td style={{ padding: '13px 14px', fontSize: '12.5px', color: 'var(--gray-500)' }}>{t.asignado}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
        {selected && (() => {
          const { ec, eb } = estadoColor(selected.estado);
          return <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                                                                                                                                                                                                                                                                                                                                     erRadius: '20px', fontSize: '11px', fontWeight: 500, background: eb, color: ec, flexShrink: 0, marginLeft: '8px' }}><span                     ',     ht: '5px', borderRadius: '50%', background: ec, displ            block' }} />{selected.estado}</span>
            </div>
            {selected.estado === 'En Espera' && <div style={{ margin: '14px 18px 0', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px' }}><div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', marginBottom: '3px' }}>OC PENDIENTE</div><div style={{ fontSize: '12px', color: '#7F1D1D' }}>Proyecto bloqueado hasta registrar OC.<            {selected.estado === 'En Espera' && <div style={{ margin: '14px 18px 0', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px' }}><div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', marginBottom: '3px' }}>OC PENDIENTE</div><div style={{ fontSize: '12px', color: '#7F1D1D' }}>Proyecto bloqueado hasta registrar OC.<            {selected.estado === 'En Espera' && <div style={{ margin: '14px 18px 0', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px' }}><div style={{ fontSize: '11px', fontWeight: 600, color: '#9x', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--gray-50)' }}><span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>{f.label}</span><span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-800)', fontFamily: f.mono ? MONO : 'inherit' }}>{f.value}</span></div>)}
              <div style={{ marginTop: '4px', marginBottom: '14px' }}><div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '6px' }}>Descripcion</div><div style={{ fontSize: '12.5px', color: 'var(--gray-700)', lineHeight: 1.55 }}>{selected.descripcion}</div></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => selected.estado === 'En Espera' ? setShowModal(true) : router.push('/inspecciones?proyecto=' + selected.id)} style={{ flex: 1, padding: '8px', background: '#F97316', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>{selected.estado === 'En Espera' ? 'Registrar OC' : 'Ver Inspecciones'}</button>
                <button style={{ padding: '8px 12px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '12.5px', color: 'var(--gray-600)', cursor: 'pointer' }}>Notas</button>
              </div>
            </div>
          </div>;
        })()}
      </div>
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
        <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '28px', width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Registrar OC</div>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '20px' }}>Ticket {selected?.id} — {selected?.cliente}</div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '5px' }}>Numero de OC *</label>
          <input value={ocInput} onChange={e => { setOcInput(e.target.value); setOcError(''); }} placeholder="PO-31764" autoFocus onKeyDown={e => { if (e.key === 'Enter') handleRegistrarOC(); }} style={{ width: '100%', padding: '9px 12px', border: ocError ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: MONO }} />
          {ocError && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '3px' }}>{ocError}</div>}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            <button onClick={() => { setShowModal(false); setOcInput(''); }} style={{ flex: 1, padding: '9px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '7px', cursor: 'pointer' }}>Cancelar</button>
            <button onClick={handleRegistrarOC} disabled={saving} style={{ flex: 1, padding: '9px', background: saving ? '#9CA3AF' : '#F97316', color: 'white', border: 'none', borderRadius: '7px', fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Guardando...' : 'Registrar OC'}</button>
          </div>
        </div>
      </div>}
    </Layout>
  );
}
