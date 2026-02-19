import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const TABS = ['Todos', 'En Proceso', 'En Espera', 'Cerrados'];

interface Ticket {
  id: string;
  cliente: string;
  contacto: string;
  planta: string;
  ciudad: string;
  issue: string;
  descripcion: string;
  parte: string;
  lote: string;
  qty: string;
  oc: string;
  estado: string;
  ec: string;
  eb: string;
  asignado: string;
  fecha: string;
  semana: string;
}

export default function Tickets() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Todos');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tickets'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Ticket));
      setTickets(data);
      setSelected(prev => prev ? data.find(t => t.id === prev.id) || data[0] : data[0]);
    });
    return () => unsub();
  }, []);

  const filtered = tickets.filter(t => {
    if (activeTab === 'Todos') return true;
    return t.estado === activeTab;
  });

  const handleRegistrarOC = async (ocValue: string) => {
    if (selected && ocValue.trim()) {
      try {
        await updateDoc(doc(db, 'tickets', selected.id), { oc: ocValue.trim(), estado: 'En Proceso' });
        setShowModal(false);
      } catch (err) {
        console.error('Error registrando OC:', err);
      }
    }
  };

  return (
    <Layout title="Tickets de Servicio">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
          {tickets.length} tickets activos
        </div>
        <button style={{ padding: '7px 14px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
          + Nuevo Ticket
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', marginBottom: '16px' }}>
        {TABS.map(tab => {
          const count = tab === 'Todos' ? tickets.length : tickets.filter(t => t.estado === tab).length;
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
                <button onClick={() => selected.estado === 'En Espera' ? setShowModal(true) : router.push('/inspecciones?proyecto=' + selected.id)} style={{ flex: 1, padding: '8px', background: '#F97316', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
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

      {/* Modal Registrar OC */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '90%', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-900)' }}>Registrar OC</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--gray-400)' }}>✕</button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--gray-700)', marginBottom: '16px' }}>
                Ingresa el número de OC para desbloquear este proyecto.
              </div>
              <input type="text" placeholder="Ej: PO-31764" style={{ width: '100%', padding: '10px', border: '1px solid var(--gray-300)', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }} id="ocInput" />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '8px', background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: 'var(--gray-600)' }}>
                  Cancelar
                </button>
                <button onClick={() => {
                  const ocValue = (document.getElementById('ocInput') as HTMLInputElement).value;
                  handleRegistrarOC(ocValue);
                }} style={{ flex: 1, padding: '8px', background: '#F97316', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
