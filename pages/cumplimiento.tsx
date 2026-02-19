import Layout from '@/components/layout/Layout';
import { useState } from 'react';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const CUMPLIMIENTO = [
  {
    id: 'CMP-001',
    proyecto: 'EM26-01',
    cliente: 'Eurospec Mfg.',
    planta: 'Fisher Dynamics',
    semana: 'Sem 07',
    rango: '10 Feb — 14 Feb 2026',
    supervisor: 'A. Serrano',
    documentos: {
      pod:      { ok: true,  fecha: '2026-02-14', archivo: 'POD-EM26-Sem07.pdf' },
      reporte:  { ok: true,  fecha: '2026-02-14', archivo: 'Reporte-EM26-Sem07.pdf' },
      firma:    { ok: true,  fecha: '2026-02-14', archivo: 'Firma-EM26-Sem07.png' },
      oc:       { ok: true,  numero: 'N/A — T&C firmado' },
    },
    estado: 'Completo',
    ec: '#059669',
    eb: '#ECFDF5',
    puntaje: 100,
  },
  {
    id: 'CMP-002',
    proyecto: 'RD26-01',
    cliente: 'Ranger Die Inc.',
    planta: 'Adient Matamoros',
    semana: 'Sem 07',
    rango: '10 Feb — 14 Feb 2026',
    supervisor: 'O. Pech',
    documentos: {
      pod:      { ok: false, fecha: '',           archivo: '' },
      reporte:  { ok: true,  fecha: '2026-02-14', archivo: 'Reporte-RD26-Sem07.pdf' },
      firma:    { ok: false, fecha: '',           archivo: '' },
      oc:       { ok: true,  numero: 'PO-31764' },
    },
    estado: 'Incompleto',
    ec: '#DC2626',
    eb: '#FEF2F2',
    puntaje: 50,
  },
  {
    id: 'CMP-003',
    proyecto: 'EM26-01',
    cliente: 'Eurospec Mfg.',
    planta: 'Fisher Dynamics',
    semana: 'Sem 06',
    rango: '03 Feb — 07 Feb 2026',
    supervisor: 'A. Serrano',
    documentos: {
      pod:      { ok: true,  fecha: '2026-02-07', archivo: 'POD-EM26-Sem06.pdf' },
      reporte:  { ok: true,  fecha: '2026-02-07', archivo: 'Reporte-EM26-Sem06.pdf' },
      firma:    { ok: true,  fecha: '2026-02-07', archivo: 'Firma-EM26-Sem06.png' },
      oc:       { ok: true,  numero: 'N/A — T&C firmado' },
    },
    estado: 'Completo',
    ec: '#059669',
    eb: '#ECFDF5',
    puntaje: 100,
  },
];

type Cumplimiento = typeof CUMPLIMIENTO[0];

const DOCS = [
  { key: 'pod',     label: 'POD',              desc: 'Proof of Delivery' },
  { key: 'reporte', label: 'Reporte Semanal',  desc: 'Reporte de inspección' },
  { key: 'firma',   label: 'Firma Supervisor', desc: 'Firma digital' },
  { key: 'oc',      label: 'OC / T&C',         desc: 'Orden de compra' },
];

export default function Cumplimiento() {
  const [selected, setSelected] = useState<Cumplimiento>(CUMPLIMIENTO[1]);
  const [filtro, setFiltro] = useState('Todos');

  const filtered = CUMPLIMIENTO.filter(c =>
    filtro === 'Todos' ? true : c.estado === filtro
  );

  const totalCompleto   = CUMPLIMIENTO.filter(c => c.estado === 'Completo').length;
  const totalIncompleto = CUMPLIMIENTO.filter(c => c.estado === 'Incompleto').length;

  return (
    <Layout title="Cumplimiento">

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Semanas Completas',   value: totalCompleto,   color: '#10B981', bg: '#ECFDF5' },
          { label: 'Semanas Incompletas', value: totalIncompleto, color: '#EF4444', bg: '#FEF2F2' },
          { label: 'Tasa de Cumplimiento', value: `${Math.round((totalCompleto / CUMPLIMIENTO.length) * 100)}%`, color: '#3B82F6', bg: '#EFF6FF' },
        ].map((k, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--gray-500)', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: k.color, letterSpacing: '-0.5px' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filtro */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['Todos', 'Completo', 'Incompleto'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding: '5px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 500,
            cursor: 'pointer', border: '1px solid',
            background: filtro === f ? 'var(--gray-900)' : 'white',
            color: filtro === f ? 'white' : 'var(--gray-600)',
            borderColor: filtro === f ? 'var(--gray-900)' : 'var(--gray-200)',
          }}>{f}</button>
        ))}
      </div>

      {/* 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }}>

        {/* LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(c => {
            const isSelected = selected?.id === c.id;
            return (
              <div key={c.id}
                onClick={() => setSelected(c)}
                style={{
                  background: 'white', border: `1px solid ${isSelected ? '#3B82F6' : 'var(--gray-200)'}`,
                  borderRadius: '10px', padding: '16px 18px', cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 0 3px rgba(59,130,246,0.1)' : '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
                      <span style={{ fontFamily: MONO, fontSize: '12px', fontWeight: 600, color: 'var(--gray-500)' }}>{c.proyecto}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)' }}>{c.semana}</span>
                      <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{c.rango}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--gray-600)' }}>{c.cliente} — {c.planta}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Puntaje */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: c.ec, fontFamily: MONO, lineHeight: 1 }}>{c.puntaje}%</div>
                      <div style={{ fontSize: '10px', color: 'var(--gray-400)' }}>cumplimiento</div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 500, background: c.eb, color: c.ec }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: c.ec, display: 'inline-block' }} />
                      {c.estado}
                    </span>
                  </div>
                </div>

                {/* Docs indicators */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {DOCS.map(d => {
                    const doc = c.documentos[d.key as keyof typeof c.documentos] as { ok: boolean };
                    return (
                      <div key={d.key} style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '11px', fontWeight: 500,
                        color: doc.ok ? '#059669' : '#DC2626',
                        background: doc.ok ? '#ECFDF5' : '#FEF2F2',
                        padding: '3px 8px', borderRadius: '4px',
                      }}>
                        {doc.ok ? '✓' : '✗'} {d.label}
                      </div>
                    );
                  })}
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
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: selected.ec, fontFamily: MONO, lineHeight: 1 }}>{selected.puntaje}%</div>
                <div style={{ fontSize: '10px', color: 'var(--gray-400)' }}>cumplimiento</div>
              </div>
            </div>

            <div style={{ padding: '14px 18px' }}>

              {/* Fields */}
              {[
                { label: 'Rango',      value: selected.rango },
                { label: 'Planta',     value: selected.planta },
                { label: 'Supervisor', value: selected.supervisor },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--gray-50)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>{f.label}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-800)' }}>{f.value}</span>
                </div>
              ))}

              {/* Documentos detalle */}
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '10px' }}>Documentos</div>
                {DOCS.map(d => {
                  const doc = selected.documentos[d.key as keyof typeof selected.documentos] as any;
                  return (
                    <div key={d.key} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: doc.ok ? '#F0FDF4' : '#FEF2F2',
                      border: `1px solid ${doc.ok ? '#BBF7D0' : '#FECACA'}`,
                      borderRadius: '8px', padding: '10px 12px', marginBottom: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: doc.ok ? '#ECFDF5' : '#FEF2F2', border: `1.5px solid ${doc.ok ? '#10B981' : '#EF4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: doc.ok ? '#059669' : '#DC2626', flexShrink: 0 }}>
                          {doc.ok ? '✓' : '✗'}
                        </div>
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-800)' }}>{d.label}</div>
                          <div style={{ fontSize: '11px', color: 'var(--gray-500)' }}>{d.desc}</div>
                        </div>
                      </div>
                      {doc.ok
                        ? <span style={{ fontSize: '11px', fontFamily: MONO, color: '#059669' }}>{doc.fecha || doc.numero}</span>
                        : <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 500 }}>Faltante</span>
                      }
                    </div>
                  );
                })}
              </div>

              {/* Action */}
              <div style={{ marginTop: '14px' }}>
                {selected.estado === 'Incompleto' ? (
                  <button style={{ width: '100%', padding: '9px', background: '#F97316', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    Subir Documentos Faltantes
                  </button>
                ) : (
                  <button style={{ width: '100%', padding: '9px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    Ver Documentos
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
