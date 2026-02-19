import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const TABS = ['Todas', 'Lista para Facturar', 'Bloqueada', 'Facturada', 'Pagada'];

interface Semana {
  id: string;
  semana: string;
  rango: string;
  proyecto: string;
  cliente: string;
  planta: string;
  supervisor: string;
  diasTrabajados: number;
  horasTotal: number;
  inspeccionadas: number;
  ok: number;
  nok: number;
  tasaNok: string;
  estado: string;
  ec: string;
  eb: string;
  monto: string;
  oc: string;
  pod: boolean;
  reporte: boolean;
  firma: boolean;
}

export default function Semanas() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Todas');
  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [selected, setSelected] = useState<Semana | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'semanas'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Semana));
      setSemanas(data);
      setSelected(prev => prev ? data.find(s => s.id === prev.id) || data[0] : data[0]);
    });
    return () => unsub();
  }, []);

  const filtered = semanas.filter(s =>
    activeTab === 'Todas' ? true : s.estado === activeTab
  );

  return (
    <Layout title="Semanas de Trabajo">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
          {semanas.length} semanas registradas
        </div>
        <Link href='/semanas/nueva'><button style={{ padding: '7px 14px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
          + Nueva Semana</button></Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', marginBottom: '16px', overflowX: 'auto' }}>
        {TABS.map(tab => {
          const count = tab === 'Todas' ? semanas.length : semanas.filter(s => s.estado === tab).length;
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(s => {
            const isSelected = selected?.id === s.id;
            return (
              <div key={s.id}
                onClick={() => setSelected(s)}
                style={{
                  background: 'white', border: `1px solid ${isSelected ? '#3B82F6' : 'var(--gray-200)'}`,
                  borderRadius: '10px', padding: '16px 18px',
                  boxShadow: isSelected ? '0 0 0 3px rgba(59,130,246,0.1)' : '0 1px 3px rgba(0,0,0,0.06)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
                      <span style={{ fontFamily: MONO, fontSize: '12px', fontWeight: 600, color: 'var(--gray-500)' }}>{s.proyecto}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)' }}>{s.semana}</span>
                      <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{s.rango}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--gray-600)' }}>{s.cliente} — {s.planta}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 500, background: s.eb, color: s.ec, flexShrink: 0 }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.ec, display: 'inline-block' }} />
                    {s.estado}
                  </span>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  {[
                    { label: 'Días', value: String(s.diasTrabajados || 0) },
                    { label: 'Horas', value: String(s.horasTotal || 0) },
                    { label: 'Inspeccionadas', value: (s.inspeccionadas || 0).toLocaleString() },
                    { label: 'NOK', value: String(s.nok || 0), color: (s.nok || 0) > 100 ? '#EF4444' : 'var(--gray-800)' },
                    { label: 'Tasa NOK', value: s.tasaNok || '0%', color: parseFloat(s.tasaNok || '0%') > 1 ? '#F59E0B' : '#10B981' },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: 'var(--gray-50)', borderRadius: '6px', padding: '8px 10px' }}>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '3px' }}>{stat.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: stat.color || 'var(--gray-900)', fontFamily: MONO }}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Compliance indicators */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  {[
                    { label: 'POD', ok: s.pod },
                    { label: 'Reporte', ok: s.reporte },
                    { label: 'Firma', ok: s.firma },
                    { label: 'OC', ok: !!s.oc || s.estado !== 'Bloqueada' },
                  ].map(c => (
                    <div key={c.label} style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '11px', fontWeight: 500,
                      color: c.ok ? '#059669' : '#DC2626',
                      background: c.ok ? '#ECFDF5' : '#FEF2F2',
                      padding: '2px 8px', borderRadius: '4px',
                    }}>
                      {c.ok ? '✓' : '✗'} {c.label}
                    </div>
                  ))}
                  <div style={{ flex: 1, textAlign: 'right', fontFamily: MONO, fontSize: '13px', fontWeight: 700, color: 'var(--gray-900)' }}>
                    {s.monto}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAIL PANEL */}
        {selected && (
          <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: '11px', color: 'var(--gray-400)', marginBottom: '2px' }}>{selected.proyecto} · {selected.semana}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)' }}>{selected.cliente}</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: selected.eb, color: selected.ec, flexShrink: 0 }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: selected.ec, display: 'inline-block' }} />
                {selected.estado}
              </span>
            </div>

            {/* Blocked alert */}
            {selected.estado === 'Bloqueada' && (
              <div style={{ margin: '14px 18px 0', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', marginBottom: '3px' }}>🔴 SEMANA BLOQUEADA</div>
                <div style={{ fontSize: '12px', color: '#7F1D1D' }}>Documentos faltantes impiden facturar.</div>
              </div>
            )}

            <div style={{ padding: '14px 18px' }}>
              {[
                { label: 'Rango',       value: selected.rango || '—' },
                { label: 'Planta',      value: selected.planta || '—' },
                { label: 'Supervisor',  value: selected.supervisor || '—' },
                { label: 'Días',        value: `${selected.diasTrabajados || 0} días` },
                { label: 'Horas',       value: `${selected.horasTotal || 0} hrs` },
                { label: 'Inspecc.',    value: (selected.inspeccionadas || 0).toLocaleString() + ' pzas' },
                { label: 'OK',          value: (selected.ok || 0).toLocaleString() + ' pzas' },
                { label: 'NOK',         value: String(selected.nok || 0) + ' pzas' },
                { label: 'Tasa NOK',    value: selected.tasaNok || '0%' },
                { label: 'Monto',       value: selected.monto || '—', mono: true },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--gray-50)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>{f.label}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-800)', fontFamily: f.mono ? MONO : 'inherit' }}>{f.value}</span>
                </div>
              ))}

              {/* Compliance checklist */}
              <div style={{ marginTop: '8px', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '8px' }}>Documentos</div>
                {[
                  { label: 'POD subido',          ok: selected.pod },
                  { label: 'Reporte semanal',     ok: selected.reporte },
                  { label: 'Firma supervisor',    ok: selected.firma },
                  { label: 'OC registrada',       ok: !!selected.oc || selected.estado !== 'Bloqueada' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: c.ok ? '#ECFDF5' : '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0, color: c.ok ? '#059669' : '#DC2626' }}>
                      {c.ok ? '✓' : '✗'}
                    </div>
                    <span style={{ fontSize: '12.5px', color: c.ok ? 'var(--gray-700)' : '#DC2626', fontWeight: c.ok ? 400 : 500 }}>{c.label}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {selected.estado === 'Lista para Facturar' && (
                  <button onClick={() => router.push('/facturas/nueva?semana=' + selected.id)} style={{ flex: 1, padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                    Crear Factura
                  </button>
                )}
                {selected.estado === 'Bloqueada' && (
                  <button style={{ flex: 1, padding: '8px', background: '#F97316', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                    Subir Documentos
                  </button>
                )}
                {selected.estado === 'Facturada' && (
                  <button onClick={() => router.push('/facturas?proyecto=' + selected.proyecto)} style={{ flex: 1, padding: '8px', background: 'var(--gray-100)', color: 'var(--gray-600)', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                    Ver Factura
                  </button>
                )}
                <button onClick={() => router.push('/inspecciones?proyecto=' + selected.proyecto)} style={{ padding: '8px 12px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '12.5px', color: 'var(--gray-600)', cursor: 'pointer' }}>
                  Ver Inspecciones
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
