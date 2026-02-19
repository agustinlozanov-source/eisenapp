import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

type Inspeccion = {
  id: string;
  fecha: string;
  diaSemana: string;
  proyecto: string;
  cliente: string;
  planta: string;
  semana: string;
  supervisor: string;
  turno: string;
  total: number;
  ok: number;
  nok: number;
  tasaNok: string;
  defectos: { codigo: string; descripcion: string; cantidad: number }[];
  firmado: boolean;
  horaFirma: string;
  notas: string;
};

export default function Inspecciones() {
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [selected, setSelected] = useState<Inspeccion | null>(null);
  const [filtroProyecto, setFiltroProyecto] = useState('Todos');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'inspecciones'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Inspeccion));
      setInspecciones(data);
      setSelected(prev => prev ? data.find(i => i.id === prev.id) || data[0] : data[0]);
    });
    return () => unsub();
  }, []);

  const proyectos = ['Todos', ...Array.from(new Set(inspecciones.map(i => i.proyecto)))];

  const filtered = inspecciones.filter(i =>
    filtroProyecto === 'Todos' ? true : i.proyecto === filtroProyecto
  );

  return (
    <Layout title="Inspecciones Diarias">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
          {inspecciones.length} inspecciones esta semana
        </div>
        <button style={{ padding: '7px 14px', background: '#F97316', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
          + Nueva Inspección
        </button>
      </div>

      {/* Filtro proyecto */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {proyectos.map(p => (
          <button key={p} onClick={() => setFiltroProyecto(p)} style={{
            padding: '5px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 500,
            cursor: 'pointer', border: '1px solid',
            background: filtroProyecto === p ? 'var(--gray-900)' : 'white',
            color: filtroProyecto === p ? 'white' : 'var(--gray-600)',
            borderColor: filtroProyecto === p ? 'var(--gray-900)' : 'var(--gray-200)',
          }}>{p}</button>
        ))}
      </div>

      {/* 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }}>

        {/* LIST */}
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                {['Fecha','Proyecto','Planta','Supervisor','Total','OK','NOK','Tasa NOK','Firma'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ins, i) => {
                const isSelected = selected?.id === ins.id;
                const tasaNum = parseFloat(ins.tasaNok);
                const tasaColor = tasaNum > 3 ? '#EF4444' : tasaNum > 1 ? '#F59E0B' : '#10B981';
                return (
                  <tr key={ins.id}
                    onClick={() => setSelected(ins)}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid var(--gray-100)' : 'none',
                      cursor: 'pointer',
                      background: isSelected ? '#EFF6FF' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--gray-50)'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-900)', fontFamily: MONO }}>{ins.fecha}</div>
                      <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{ins.diaSemana}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: MONO, fontSize: '12px', fontWeight: 600, color: 'var(--gray-700)' }}>{ins.proyecto}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px', color: 'var(--gray-600)' }}>{ins.planta}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px', color: 'var(--gray-700)' }}>{ins.supervisor}</td>
                    <td style={{ padding: '12px 14px', fontFamily: MONO, fontSize: '12.5px', fontWeight: 600, color: 'var(--gray-900)' }}>{ins.total.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontFamily: MONO, fontSize: '12.5px', color: '#10B981', fontWeight: 500 }}>{ins.ok.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontFamily: MONO, fontSize: '12.5px', color: ins.nok > 20 ? '#EF4444' : 'var(--gray-700)', fontWeight: 600 }}>{ins.nok}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontFamily: MONO, fontSize: '12px', fontWeight: 600, color: tasaColor }}>{ins.tasaNok}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {ins.firmado
                        ? <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 500 }}>✓ {ins.horaFirma}</span>
                        : <span style={{ fontSize: '11.5px', color: '#EF4444', fontWeight: 500 }}>Pendiente</span>
                      }
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

            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--gray-100)' }}>
              <div style={{ fontFamily: MONO, fontSize: '11px', color: 'var(--gray-400)', marginBottom: '2px' }}>{selected.proyecto} · {selected.semana}</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--gray-900)' }}>{selected.diaSemana}, {selected.fecha}</div>
              <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>{selected.planta}</div>
            </div>

            {/* NOK Alert */}
            {parseFloat(selected.tasaNok) > 3 && (
              <div style={{ margin: '14px 18px 0', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', marginBottom: '2px' }}>⚠ TASA NOK ELEVADA</div>
                <div style={{ fontSize: '12px', color: '#7F1D1D' }}>Tasa de {selected.tasaNok} supera el umbral del 3%.</div>
              </div>
            )}

            <div style={{ padding: '14px 18px' }}>

              {/* Counts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
                {[
                  { label: 'Total',  value: selected.total.toLocaleString(), color: 'var(--gray-900)' },
                  { label: 'OK',     value: selected.ok.toLocaleString(),    color: '#10B981' },
                  { label: 'NOK',    value: selected.nok.toString(),         color: '#EF4444' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: s.color, fontFamily: MONO }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Fields */}
              {[
                { label: 'Supervisor', value: selected.supervisor },
                { label: 'Turno',      value: selected.turno },
                { label: 'Tasa NOK',   value: selected.tasaNok, mono: true },
                { label: 'Firma',      value: selected.firmado ? `✓ Firmado ${selected.horaFirma}` : 'Pendiente' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--gray-50)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>{f.label}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-800)', fontFamily: f.mono ? MONO : 'inherit' }}>{f.value}</span>
                </div>
              ))}

              {/* Defectos */}
              <div style={{ marginTop: '8px', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '8px' }}>Defectos Encontrados</div>
                {selected.defectos.map(d => (
                  <div key={d.codigo} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FEF2F2', borderRadius: '6px', padding: '8px 10px', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontFamily: MONO, fontSize: '11px', color: '#991B1B', fontWeight: 600 }}>{d.codigo}</span>
                      <span style={{ fontSize: '12.5px', color: 'var(--gray-700)', marginLeft: '8px' }}>{d.descripcion}</span>
                    </div>
                    <span style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 700, color: '#EF4444' }}>{d.cantidad}</span>
                  </div>
                ))}
              </div>

              {/* Notas */}
              {selected.notas && (
                <div style={{ background: 'var(--gray-50)', borderRadius: '6px', padding: '10px 12px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '4px' }}>Notas</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--gray-700)', lineHeight: 1.5 }}>{selected.notas}</div>
                </div>
              )}

              <button style={{ width: '100%', padding: '8px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                Ver Reporte Completo
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
