import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

interface Pago {
  id: string;
  factura: string;
  cliente: string;
  planta: string;
  proyecto: string;
  fecha: string;
  monto: string;
  metodo: string;
  referencia: string;
  estado: string;
  ec: string;
  eb: string;
  banco: string;
  notas: string;
  diasDesdeFecha: number;
};

const TABS = ['Todos', 'Confirmado', 'Pendiente', 'Vencido'];

export default function Pagos() {
  const [activeTab, setActiveTab] = useState('Todos');
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [selected, setSelected] = useState<Pago | null>(null);
  const [confirmarModal, setConfirmarModal] = useState(false);
  const [confirmarForm, setConfirmarForm] = useState({ referencia: '', banco: '', fechaConfirmacion: '2026-02-19' });
  const [recordatorioModal, setRecordatorioModal] = useState(false);
  const [recordatorioMsg, setRecordatorioMsg] = useState('');
  const [comprobantModal, setComprobantModal] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pagos'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Pago));
      setPagos(data);
      setSelected(prev => prev ? data.find(p => p.id === prev.id) || data[0] : data[0]);
    });
    return () => unsub();
  }, []);

  const filtered = pagos.filter(p =>
    activeTab === 'Todos' ? true : p.estado === activeTab
  );

  // Helper to safely convert monto to number
  const getMontoAsNumber = (monto: string | number): number => {
    if (typeof monto === 'number') return monto;
    return parseFloat(String(monto).replace(/[$,]/g, '')) || 0;
  };

  const totalCobrado = pagos
    .filter(p => p.estado === 'Confirmado')
    .reduce((acc, p) => acc + getMontoAsNumber(p.monto), 0);

  const totalPendiente = pagos
    .filter(p => p.estado === 'Pendiente')
    .reduce((acc, p) => acc + getMontoAsNumber(p.monto), 0);

  const totalVencido = pagos
    .filter(p => p.estado === 'Vencido')
    .reduce((acc, p) => acc + getMontoAsNumber(p.monto), 0);

  return (
    <Layout title="Pagos">

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Cobrado',   value: `$${totalCobrado.toLocaleString()}`,   color: '#10B981' },
          { label: 'Pendiente', value: `$${totalPendiente.toLocaleString()}`, color: '#D97706' },
          { label: 'Vencido',   value: `$${totalVencido.toLocaleString()}`,   color: '#EF4444' },
        ].map((k, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '16px 20px', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.color }} />
            <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--gray-500)', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: k.color, letterSpacing: '-0.5px', fontFamily: MONO }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', marginBottom: '16px' }}>
        {TABS.map(tab => {
          const count = tab === 'Todos' ? pagos.length : pagos.filter(p => p.estado === tab).length;
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

      {/* 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }}>

        {/* LIST */}
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                {['Pago','Factura','Cliente','Proyecto','Fecha','Monto','Método','Estado'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const isSelected = selected?.id === p.id;
                return (
                  <tr key={p.id}
                    onClick={() => setSelected(p)}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--gray-100)' : 'none',
                      cursor: 'pointer',
                      background: isSelected ? '#EFF6FF' : p.estado === 'Vencido' ? '#FFFBF0' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--gray-50)'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = p.estado === 'Vencido' ? '#FFFBF0' : 'transparent'; }}
                  >
                    <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '12px', fontWeight: 600, color: 'var(--gray-900)' }}>{p.id}</td>
                    <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '12px', color: 'var(--gray-600)' }}>{p.factura}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-800)' }}>{p.cliente}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--gray-400)' }}>{p.planta}</div>
                    </td>
                    <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '12px', color: 'var(--gray-600)' }}>{p.proyecto}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ fontFamily: MONO, fontSize: '12px', color: p.diasDesdeFecha < 0 ? '#DC2626' : 'var(--gray-600)', fontWeight: p.diasDesdeFecha < 0 ? 600 : 400 }}>{p.fecha}</div>
                      {p.estado === 'Vencido' && (
                        <div style={{ fontSize: '10.5px', color: '#DC2626', fontWeight: 500 }}>{Math.abs(p.diasDesdeFecha)} días vencido</div>
                      )}
                      {p.estado === 'Pendiente' && (
                        <div style={{ fontSize: '10.5px', color: 'var(--gray-400)' }}>{Math.abs(p.diasDesdeFecha)} días restantes</div>
                      )}
                    </td>
                    <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '13px', fontWeight: 700, color: 'var(--gray-900)' }}>{p.monto}</td>
                    <td style={{ padding: '13px 14px', fontSize: '12.5px', color: p.metodo ? 'var(--gray-700)' : 'var(--gray-300)' }}>{p.metodo || '—'}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 500, background: p.eb, color: p.ec }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: p.ec, display: 'inline-block' }} />
                        {p.estado}
                      </span>
                    </td>
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
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)' }}>{selected.cliente}</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: selected.eb, color: selected.ec, flexShrink: 0 }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: selected.ec, display: 'inline-block' }} />
                {selected.estado}
              </span>
            </div>

            {selected.estado === 'Vencido' && (
              <div style={{ margin: '14px 18px 0', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', marginBottom: '2px' }}>🔴 PAGO VENCIDO</div>
                <div style={{ fontSize: '12px', color: '#7F1D1D' }}>{Math.abs(selected.diasDesdeFecha)} días sin pago. Contactar cliente.</div>
              </div>
            )}

            <div style={{ padding: '14px 18px' }}>

              {/* Monto destacado */}
              <div style={{ background: 'var(--gray-50)', borderRadius: '10px', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--gray-400)', marginBottom: '6px' }}>Monto</div>
                <div style={{ fontFamily: MONO, fontSize: '32px', fontWeight: 700, color: selected.ec, letterSpacing: '-1px' }}>{selected.monto}</div>
              </div>

              {[
                { label: 'Factura',     value: selected.factura,    mono: true },
                { label: 'Proyecto',    value: selected.proyecto,   mono: true },
                { label: 'Planta',      value: selected.planta },
                { label: 'Fecha',       value: selected.fecha,      mono: true },
                { label: 'Método',      value: selected.metodo || 'Por definir' },
                { label: 'Referencia',  value: selected.referencia || '—', mono: true },
                { label: 'Banco',       value: selected.banco || '—' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--gray-50)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>{f.label}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-800)', fontFamily: f.mono ? MONO : 'inherit' }}>{f.value}</span>
                </div>
              ))}

              {selected.notas && (
                <div style={{ background: 'var(--gray-50)', borderRadius: '6px', padding: '10px 12px', marginBottom: '14px', marginTop: '4px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '4px' }}>Notas</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--gray-700)', lineHeight: 1.5 }}>{selected.notas}</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                {selected.estado === 'Confirmado' ? (
                  <button onClick={() => setComprobantModal(true)} style={{ flex: 1, padding: '8px', background: 'var(--gray-100)', color: 'var(--gray-600)', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                    Ver Comprobante
                  </button>
                ) : (
                  <button onClick={() => { setConfirmarForm({ referencia: '', banco: '', fechaConfirmacion: '2026-02-19' }); setConfirmarModal(true); }} style={{ flex: 1, padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                    Confirmar Pago
                  </button>
                )}
                {selected.estado === 'Vencido' && (
                  <button onClick={() => setRecordatorioModal(true)} style={{ flex: 1, padding: '8px', background: '#F97316', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                    Enviar Recordatorio
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Confirmar Pago */}
        {confirmarModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setConfirmarModal(false)}>
            <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-900)' }}>Confirmar Pago</div>
                <button onClick={() => setConfirmarModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--gray-400)' }}>✕</button>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '6px' }}>Referencia Bancaria</label>
                  <input type="text" value={confirmarForm.referencia} onChange={e => setConfirmarForm({ ...confirmarForm, referencia: e.target.value })} placeholder="Ej: WT-20260219-001" style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--gray-300)', borderRadius: '6px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '6px' }}>Banco</label>
                  <input type="text" value={confirmarForm.banco} onChange={e => setConfirmarForm({ ...confirmarForm, banco: e.target.value })} placeholder="Ej: BMO Harris Bank" style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--gray-300)', borderRadius: '6px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '6px' }}>Fecha Confirmación</label>
                  <input type="date" value={confirmarForm.fechaConfirmacion} onChange={e => setConfirmarForm({ ...confirmarForm, fechaConfirmacion: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--gray-300)', borderRadius: '6px', fontSize: '13px' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button onClick={() => setConfirmarModal(false)} style={{ flex: 1, padding: '8px', background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: 'var(--gray-600)' }}>
                    Cancelar
                  </button>
                  <button onClick={async () => {
                    if (selected) {
                      const { referencia, banco, fechaConfirmacion } = confirmarForm;
                      await updateDoc(doc(db, 'pagos', selected.id), { estado: 'Confirmado', referencia, banco, fechaConfirmacion });
                      setConfirmarModal(false);
                      setConfirmarForm({ referencia: '', banco: '', fechaConfirmacion: '2026-02-19' });
                    }
                  }} style={{ flex: 1, padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Enviar Recordatorio */}
        {recordatorioModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setRecordatorioModal(false)}>
            <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '90%', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-900)' }}>Enviar Recordatorio</div>
                <button onClick={() => setRecordatorioModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--gray-400)' }}>✕</button>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: '13px', color: 'var(--gray-700)', marginBottom: '20px', textAlign: 'center' }}>
                  ¿Enviar recordatorio de pago a <span style={{ fontWeight: 600 }}>{selected.cliente}</span>?
                </div>
                {recordatorioMsg && (
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px', color: '#065F46', fontSize: '12.5px', textAlign: 'center' }}>
                    {recordatorioMsg}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setRecordatorioModal(false)} style={{ flex: 1, padding: '8px', background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: 'var(--gray-600)' }}>
                    Cancelar
                  </button>
                  <button onClick={() => {
                    setRecordatorioMsg('Recordatorio enviado');
                    setTimeout(() => {
                      setRecordatorioModal(false);
                      setRecordatorioMsg('');
                    }, 3000);
                  }} style={{ flex: 1, padding: '8px', background: '#F97316', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ver Comprobante */}
        {comprobantModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setComprobantModal(false)}>
            <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-900)' }}>Comprobante de Pago</div>
                <button onClick={() => setComprobantModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--gray-400)' }}>✕</button>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: '4px' }}>Referencia</div>
                    <div style={{ fontSize: '13px', fontFamily: MONO, color: 'var(--gray-800)', fontWeight: 500 }}>{selected.referencia || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: '4px' }}>Banco</div>
                    <div style={{ fontSize: '13px', color: 'var(--gray-800)', fontWeight: 500 }}>{selected.banco || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: '4px' }}>Fecha</div>
                    <div style={{ fontSize: '13px', fontFamily: MONO, color: 'var(--gray-800)' }}>{selected.fecha}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: '4px' }}>Monto</div>
                    <div style={{ fontSize: '16px', fontFamily: MONO, fontWeight: 700, color: '#059669' }}>{selected.monto}</div>
                  </div>
                </div>
                <button onClick={() => setComprobantModal(false)} style={{ width: '100%', marginTop: '16px', padding: '8px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
