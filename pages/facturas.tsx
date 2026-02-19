import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { useState } from 'react';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const FACTURAS = [
  {
    id: 'INV-2026-001',
    cliente: 'Eurospec Mfg.',
    planta: 'Fisher Dynamics',
    proyecto: 'EM26-01',
    semana: 'Sem 06',
    fechaEmision: '2026-02-10',
    fechaVencimiento: '2026-03-11',
    diasVencimiento: 29,
    horas: 40,
    tarifa: '$40.00',
    subtotal: '$1,600.00',
    total: '$1,600.00',
    estado: 'Enviada',
    ec: '#D97706',
    eb: '#FFFBEB',
    oc: 'N/A',
    notas: 'Semana 06 — Fisher Dynamics Newmarket',
    pagos: [],
  },
  {
    id: 'INV-2026-002',
    cliente: 'Ranger Die Inc.',
    planta: 'Adient Matamoros',
    proyecto: 'RD26-01',
    semana: 'Sem 06',
    fechaEmision: '2026-02-10',
    fechaVencimiento: '2026-02-10',
    diasVencimiento: -9,
    horas: 40,
    tarifa: '$40.00',
    subtotal: '$1,600.00',
    total: '$1,600.00',
    estado: 'Vencida',
    ec: '#DC2626',
    eb: '#FEF2F2',
    oc: 'PO-31764',
    notas: 'Semana 06 — Adient Matamoros',
    pagos: [],
  },
  {
    id: 'INV-2026-003',
    cliente: 'Ranger Die Inc.',
    planta: 'Adient Matamoros',
    proyecto: 'RD26-01',
    semana: 'Sem 05',
    fechaEmision: '2026-02-03',
    fechaVencimiento: '2026-02-03',
    diasVencimiento: 0,
    horas: 40,
    tarifa: '$40.00',
    subtotal: '$1,600.00',
    total: '$1,600.00',
    estado: 'Pagada',
    ec: '#059669',
    eb: '#ECFDF5',
    oc: 'PO-31764',
    notas: 'Semana 05 — Adient Matamoros',
    pagos: [{ fecha: '2026-02-15', monto: '$1,600.00', metodo: 'Wire Transfer' }],
  },
];

const TABS = ['Todas', 'Enviada', 'Vencida', 'Pagada'];

type Factura = typeof FACTURAS[0];

export default function Facturas() {
  const [activeTab, setActiveTab] = useState('Todas');
  const [selected, setSelected] = useState<Factura>(FACTURAS[1]);

  const filtered = FACTURAS.filter(f =>
    activeTab === 'Todas' ? true : f.estado === activeTab
  );

  const totalAR = FACTURAS
    .filter(f => f.estado !== 'Pagada')
    .reduce((acc, f) => acc + parseFloat(f.total.replace(/[$,]/g, '')), 0);

  const totalVencido = FACTURAS
    .filter(f => f.estado === 'Vencida')
    .reduce((acc, f) => acc + parseFloat(f.total.replace(/[$,]/g, '')), 0);

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
          { label: 'Facturas',     value: FACTURAS.length.toString(),          color: '#6B7280' },
          { label: 'Pagadas',      value: FACTURAS.filter(f => f.estado === 'Pagada').length.toString(), color: '#10B981' },
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
          const count = tab === 'Todas' ? FACTURAS.length : FACTURAS.filter(f => f.estado === tab).length;
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
                  <button style={{ flex: 1, padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
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
      </div>
    </Layout>
  );
}
