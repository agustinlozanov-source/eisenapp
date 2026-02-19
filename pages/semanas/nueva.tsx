import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const PROYECTOS = [
  { id: 'EM26-01', label: 'EM26-01 — Eurospec / Fisher Dynamics' },
  { id: 'RD26-01', label: 'RD26-01 — Ranger Die / Adient Matamoros' },
];
const SUPERVISORES = ['A. Serrano', 'O. Pech', 'J. Martínez'];

type FormData = {
  proyecto: string;
  numeroSemana: string;
  fechaInicio: string;
  fechaFin: string;
  supervisor: string;
  diasTrabajados: string;
  horasTotal: string;
  tarifa: string;
  notas: string;
};

const hoy = new Date().toISOString().split('T')[0];

const EMPTY: FormData = {
  proyecto: '', numeroSemana: '', fechaInicio: '', fechaFin: '',
  supervisor: '', diasTrabajados: '5', horasTotal: '40', tarifa: '$40', notas: '',
};

export default function NuevaSemana() {
  const router = useRouter();
  const [form, setForm]       = useState<FormData>(EMPTY);
  const [errors, setErrors]   = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const tarifaNum = parseFloat(form.tarifa.replace('$', '')) || 0;
  const horasNum  = parseFloat(form.horasTotal) || 0;
  const total     = tarifaNum * horasNum;

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.proyecto)      e.proyecto      = 'Requerido';
    if (!form.numeroSemana)  e.numeroSemana  = 'Requerido';
    if (!form.fechaInicio)   e.fechaInicio   = 'Requerido';
    if (!form.fechaFin)      e.fechaFin      = 'Requerido';
    if (!form.supervisor)    e.supervisor    = 'Requerido';
    if (!form.horasTotal)    e.horasTotal    = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    router.push('/semanas');
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
    <Layout title="Nueva Semana">
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Nueva Semana de Trabajo</div>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>Registra una semana para facturación posterior</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Proyecto *</label>
              <select value={form.proyecto} onChange={e => set('proyecto', e.target.value)} style={selectStyle('proyecto')}>
                <option value="">Seleccionar proyecto</option>
                {PROYECTOS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              {errors.proyecto && <div style={errorStyle}>{errors.proyecto}</div>}
            </div>

            <div>
              <label style={labelStyle}>Número de Semana *</label>
              <input value={form.numeroSemana} onChange={e => set('numeroSemana', e.target.value)} placeholder="08" style={{ ...inputStyle('numeroSemana'), fontFamily: MONO }} />
              {errors.numeroSemana && <div style={errorStyle}>{errors.numeroSemana}</div>}
            </div>

            <div>
              <label style={labelStyle}>Supervisor *</label>
              <select value={form.supervisor} onChange={e => set('supervisor', e.target.value)} style={selectStyle('supervisor')}>
                <option value="">Asignar supervisor</option>
                {SUPERVISORES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.supervisor && <div style={errorStyle}>{errors.supervisor}</div>}
            </div>

            <div>
              <label style={labelStyle}>Fecha Inicio *</label>
              <input type="date" value={form.fechaInicio} onChange={e => set('fechaInicio', e.target.value)} style={inputStyle('fechaInicio')} />
              {errors.fechaInicio && <div style={errorStyle}>{errors.fechaInicio}</div>}
            </div>

            <div>
              <label style={labelStyle}>Fecha Fin *</label>
              <input type="date" value={form.fechaFin} onChange={e => set('fechaFin', e.target.value)} style={inputStyle('fechaFin')} />
              {errors.fechaFin && <div style={errorStyle}>{errors.fechaFin}</div>}
            </div>

            <div>
              <label style={labelStyle}>Días Trabajados</label>
              <input type="number" value={form.diasTrabajados} onChange={e => set('diasTrabajados', e.target.value)} placeholder="5" style={inputStyle('diasTrabajados')} />
            </div>

            <div>
              <label style={labelStyle}>Horas Totales *</label>
              <input type="number" value={form.horasTotal} onChange={e => set('horasTotal', e.target.value)} placeholder="40" style={{ ...inputStyle('horasTotal'), fontFamily: MONO }} />
              {errors.horasTotal && <div style={errorStyle}>{errors.horasTotal}</div>}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Tarifa por Hora</label>
              <input value={form.tarifa} onChange={e => set('tarifa', e.target.value)} placeholder="$40" style={{ ...inputStyle('tarifa'), fontFamily: MONO }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notas</label>
              <textarea value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Observaciones de la semana..." rows={2} style={{ ...inputStyle('notas'), resize: 'vertical', lineHeight: 1.5 }} />
            </div>

          </div>

          {/* Preview */}
          {total > 0 && (
            <div style={{ marginTop: '20px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '16px 20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--gray-400)', marginBottom: '12px' }}>Resumen</div>
              {[
                { label: 'Proyecto',  value: form.proyecto },
                { label: 'Semana',    value: form.numeroSemana ? `Sem ${form.numeroSemana}` : '—' },
                { label: 'Días',      value: form.diasTrabajados },
                { label: 'Horas',     value: `${horasNum} hrs` },
                { label: 'Tarifa',    value: form.tarifa },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--gray-500)' }}>{f.label}</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-700)', fontFamily: MONO }}>{f.value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)' }}>Total a Facturar</span>
                <span style={{ fontFamily: MONO, fontSize: '22px', fontWeight: 700, color: '#3B82F6' }}>${total.toLocaleString()}.00</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--gray-100)' }}>
            <button onClick={() => router.push('/semanas')} style={{ padding: '9px 18px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '7px', fontSize: '13.5px', color: 'var(--gray-600)', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={loading} style={{ padding: '9px 24px', background: loading ? 'var(--gray-400)' : 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13.5px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Guardando...' : '✓ Crear Semana'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
