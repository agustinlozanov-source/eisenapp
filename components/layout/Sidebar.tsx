import { useRouter } from 'next/router';
import Link from 'next/link';

const NAV = [
  { section: 'Principal', items: [
    { href: '/',            label: 'Dashboard',     icon: '▦' },
    { href: '/tickets',     label: 'Tickets',       icon: '📋', badge: 2 },
    { href: '/proyectos',   label: 'Proyectos',     icon: '🏗' },
    { href: '/clientes',    label: 'Clientes',      icon: '👥' },
  ]},
  { section: 'Operaciones', items: [
    { href: '/inspecciones',label: 'Inspecciones',  icon: '🔍' },
    { href: '/semanas',     label: 'Semanas',       icon: '📅', badge: 1 },
    { href: '/cumplimiento',label: 'Cumplimiento',  icon: '✅' },
  ]},
  { section: 'Finanzas', items: [
    { href: '/facturas',    label: 'Facturas',      icon: '🧾' },
    { href: '/pagos',       label: 'Pagos',         icon: '💳' },
  ]},
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside style={{
      width: '248px', minHeight: '100vh', background: 'var(--navy)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '-60px', left: '-60px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        padding: '22px 20px 18px', display: 'flex', alignItems: 'center',
        gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #F97316, #FB923C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', fontWeight: 800, color: 'white',
          boxShadow: '0 2px 8px rgba(249,115,22,0.35)',
        }}>E</div>
        <div>
          <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'white' }}>EISEN</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Quality Mgmt</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {NAV.map(group => (
          <div key={group.section} style={{ marginBottom: '4px' }}>
            <div style={{
              fontSize: '10px', fontWeight: 500, letterSpacing: '1px',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
              padding: '10px 10px 4px',
            }}>{group.section}</div>

            {group.items.map(item => {
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px', borderRadius: '6px', marginBottom: '1px',
                    position: 'relative', cursor: 'pointer',
                    background: isActive ? 'rgba(59,130,246,0.18)' : 'transparent',
                    transition: 'background 0.15s',
                  }}>
                    {isActive && (
                      <div style={{
                        position: 'absolute', left: 0, top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3px', height: '18px',
                        background: '#F97316', borderRadius: '0 2px 2px 0',
                      }} />
                    )}
                    <span style={{ fontSize: '15px', opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                    <span style={{
                      fontSize: '13.5px', flex: 1,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                    }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        fontSize: '10px', fontWeight: 600,
                        background: '#EF4444', color: 'white',
                        padding: '1px 6px', borderRadius: '10px', lineHeight: 1.6,
                      }}>{item.badge}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{
        padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 600, color: 'white',
        }}>EA</div>
        <div>
          <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>EISEN Admin</div>
          <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.35)' }}>Administrador</div>
        </div>
      </div>
    </aside>
  );
}
