import Layout from '@/components/layout/Layout';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const TICKETS = [
  { id: 'EM26-01', cliente: 'Eurospec Mfg.',   planta: 'Fisher Dynamics',  issue: 'Missing Tabs — Mal Troquelado',   parte: '195364',  lote: '02226', qty: '9,720', oc: '—',        estado: 'En Proceso', ec: '#10B981', eb: '#ECFDF5', asignado: 'A. Serrano', fecha: '2026-02-10' },
  { id: 'RD26-01', cliente: 'Ranger Die Inc.', planta: 'Adient Matamoros', issue: 'Metal Split — Bkt Reinforcement', parte: '3232903', lote: '32825', qty: '6,290', oc: 'PO-31764', estado: 'En Espera',  ec: '#EF4444', eb: '#FEF2F2', asignado: 'O. Pech',    fecha: '2026-02-12' },
];

export default function Tickets() {
  return (
    <Layout title="Tickets de Servicio">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>2 tickets activos · 0 cerrados</div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}>
          + Nuevo Ticket
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', marginBottom: '20px' }}>
        {['Todos (2)', 'En Proceso (1)', 'En Espera (1)', 'Cerrados (0)'].map((tab, i) => (
          <div key={tab} style={{
            padding: '9px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            color: i === 0 ? 'var(--gray-900)' : 'var(--gray-500)',
            borderBottom: i === 0 ? '2px solid var(--gray-900)' : '2px solid transparent',
            marginBottom: '-1px',
          }}>{tab}</div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
              {['Ticket','Cliente','Planta','Issue','Parte','Lote','Qty','OC','Estado','Asignado','Fecha'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TICKETS.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: i < TICKETS.length - 1 ? '1px solid var(--gray-100)' : 'none', cursor: 'pointer' }}>
                <td style={{ padding: '13px 14px', fontFamily: MONO, fontSize: '12.5px', fontWeight: 600, color: 'var(--gray-900)' }}>{t.id}</td>
                <td style={{ padding: '13px 14px', fontSize: '13px', color: 'var(--gray-700)' }}>{t.cliente}</td>
                <td style={{ padding: '13px 14px', fontSize: '12px', color: 'var(--gray-500)' }}>{t.planta}</td>
                <td style={{ padding: '13px 14px', fontSize: '13px', color: 'var(--gray-700)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.issue}</td>
                <td style={{ padding: '13px 14px', fontSize: '12px', fontFamily: MONO, color: 'var(--gray-600)' }}>{t.parte}</td>
                <td style={{ padding: '13px 14px', fontSize: '12px', fontFamily: MONO, color: 'var(--gray-600)' }}>{t.lote}</td>
                <td style={{ padding: '13px 14px', fontSize: '12px', fontFamily: MONO, color: 'var(--gray-700)' }}>{t.qty}</td>
                <td style={{ padding: '13px 14px', fontSize: '12px', fontFamily: MONO, fontWeight: 500, color: t.oc === '—' ? 'var(--gray-400)' : 'var(--gray-900)' }}>{t.oc}</td>
                <td style={{ padding: '13px 14px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 500, background: t.eb, color: t.ec }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: t.ec, display: 'inline-block' }} />
                    {t.estado}
                  </span>
                </td>
                <td style={{ padding: '13px 14px', fontSize: '12px', color: 'var(--gray-500)' }}>{t.asignado}</td>
                <td style={{ padding: '13px 14px', fontSize: '12px', fontFamily: MONO, color: 'var(--gray-500)' }}>{t.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Layout>
  );
}
