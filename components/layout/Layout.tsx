import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'EISEN' }: LayoutProps) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          height: '60px', background: 'var(--white)',
          borderBottom: '1px solid var(--gray-200)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: '16px', flexShrink: 0,
        }}>
          <div style={{ flex: 1, fontSize: '17px', fontWeight: 700, color: 'var(--gray-900)', letterSpacing: '-0.2px' }}>
            {title}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--gray-100)', border: '1px solid var(--gray-200)',
            borderRadius: '6px', padding: '6px 12px', width: '220px',
          }}>
            <span style={{ color: 'var(--gray-400)', fontSize: '13px' }}>🔍</span>
            <input
              placeholder="Buscar ticket, cliente..."
              style={{
                border: 'none', background: 'transparent',
                fontSize: '13px', color: 'var(--gray-700)',
                outline: 'none', flex: 1,
              }}
            />
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', background: 'var(--gray-900)',
            color: 'white', border: 'none', borderRadius: '6px',
            fontSize: '13px', fontWeight: 500,
          }}>
            + Nuevo Ticket
          </button>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
