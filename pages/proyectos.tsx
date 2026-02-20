import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const TABS = ['Todos', 'Activo', 'Bloqueado', 'Cerrado'];

interface Proyecto {
  id: string;
  nombre: string;
  cliente: string;
  contacto?: string;
  planta: string;
  ciudad: string;
  parte: string;
  lote: string;
  cantidad?: string;
  qty?: string;
  tarifa: string;
  inicio: string;
  semanaInicio?: string;
  semanaActual?: string;
  semanasActivas?: number;
  horasTotal?: number;
  facturado?: string;
  cobrado?: string;
  pendiente?: string;
  estado: string;
  ec?: string;
  eb?: string;
  supervisor: string;
  oc?: string;
  notas?: string;
  descripcion?: string;
  creadoEn?: string;
}

export default function Proyectos() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Todos');
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [selected, setSelected] = useState<Proyecto | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'proyectos'), (snap) => {
      const data = snap.docs.map(d => {
        const proyecto = { id: d.id, ...d.data() } as Proyecto;
        // Asegurar que todos los campos requeridos tengan valores por defecto
        return {
          ...proyecto,
          ec: proyecto.ec || '#059669',
          eb: proyecto.eb || '#ECFDF5',
          contacto: proyecto.contacto || proyecto.cliente,
          semanasActivas: proyecto.semanasActivas || 1,
          horasTotal: proyecto.horasTotal || 0,
          facturado: proyecto.facturado || '$0',
          cobrado: proyecto.cobrado || '$0',
          pendiente: proyecto.pendiente || '$0',
        };
      });
      setProyectos(data);
      setSelected(prev => prev ? data.find(p => p.id === prev.id) || data[0] : data[0]);
    });
    return () => unsub();
  }, []);

  const filtered = proyectos.filter(p =>
    activeTab === 'Todos' ? true : p.estado === activeTab
  );

  return (
    <Layout title="Proyectos">

      {/* Header con KPIs y botón */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', flex: 1 }}>
        {[
          { label: 'Proyectos Activos',  value: proyectos.filter(p => p.estado === 'Activo').length.toString(),    color: '#10B981' },
          { label: 'Bloqueados',         value: proyectos.filter(p => p.estado === 'Bloqueado').length.toString(), color: '#EF4444' },
          { label: 'Total Facturado',    value: '$4,800',  color: '#3B82F6' },
          { label: 'Total Pendiente',    value: '$3,200',  color: '#F59E0B' },
        ].map((k, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '16px 20px', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.color }} />
            <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--gray-500)', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: k.color, letterSpacing: '-0.5px', fontFamily: MONO }}>{k.value}</div>
          </div>
        ))}
        </div>
        <Link href='/proyectos/nuevo'>
          <button style={{ padding: '10px 16px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', marginTop: '2px' }}>
            + Nuevo Proyecto
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', marginBottom: '16px' }}>
        {TABS.map(tab => {
          const count = tab === 'Todos' ? PROYECTOS.length : PROYECTOS.filter(p => p.estado === tab).length;
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
          {filtered.map(p => {
            const isSelected = selected?.id === p.id;
            return (
              <div key={p.id}
                onClick={() => setSelected(p)}
                style={{
                  background: 'white',
                  border: `1px solid ${isSelected ? '#3B82F6' : 'var(--gray-200)'}`,
                  borderRadius: '10px', padding: '16px 18px', cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 0 3px rgba(59,130,246,0.1)' : '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontFamily: MONO, fontSize: '12px', fontWeight: 700, color: 'var(--gray-700)' }}>{p.id}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: p.eb, color: p.ec }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: p.ec, display: 'inline-block' }} />
                        {p.estado}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '3px' }}>{p.nombre}</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--gray-500)' }}>{p.cliente} — {p.planta}, {p.ciudad}</div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px', marginBottom: '10px' }}>
                  {[
                    { label: 'Semanas',    value: p.semanasActivas.toString() },
                    { label: 'Horas',      value: p.horasTotal.toString() },
                    { label: 'Facturado',  value: p.facturado,  color: '#3B82F6' },
                    { label: 'Cobrado',    value: p.cobrado,    color: '#10B981' },
                    { label: 'Pendiente',  value: p.pendiente,  color: p.pendiente !== '$0' ? '#F59E0B' : 'var(--gray-400)' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--gray-50)', borderRadius: '6px', padding: '8px 10px' }}>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '3px' }}>{s.label}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: s.color || 'var(--gray-900)', fontFamily: MONO }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                    👤 {p.supervisor} · Parte <span style={{ fontFamily: MONO }}>{p.parte}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)', fontFamily: MONO }}>Desde {p.inicio}</div>
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
                <div style={{ fontFamily: MONO, fontSize: '11px', color: 'var(--gray-400)', marginBottom: '2px' }}>{selected.id}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.3 }}>{selected.nombre}</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: selected.eb, color: selected.ec, flexShrink: 0, marginLeft: '8px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: selected.ec, display: 'inline-block' }} />
                {selected.estado}
              </span>
            </div>

            {selected.estado === 'Bloqueado' && (
              <div style={{ margin: '14px 18px 0', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', marginBottom: '2px' }}>🔴 PROYECTO BLOQUEADO</div>
                <div style={{ fontSize: '12px', color: '#7F1D1D' }}>Documentos faltantes impiden facturar.</div>
              </div>
            )}

            <div style={{ padding: '14px 18px' }}>

              {/* Financial summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
                {[
                  { label: 'Facturado', value: selected.facturado, color: '#3B82F6' },
                  { label: 'Cobrado',   value: selected.cobrado,   color: '#10B981' },
                  { label: 'Pendiente', value: selected.pendiente, color: '#F59E0B' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: s.color, fontFamily: MONO }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {[
                { label: 'Cliente',    value: selected.cliente },
                { label: 'Contacto',   value: selected.contacto },
                { label: 'Planta',     value: `${selected.planta} — ${selected.ciudad}` },
                { label: 'Parte',      value: selected.parte,   mono: true },
                { label: 'Lote',       value: selected.lote,    mono: true },
                { label: 'Cantidad',   value: `${selected.qty} pzas` },
                { label: 'Tarifa',     value: selected.tarifa,  mono: true },
                { label: 'OC',         value: selected.oc || 'N/A', mono: true },
                { label: 'Supervisor', value: selected.supervisor },
                { label: 'Inicio',     value: selected.inicio,  mono: true },
                { label: 'Semanas',    value: selected.semanasActivas.toString() },
                { label: 'Horas',      value: `${selected.horasTotal} hrs` },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--gray-50)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)' }}>{f.label}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-800)', fontFamily: f.mono ? MONO : 'inherit' }}>{f.value}</span>
                </div>
              ))}

              <div style={{ background: 'var(--gray-50)', borderRadius: '6px', padding: '10px 12px', marginTop: '4px', marginBottom: '14px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '4px' }}>Descripción</div>
                <div style={{ fontSize: '12.5px', color: 'var(--gray-700)', lineHeight: 1.55 }}>{selected.descripcion}</div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => router.push('/semanas?proyecto=' + selected.id)} style={{ flex: 1, padding: '8px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}>
                  Ver Semanas
                </button>
                <button onClick={() => router.push('/tickets?proyecto=' + selected.id)} style={{ padding: '8px 12px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '12.5px', color: 'var(--gray-600)', cursor: 'pointer' }}>
                  Ver Tickets
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
