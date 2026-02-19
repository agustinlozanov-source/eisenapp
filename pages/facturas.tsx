import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

interface Factura {
  id: string;
  cliente: string;
  planta: string;
  proyecto: string;
  semana: string;
  fechaEmision: string;
  fechaVencimiento: string;
  diasVencimiento: number;
  horas: number;
  tarifa: string;
  subtotal: string;
  total: string;
  estado: string;
  ec: string;
  eb: string;
  oc: string;
  notas: string;
  pagos: { fecha: string; monto: string; metodo: string }[];
};

const TABS = ['Todas', 'Enviada', 'Vencida', 'Pagada'];

export default function Facturas() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Todas');
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [selected, setSelected] = useState<Factura | null>(null);
  const [pagoModal, setPagoModal] = useState(false);
  const [pagoForm, setPagoForm] = useState({ fecha: '2026-02-19', monto: '', metodo: 'Wire Transfer', referencia: '' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'facturas'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Factura));
      setFacturas(data);
      setSelected(prev => prev ? data.find(f => f.id === prev.id) || data[0] : data[0]);
    });
    return () => unsub();
  }, []);

  const filtered = facturas.filter(f =>
    activeTab === 'Todas' ? true : f.estado === activeTab
  );

  // Helper to safely convert total to number
  const getTotalAsNumber = (total: string | number): number => {
    if (typeof total === 'number') return total;
    return parseFloat(String(total).replace(/[$,]/g, '')) || 0;
  };

  const totalAR = facturas
    .filter(f => f.estado !== 'Pagada')
    .reduce((acc, f) => acc + getTotalAsNumber(f.total), 0);

  const totalVencido = facturas
    .filter(f => f.estado === 'Vencida')
    .reduce((acc, f) => acc + getTotalAsNumber(f.total), 0);

  return (
    <Layout title="Facturas">

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <Link href="/facturas/nueva"><button style={{ padding: "7px 14px", background: "var(--gray-900)", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>+ Nueva Factura</button></Link>
      </div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'AR Total',     value: `$${totalAR.toLocaleString()}`,     color: '#3B82F6' },
          { label: 'Vencido',      value: `$${totalVencido.toLocaleString()}`, color: '#EF4444' },
          { label: 'Facturas',     value: facturas.length.toString(),          color: '#6B7280' },
          { label: 'Pagadas',      value: facturas.filter(f => f.estado === 'Pagada').length.toString(), color: '#10B981' },
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
          const count = tab === 'Todas' ? facturas.length : facturas.filter(f => f.estado === tab).length;
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
                {['Factura','Cliente','Proyecto','Emisión','Vencimiento','Total','Estado'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => {
                const isSelected = selected?.id === f.id;
                return (
                  <tr key={f.id}
                    onClick={() => setSelected(f)}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--gray-100)' : 'none',
                      cursor: 'pointer',
                      background: isSelected ? '#EFF6FF' : f.estado === 'Vencida' ? '#FFFBF0' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--gray-50)'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = f.estado === 'Vencida' ? '#FFFBF0' : 'transparent'; }}
                  >
                    <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '12px', fontWeight: 600, color: 'var(--gray-900)' }}>{f.id}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-800)' }}>{f.cliente}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--gray-400)' }}>{f.planta}</div>
                    </td>
                    <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '12px', color: 'var(--gray-600)' }}>{f.proyecto}</td>
                    <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '12px', color: 'var(--gray-600)' }}>{f.fechaEmision}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ fontFamily: MONO, fontSize: '12px', color: f.diasVencimiento < 0 ? '#DC2626' : 'var(--gray-600)', fontWeight: f.diasVencimiento < 0 ? 600 : 400 }}>
                        {f.fechaVencimiento}
                      </div>
                      {f.diasVencimiento < 0 && (
                        <div style={{ fontSize: '10.5px', color: '#DC2626', fontWeight: 500 }}>{Math.abs(f.diasVencimiento)} días vencida</div>
                      )}
                      {f.diasVencimiento > 0 && (
                        <div style={{ fontSize: '10.5px', color: 'var(--gray-400)' }}>{f.diasVencimiento} días restantes</div>
                      )}
                    </td>
                    <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '13px', fontWeight: 700, color: 'var(--gray-900)' }}>{f.total}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 500, background: f.eb, color: f.ec }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: f.ec, display: 'inline-block' }} />
                        {f.estado}
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

            {selected.estado === 'Vencida' && (
              <div style={{ margin: '14px 18px 0', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', marginBottom: '2px' }}>🔴 FACTURA VENCIDA</div>
                <div style={{ fontSize: '12px', color: '#7F1D1D' }}>{Math.abs(selected.diasVencimiento)} días sin pago. Requiere seguimiento.</div>
              </div>
            )}

            <div style={{ padding: '14px 18px' }}>
              {[
                { label: 'Planta',      value: selected.planta },
                { label: 'Proyecto',    value: selected.proyecto, mono: true },
                { label: 'Semana',      value: selected.semana },
                { label: 'OC',          value: selected.oc, mono: true },
                { label: 'Emisión',     value: selected.fechaEmision, mono: true },
                { label: 'Vencimiento', value: selected.fechaVencimiento, mono: true },
                { label: 'Horas',       value: `${selected.horas} hrs` },
                { label: 'Tarifa',      value: selected.tarifa, mono: true },
                { label: 'Total',       value: selected.total, mono: true },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--gray-50)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>{f.label}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: f.label === 'Total' ? 700 : 500, color: 'var(--gray-800)', fontFamily: f.mono ? MONO : 'inherit' }}>{f.value}</span>
                </div>
              ))}

              {/* Pagos */}
              {selected.pagos.length > 0 && (
                <div style={{ marginTop: '8px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '8px' }}>Pagos Recibidos</div>
                  {selected.pagos.map((p, i) => (
                    <div key={i} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#065F46' }}>{p.metodo}</div>
                          <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: MONO }}>{p.fecha}</div>
                        </div>
                        <div style={{ fontFamily: MONO, fontSize: '14px', fontWeight: 700, color: '#059669' }}>{p.monto}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notas */}
              {selected.notas && (
                <div style={{ background: 'var(--gray-50)', borderRadius: '6px', padding: '10px 12px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '4px' }}>Notas</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--gray-700)' }}>{selected.notas}</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                {selected.estado !== 'Pagada' && (
                  <button onClick={() => { const monto = String(getTotalAsNumber(selected.total)); setPagoForm({ fecha: '2026-02-19', monto, metodo: 'Wire Transfer', referencia: '' }); setPagoModal(true); }} style={{ flex: 1, padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                    Registrar Pago
                  </button>
                )}
                <button style={{ flex: 1, padding: '8px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '12.5px', color: 'var(--gray-600)', cursor: 'pointer' }}>
                  Ver PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Registrar Pago */}
        {pagoModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setPagoModal(false)}>
            <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-900)' }}>Registrar Pago</div>
                <button onClick={() => setPagoModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--gray-400)' }}>✕</button>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '6px' }}>Fecha</label>
                  <input type="date" value={pagoForm.fecha} onChange={e => setPagoForm({ ...pagoForm, fecha: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--gray-300)', borderRadius: '6px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '6px' }}>Monto</label>
                  <input type="text" value={pagoForm.monto} onChange={e => setPagoForm({ ...pagoForm, monto: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--gray-300)', borderRadius: '6px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '6px' }}>Método</label>
                  <select value={pagoForm.metodo} onChange={e => setPagoForm({ ...pagoForm, metodo: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--gray-300)', borderRadius: '6px', fontSize: '13px' }}>
                    <option>Wire Transfer</option>
                    <option>ACH</option>
                    <option>Check</option>
                    <option>Efectivo</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '6px' }}>Referencia (Opcional)</label>
                  <input type="text" value={pagoForm.referencia} onChange={e => setPagoForm({ ...pagoForm, referencia: e.target.value })} placeholder="Ej: WT-20260219" style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--gray-300)', borderRadius: '6px', fontSize: '13px' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button onClick={() => setPagoModal(false)} style={{ flex: 1, padding: '8px', background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: 'var(--gray-600)' }}>
                    Cancelar
                  </button>
                  <button onClick={async () => {
                    if (selected) {
                      await updateDoc(doc(db, 'facturas', selected.id), {
                        estado: 'Pagada',
                        pagos: [...selected.pagos, { fecha: pagoForm.fecha, monto: pagoForm.monto, metodo: pagoForm.metodo }],
                      });
                      setPagoModal(false);
                      setPagoForm({ fecha: '2026-02-19', monto: '', metodo: 'Wire Transfer', referencia: '' });
                    }
                  }} style={{ flex: 1, padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
