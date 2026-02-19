import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Link from 'next/link';
import { useState } from 'react';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const CLIENTES = [
  {
    id: 'CLI-001',
    nombre: 'Eurospec Mfg.',
    contacto: 'James Whitfield',
    email: 'j.whitfield@eurospec.com',
    telefono: '+1 519 555 0142',
    planta: 'Fisher Dynamics — Newmarket, ON',
    pais: 'Canada',
    estado: 'Activo',
    tickets: 1,
    facturaPendiente: '$0',
    ultimoTicket: '2026-02-10',
  },
  {
    id: 'CLI-002',
    nombre: 'Ranger Die Inc.',
    contacto: 'Bob Ranger',
    email: 'b.ranger@rangerdie.com',
    telefono: '+1 519 555 0198',
    planta: 'Adient — Matamoros, MX',
    pais: 'Canada',
    estado: 'Activo',
    tickets: 1,
    facturaPendiente: '$8,400',
    ultimoTicket: '2026-02-12',
  },
];

const BADGE: Record<string, { bg: string; color: string }> = {
  Activo:   { bg: '#ECFDF5', color: '#059669' },
  Inactivo: { bg: '#F3F4F6', color: '#6B7280' },
};

export default function Clientes() {
  const [search, setSearch] = useState('');

  const filtered = CLIENTES.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.contacto.toLowerCase().includes(search.toLowerCase()) ||
    c.planta.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Clientes">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
          {CLIENTES.length} clientes registrados
        </div>
        <button style={{
          padding: '7px 14px', background: 'var(--gray-900)', color: 'white',
          border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
          cursor: 'pointer',
        }}>
          + Nuevo Cliente</button></Link>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'white', border: '1px solid var(--gray-200)',
        borderRadius: '8px', padding: '8px 14px', marginBottom: '16px',
        maxWidth: '360px',
      }}>
        <span style={{ color: 'var(--gray-400)' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cliente, contacto, planta..."
          style={{
            border: 'none', background: 'transparent', outline: 'none',
            fontSize: '13px', color: 'var(--gray-700)', flex: 1,
          }}
        />
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
        {filtered.map(c => (
          <div key={c.id} style={{
            background: 'white', border: '1px solid var(--gray-200)',
            borderRadius: '10px', overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.15s',
            cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.10)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'}
          >
            {/* Card header */}
            <div style={{
              padding: '16px 18px', borderBottom: '1px solid var(--gray-100)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'var(--gray-900)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 700, color: 'white', flexShrink: 0,
                }}>
                  {c.nombre.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-900)' }}>{c.nombre}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--gray-500)', marginTop: '2px' }}>{c.id}</div>
                </div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 500, padding: '3px 9px',
                borderRadius: '20px', background: BADGE[c.estado].bg,
                color: BADGE[c.estado].color,
              }}>{c.estado}</span>
            </div>

            {/* Card body */}
            <div style={{ padding: '14px 18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '3px' }}>Contacto</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-800)' }}>{c.contacto}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '3px' }}>País</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-800)' }}>{c.pais}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '3px' }}>Email</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--gray-700)', fontFamily: MONO }}>{c.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '3px' }}>Teléfono</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--gray-700)', fontFamily: MONO }}>{c.telefono}</div>
                </div>
              </div>

              <div style={{ background: 'var(--gray-50)', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '3px' }}>Planta</div>
                <div style={{ fontSize: '12.5px', color: 'var(--gray-700)' }}>{c.planta}</div>
              </div>

              {/* Footer stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tickets</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)' }}>{c.tickets}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pendiente</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: c.facturaPendiente !== '$0' ? '#EF4444' : 'var(--gray-900)' }}>{c.facturaPendiente}</div>
                  </div>
                </div>
                <button style={{
                  fontSize: '12px', padding: '5px 12px',
                  background: 'white', border: '1px solid var(--gray-200)',
                  borderRadius: '6px', color: 'var(--gray-700)', cursor: 'pointer',
                }}>
                  Ver detalle →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </Layout>
  );
}
