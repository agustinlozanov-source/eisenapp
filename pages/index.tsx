import Layout from '@/components/layout/Layout';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const KPIS = [
  { label: 'AR Total',             value: '$24,500', delta: '▲ 2 facturas vencidas', color: '#3B82F6', warn: true  },
  { label: 'WIP Listo a Facturar', value: '$12,000', delta: '✓ 1 semana lista',      color: '#10B981', warn: false },
  { label: 'Exposición Bloqueada', value: '$8,400',  delta: '⚠ OC Faltante',        color: '#F59E0B', warn: true  },
  { label: 'Tickets Activos',      value: '2',       delta: '1 en espera',           color: '#EF4444', warn: true  },
];

const TICKETS = [
  { id: 'EM26-01', cliente: 'Eurospec Mfg.',   planta: 'Fisher Dynamics',  issue: 'Missing Tabs — Mal Troquelado',    parte: '195364',  oc: '—',        estado: 'En Proceso', ec: '#10B981', eb: '#ECFDF5', asignado: 'A. Serrano' },
  { id: 'RD26-01', cliente: 'Ranger Die Inc.', planta: 'Adient Matamoros', issue: 'Metal Split — Bkt Reinforcement',  parte: '3232903', oc: 'PO-31764', estado: 'En Espera',  ec: '#EF4444', eb: '#FEF2F2', asignado: 'O. Pech'    },
];

const BLOCKED = [
  { id: 'RD26-01', badge: 'OC Faltante',  desc: 'Ranger Die / Adient · Sem 07', sub: '3 días bloqueado', amount: '$8,400', bg: '#FEF2F2', border: '#FECACA', c: '#991B1B', bb: '#FEE2E2' },
  { id: 'EM26-01', badge: 'Cumplimiento', desc: 'Eurospec / Fisher · Sem 07',    sub: 'POD pendiente',    amount: '—',      bg: '#FFFBEB', border: '#FDE68A', c: '#92400E', bb: '#FEF3C7' },
];

const BARS = [
  { label: 'Mar', segs: [{ h: 42, c: '#3B82F6' }, { h: 28, c: '#A5B4FC' }, { h: 18, c: '#F59E0B' }] },
  { label: 'Abr', segs: [{ h: 30, c: '#3B82F6' }, { h: 36, c: '#A5B4FC' }] },
  { label: 'May', segs: [{ h: 55, c: '#3B82F6' }] },
  { label: 'Jun', segs: [{ h: 38, c: '#3B82F6' }, { h: 12, c: '#F59E0B' }] },
  { label: 'Jul', segs: [{ h: 22, c: '#A5B4FC' }] },
  { label: 'Ago', segs: [{ h: 14, c: '#A5B4FC' }] },
];

export default function Dashboard() {
  return (
    <Layout title="Dashboard — Febrero 2026">

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
        {KPIS.map((k, i) => (
          <div key={i} style={{
            background: 'white', border: '1px solid var(--gray-200)',
            borderRadius: '10px', padding: '18px 20px', position: 'relative', overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.color }} />
            <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--gray-500)', marginBottom: '10px' }}>{k.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--gray-900)', letterSpacing: '-0.5px', lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: '11.5px', fontWeight: 500, marginTop: '6px', color: k.warn ? '#F59E0B' : '#10B981' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Chart + Blocked */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', marginBottom: '24px' }}>

        {/* Chart */}
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-800)' }}>Proyección de Cobro</div>
              <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>Mar — Ago 2026 · Basado en DSO real</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {[['#3B82F6','AR'],['#A5B4FC','WIP'],['#F59E0B','Bloqueado']].map(([c,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--gray-500)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', paddingBottom: '24px', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: '24px', left: 0, right: 0, height: '1px', background: 'var(--gray-100)' }} />
            {BARS.map((bar, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative', gap: '1px' }}>
                {bar.segs.map((seg, j) => (
                  <div key={j} style={{ width: '100%', height: `${seg.h}px`, background: seg.c, borderRadius: j === bar.segs.length - 1 ? '3px 3px 0 0' : '0' }} />
                ))}
                <div style={{ position: 'absolute', bottom: '-22px', fontSize: '10px', color: 'var(--gray-500)' }}>{bar.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked */}
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '12px' }}>Proyectos Bloqueados</div>
          {BLOCKED.map((b, i) => (
            <div key={i} style={{ background: b.bg, border: `1px solid ${b.border}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: b.c }}>{b.id}</span>
                <span style={{ fontSize: '10px', fontWeight: 500, background: b.bb, color: b.c, padding: '2px 8px', borderRadius: '10px' }}>{b.badge}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray-700)', marginBottom: '6px' }}>{b.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--gray-500)' }}>{b.sub}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: MONO, color: 'var(--gray-900)' }}>{b.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tickets table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-800)' }}>Tickets Recientes</span>
        <button style={{ fontSize: '12px', padding: '5px 10px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '6px', color: 'var(--gray-700)' }}>
          Ver todos →
        </button>
      </div>
      <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
              {['Ticket','Cliente','Planta','Issue','Parte','OC','Estado','Asignado'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TICKETS.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: i < TICKETS.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                <td style={{ padding: '13px 16px', fontFamily: MONO, fontSize: '12.5px', fontWeight: 600, color: 'var(--gray-900)' }}>{t.id}</td>
                <td style={{ padding: '13px 16px', fontSize: '13.5px', color: 'var(--gray-700)' }}>{t.cliente}</td>
                <td style={{ padding: '13px 16px', fontSize: '12.5px', color: 'var(--gray-500)' }}>{t.planta}</td>
                <td style={{ padding: '13px 16px', fontSize: '13px', color: 'var(--gray-700)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.issue}</td>
                <td style={{ padding: '13px 16px', fontSize: '12.5px', color: 'var(--gray-500)', fontFamily: MONO }}>{t.parte}</td>
                <td style={{ padding: '13px 16px', fontSize: '12px', fontFamily: MONO, fontWeight: 500, color: t.oc === '—' ? 'var(--gray-400)' : 'var(--gray-900)' }}>{t.oc}</td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 500, background: t.eb, color: t.ec }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: t.ec, display: 'inline-block' }} />
                    {t.estado}
                  </span>
                </td>
                <td style={{ padding: '13px 16px', fontSize: '12.5px', color: 'var(--gray-500)' }}>{t.asignado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Layout>
  );
}
