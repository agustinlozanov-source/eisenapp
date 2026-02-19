import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const PROYECTOS = [
  { id: 'EM26-01', label: 'EM26-01 — Eurospec / Fisher Dynamics' },
  { id: 'RD26-01', label: 'RD26-01 — Ranger Die / Adient Matamoros' },
];
const SUPERVISORES = ['A. Serrano', 'O. Pech', 'J. Martínez'];
const TURNOS = ['Matutino', 'Vespertino', 'Nocturno'];
const DEFECTO_TIPOS = ['Missing Tab', 'Burr No Conformance', 'Metal Split', 'Dimensional', 'Surface Defect', 'Wrong Part', 'Otro'];

type Defecto = { tipo: string; cantidad: string };

type FormData = {
  proyecto: string;
  fecha: string;
  turno: string;
  supervisor: string;
  total: string;
  ok: string;
  notas: string;
};

const hoy = new Date().toISOString().split('T')[0];

const EMPTY: FormData = {
  proyecto: '', fecha: hoy, turno: '', supervisor: '', total: '', ok: '', notas: '',
};

export default function NuevaInspeccion() {
  const router = useRouter();
  const [form, setForm]       = useState<FormData>(EMPTY);
  const [defectos, setDefectos] = useState<Defecto[]>([{ tipo: '', cantidad: '' }]);
  const [errors, setErrors]   = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState(1);

  const set = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const nok = defectos.reduce((acc, d) => acc + (parseInt(d.cantidad) || 0), 0);
  const tasaNok = form.total && parseInt(form.total) > 0
    ? ((nok / parseInt(form.total)) * 100).toFixed(2) + '%'
    : '—';

  const addDefecto = () => setDefectos(prev => [...prev, { tipo: '', cantidad: '' }]);
  const removeDefecto = (i: number) => setDefectos(prev => prev.filter((_, idx) => idx !== i));
  const setDefecto = (i: number, field: keyof Defecto, value: string) => {
    setDefectos(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: value } : d));
  };

  const validateStep1 = () => {
    const e: Partial<FormData> = {};
    if (!form.proyecto)   e.proyecto   = 'Requerido';
    if (!form.fecha)      e.fecha      = 'Requerido';
    if (!form.turno)      e.turno      = 'Requerido';
    if (!form.supervisor) e.supervisor = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<FormData> = {};
    if (!form.total) e.total = 'Requerido';
    if (!form.ok)    e.ok    = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'inspecciones'), { ...form, creadoEn: new Date().toISOString() });
      setLoading(false);
      router.push('/inspecciones');
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const inputStyle = (field?: keyof FormData) => ({
    width: '100%', padding: '9px 12px',
    border: `1.5px solid ${field && errors[field] ? '#EF4444' : 'var(--gray-200)'}`,
    borderRadius: '7px', fontSize: '13.5px', color: 'var(--gray-800)',
    outline: 'none', boxSizing: 'border-box' as const,
    background: 'white', fontFamily: 'inherit',
  });

  const selectStyle = (field?: keyof FormData) => ({
    ...inputStyle(field),
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px',
  });

  const labelStyle = { display: 'block' as const, fontSize: '12px', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '5px' };
  const errorStyle = { fontSize: '11px', color: '#EF4444', marginTop: '3px' };

  return (
    <Layout title="Nueva Inspección">
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          {[
            { n: 1, label: 'Datos Generales' },
            { n: 2, label: 'Conteos & Defectos' },
            { n: 3, label: 'Confirmar' },
          ].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: step > s.n ? 'pointer' : 'default' }}
                onClick={() => { if (step > s.n) setStep(s.n); }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700,
                  background: step > s.n ? '#10B981' : step === s.n ? '#F97316' : 'var(--gray-200)',
                  color: step >= s.n ? 'white' : 'var(--gray-500)',
                }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: step === s.n ? 600 : 400, color: step === s.n ? 'var(--gray-900)' : 'var(--gray-400)', whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '1px', background: step > s.n ? '#10B981' : 'var(--gray-200)', margin: '0 12px' }} />}
            </div>
          ))}
        </div>

        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Datos Generales</div>
              <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>Proyecto, fecha y supervisor</div>

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
                  <label style={labelStyle}>Fecha *</label>
                  <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} style={inputStyle('fecha')} />
                  {errors.fecha && <div style={errorStyle}>{errors.fecha}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Turno *</label>
                  <select value={form.turno} onChange={e => set('turno', e.target.value)} style={selectStyle('turno')}>
                    <option value="">Seleccionar turno</option>
                    {TURNOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.turno && <div style={errorStyle}>{errors.turno}</div>}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Supervisor *</label>
                  <select value={form.supervisor} onChange={e => set('supervisor', e.target.value)} style={selectStyle('supervisor')}>
                    <option value="">Asignar supervisor</option>
                    {SUPERVISORES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.supervisor && <div style={errorStyle}>{errors.supervisor}</div>}
                </div>

              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Conteos & Defectos</div>
              <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>Piezas inspeccionadas y defectos encontrados</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Total Inspeccionadas *</label>
                  <input type="number" value={form.total} onChange={e => set('total', e.target.value)} placeholder="1944" style={{ ...inputStyle('total'), fontFamily: MONO }} />
                  {errors.total && <div style={errorStyle}>{errors.total}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Piezas OK *</label>
                  <input type="number" value={form.ok} onChange={e => set('ok', e.target.value)} placeholder="1900" style={{ ...inputStyle('ok'), fontFamily: MONO }} />
                  {errors.ok && <div style={errorStyle}>{errors.ok}</div>}
                </div>
              </div>

              {/* NOK preview */}
              {form.total && form.ok && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ background: nok > 0 ? '#FEF2F2' : '#F0FDF4', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '4px' }}>NOK</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: nok > 0 ? '#EF4444' : '#10B981', fontFamily: MONO }}>{nok}</div>
                  </div>
                  <div style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '4px' }}>Tasa NOK</div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: parseFloat(tasaNok) > 3 ? '#EF4444' : parseFloat(tasaNok) > 1 ? '#F59E0B' : '#10B981', fontFamily: MONO }}>{tasaNok}</div>
                  </div>
                </div>
              )}

              {/* Defectos */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Defectos Encontrados</label>
                  <button onClick={addDefecto} style={{ fontSize: '12px', padding: '4px 10px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '6px', color: 'var(--gray-600)', cursor: 'pointer' }}>
                    + Agregar
                  </button>
                </div>
                {defectos.map((d, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 32px', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <select value={d.tipo} onChange={e => setDefecto(i, 'tipo', e.target.value)} style={selectStyle()}>
                      <option value="">Tipo de defecto</option>
                      {DEFECTO_TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input type="number" value={d.cantidad} onChange={e => setDefecto(i, 'cantidad', e.target.value)} placeholder="Cant." style={{ ...inputStyle(), fontFamily: MONO }} />
                    <button onClick={() => removeDefecto(i)} style={{ width: '32px', height: '36px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', color: '#EF4444', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>Notas</label>
                <textarea value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Observaciones del turno, condiciones especiales..." rows={3} style={{ ...inputStyle(), resize: 'vertical', lineHeight: 1.5 }} />
              </div>
            </>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Confirmar Inspección</div>
              <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>Revisa los datos antes de guardar</div>

              <div style={{ background: 'var(--gray-50)', borderRadius: '10px', padding: '16px 20px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--gray-400)', marginBottom: '14px' }}>Resumen</div>
                {[
                  { label: 'Proyecto',    value: form.proyecto, mono: true },
                  { label: 'Fecha',       value: form.fecha, mono: true },
                  { label: 'Turno',       value: form.turno },
                  { label: 'Supervisor',  value: form.supervisor },
                  { label: 'Total',       value: `${parseInt(form.total || '0').toLocaleString()} pzas` },
                  { label: 'OK',          value: `${parseInt(form.ok || '0').toLocaleString()} pzas` },
                  { label: 'NOK',         value: `${nok} pzas` },
                  { label: 'Tasa NOK',    value: tasaNok, mono: true },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--gray-200)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{f.label}</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-800)', fontFamily: f.mono ? MONO : 'inherit' }}>{f.value}</span>
                  </div>
                ))}
              </div>

              {defectos.filter(d => d.tipo).length > 0 && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Defectos</div>
                  {defectos.filter(d => d.tipo).map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12.5px', color: '#7F1D1D' }}>{d.tipo}</span>
                      <span style={{ fontFamily: MONO, fontSize: '12.5px', fontWeight: 700, color: '#EF4444' }}>{d.cantidad}</span>
                    </div>
                  ))}
                </div>
              )}

              {form.notas && (
                <div style={{ background: 'var(--gray-50)', borderRadius: '6px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', marginBottom: '4px' }}>Notas</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--gray-700)' }}>{form.notas}</div>
                </div>
              )}
            </>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--gray-100)' }}>
            <button onClick={() => step > 1 ? setStep(step - 1) : router.push('/inspecciones')} style={{ padding: '9px 18px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '7px', fontSize: '13.5px', color: 'var(--gray-600)', cursor: 'pointer' }}>
              {step > 1 ? '← Atrás' : 'Cancelar'}
            </button>
            {step < 3 ? (
              <button onClick={handleNext} style={{ padding: '9px 24px', background: '#F97316', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>
                Siguiente →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} style={{ padding: '9px 24px', background: loading ? 'var(--gray-400)' : '#059669', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13.5px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Guardando...' : '✓ Guardar Inspección'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
