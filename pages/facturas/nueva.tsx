import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const PROYECTOS = [
  { id: 'EM26-01', label: 'EM26-01 — Eurospec / Fisher Dynamics', tarifa: 40 },
  { id: 'RD26-01', label: 'RD26-01 — Ranger Die / Adient Matamoros', tarifa: 40 },
];

const SEMANAS = [
  { id: 'SEM-07-EM', label: 'Sem 07 — EM26-01 — Fisher Dynamics', horas: 40, proyecto: 'EM26-01' },
  { id: 'SEM-07-RD', label: 'Sem 07 — RD26-01 — Adient Matamoros', horas: 40, proyecto: 'RD26-01' },
  { id: 'SEM-06-EM', label: 'Sem 06 — EM26-01 — Fisher Dynamics', horas: 40, proyecto: 'EM26-01' },
];

type FormData = {
  proyecto: string;
  semana: string;
  fechaEmision: string;
  diasCredito: string;
  horas: string;
  tarifa: string;
  oc: string;
  notas: string;
};

const hoy = new Date().toISOString().split('T')[0];

const EMPTY: FormData = {
  proyecto: '', semana: '', fechaEmision: hoy,
  diasCredito: '30', horas: '', tarifa: '$40', oc: '', notas: '',
};

export default function NuevaFactura() {
  const router = useRouter();
  const [form, setForm]       = useState<FormData>(EMPTY);
  const [errors, setErrors]   = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));

    // Auto-fill horas when semana selected
    if (field === 'semana') {
      const sem = SEMANAS.find(s => s.id === value);
      if (sem) setForm(prev => ({ ...prev, semana: value, horas: sem.horas.toString() }));
    }

    // Auto-fill tarifa when proyecto selected
    if (field === 'proyecto') {
      const proy = PROYECTOS.find(p => p.id === value);
      if (proy) setForm(prev => ({ ...prev, proyecto: value, tarifa: `$${proy.tarifa}` }));
    }
  };

  const tarifaNum = parseFloat(form.tarifa.replace('$', '')) || 0;
  const horasNum  = parseFloat(form.horas) || 0;
  const subtotal  = tarifaNum * horasNum;

  const fechaVencimiento = () => {
    if (!form.fechaEmision || !form.diasCredito) return '—';
    const d = new Date(form.fechaEmision);
    d.setDate(d.getDate() + parseInt(form.diasCredito));
    return d.toISOString().split('T')[0];
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.proyecto)     e.proyecto     = 'Requerido';
    if (!form.semana)       e.semana       = 'Requerido';
    if (!form.fechaEmision) e.fechaEmision = 'Requerido';
    if (!form.horas)        e.horas        = 'Requerido';
    if (!form.tarifa)       e.tarifa       = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    router.push('/facturas');
  };

  const inputStyle = (field: keyof FormData) => ({
    width: '100%', padding: '9px 12px',
    border: `1.5px solid ${errors[field] ? '#EF4444' : 'var(--gray-200)'}`,
    borderRadius: '7px', fontSize: '13.5px', color: 'var(--gray-800)',
    outline: 'none', boxSizing: 'border-box' as const,
    background: 'white', fontFamily: 'inherit',
  });

  const selectStyle = (field: keyof FormData) => ({
    ...inputStyle(field),
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px',
  });

  const labelStyle = { display: 'block' as const, fontSize: '12px', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '5px' };
  const errorStyle = { fontSize: '11px', color: '#EF4444', marginTop: '3px' };

  return (
    <Layout title="Nueva Factura">
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Nueva Factura</div>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>Genera una factura a partir de una semana completada</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Proyecto *</label>
              <select value={form.proyecto} onChange={e => set('proyecto', e.target.value)} style={selectStyle('proyecto')}>
                <option value="">Seleccionar proyecto</option>
                {PROYECTOS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              {errors.proyecto && <div style={errorStyle}>{errors.proyecto}</div>}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Semana *</label>
              <select value={form.semana} onChange={e => set('semana', e.target.value)} style={selectStyle('semana')}>
                <option value="">Seleccionar semana</option>
                {SEMANAS.filter(s => !form.proyecto || s.proyecto === form.proyecto).map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              {errors.semana && <div style={errorStyle}>{errors.semana}</div>}
            </div>

            <div>
              <label style={labelStyle}>Fecha de Emisión *</label>
              <input type="date" value={form.fechaEmision} onChange={e => set('fechaEmision', e.target.value)} style={inputStyle('fechaEmision')} />
              {errors.fechaEmision && <div style={errorStyle}>{errors.fechaEmision}</div>}
            </div>

            <div>
              <label style={labelStyle}>Días de Crédito</label>
              <select value={form.diasCredito} onChange={e => set('diasCredito', e.target.value)} style={selectStyle('diasCredito')}>
                {['15','30','45','60','90'].map(d => <option key={d} value={d}>{d} días</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Horas Trabajadas *</label>
              <input type="number" value={form.horas} onChange={e => set('horas', e.target.value)} placeholder="40" style={{ ...inputStyle('horas'), fontFamily: MONO }} />
              {errors.horas && <div style={errorStyle}>{errors.horas}</div>}
            </div>

            <div>
              <label style={labelStyle}>Tarifa por Hora *</label>
              <input value={form.tarifa} onChange={e => set('tarifa', e.target.value)} placeholder="$40" style={{ ...inputStyle('tarifa'), fontFamily: MONO }} />
              {errors.tarifa && <div style={errorStyle}>{errors.tarifa}</div>}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>OC / Purchase Order</label>
              <input value={form.oc} onChange={e => set('oc', e.target.value)} placeholder="PO-31764 (opcional)" style={{ ...inputStyle('oc'), fontFamily: MONO }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notas</label>
              <textarea value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Notas para la factura..." rows={2} style={{ ...inputStyle('notas'), resize: 'vertical', lineHeight: 1.5 }} />
            </div>

          </div>

          {/* Preview total */}
          {subtotal > 0 && (
            <div style={{ marginTop: '20px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '16px 20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--gray-400)', marginBottom: '12px' }}>Resumen</div>
              {[
                { label: 'Horas',       value: `${horasNum} hrs` },
                { label: 'Tarifa',      value: form.tarifa },
                { label: 'Vencimiento', value: fechaVencimiento() },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--gray-500)' }}>{f.label}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-700)', fontFamily: MONO }}>{f.value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)' }}>Total</span>
                <span style={{ fontFamily: MONO, fontSize: '22px', fontWeight: 700, color: '#059669' }}>${subtotal.toLocaleString()}.00</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--gray-100)' }}>
            <button onClick={() => router.push('/facturas')} style={{ padding: '9px 18px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '7px', fontSize: '13.5px', color: 'var(--gray-600)', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={loading} style={{ padding: '9px 24px', background: loading ? 'var(--gray-400)' : '#059669', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13.5px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Creando...' : '✓ Crear Factura'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
