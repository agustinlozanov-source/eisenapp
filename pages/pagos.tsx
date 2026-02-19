import Layout from '@/components/layout/Layout';
import { useState } from 'react';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const PAGOS = [
  {
    id: 'PAY-001',
    factura: 'INV-2026-003',
    cliente: 'Ranger Die Inc.',
    planta: 'Adient Matamoros',
    proyecto: 'RD26-01',
    fecha: '2026-02-15',
    monto: '$1,600.00',
    metodo: 'Wire Transfer',
    referencia: 'WT-20260215-RD',
    estado: 'Confirmado',
    ec: '#059669',
    eb: '#ECFDF5',
    banco: 'BMO Harris Bank',
    notas: 'Pago recibido en cuenta USD. Confirmado por contabilidad.',
    diasDesdeFecha: 4,
  },
  {
    id: 'PAY-002',
    factura: 'INV-2026-001',
    cliente: 'Eurospec Mfg.',
    planta: 'Fisher Dynamics',
    proyecto: 'EM26-01',
    fecha: '2026-03-11',
    monto: '$1,600.00',
    metodo: 'Wire Transfer',
    referencia: '',
    estado: 'Pendiente',
    ec: '#D97706',
    eb: '#FFFBEB',
    banco: '',
    notas: 'Factura enviada. Vence 11 Mar 2026.',
    diasDesdeFecha: -20,
  },
  {
    id: 'PAY-003',
    factura: 'INV-2026-002',
    cliente: 'Ranger Die Inc.',
    planta: 'Adient Matamoros',
    proyecto: 'RD26-01',
    fecha: '2026-02-10',
    monto: '$1,600.00',
    metodo: '',
    referencia: '',
    estado: 'Vencido',
    ec: '#DC2626',
    eb: '#FEF2F2',
    banco: '',
    notas: 'Factura vencida. Sin respuesta del cliente.',
    diasDesdeFecha: -9,
  },
];

const TABS = ['Todos', 'Confirmado', 'Pendiente', 'Vencido'];

type Pago = typeof PAGOS[0];

export default function Pagos() {
  const [activeTab, setActiveTab] = useState('Todos');
  const [selected, setSelected] = useState<Pago>(PAGOS[0]);

  const filtered = PAGOS.filter(p =>
    activeTab === 'Todos' ? true : p.estado === activeTab
  );

  const totalCobrado = PAGOS
    .filter(p => p.estado === 'Confirmado')
    .reduce((acc, p) => acc + parseFloat(p.monto.replace(/[$,]/g, '')), 0);

  const totalPendiente = PAGOS
    .filter(p => p.estado === 'Pendiente')
    .reduce((acc, p) => acc + parseFloat(p.monto.replace(/[$,]/g, '')), 0);

  const totalVencido = PAGOS
    .filter(p => p.estado === 'Vencido')
    .reduce((acc, p) => acc + parseFloat(p.monto.replace(/[$,]/g, '')), 0);

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
          const count = tab === 'Todos' ? PAGOS.length : PAGOS.filter(p => p.estado === tab).length;
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
                  <button style={{ flex: 1, padding: '8px', background: 'var(--gray-100)', color: 'var(--gray-600)', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                    Ver Comprobante
                  </button>
                ) : (
                  <button style={{ flex: 1, padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                    Confirmar Pago
                  </button>
                )}
                {selected.estado === 'Vencido' && (
                  <button style={{ flex: 1, padding: '8px', background: '#F97316', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                    Enviar Recordatorio
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
