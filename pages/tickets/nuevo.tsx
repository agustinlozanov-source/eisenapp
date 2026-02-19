import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const CLIENTES = ['Eurospec Mfg.', 'Ranger Die Inc.'];
const PLANTAS: Record<string, string[]> = {
  'Eurospec Mfg.':    ['Fisher Dynamics — Newmarket, ON', 'Fisher Dynamics — Stratford, ON'],
  'Ranger Die Inc.':  ['Adient — Matamoros, MX', 'Adient — Querétaro, MX'],
};
const SUPERVISORES = ['A. Serrano', 'O. Pech', 'J. Martínez'];
const TURNOS = ['Matutino', 'Vespertino', 'Nocturno'];
const DEFECTOS = ['Missing Tab', 'Burr No Conformance', 'Metal Split', 'Dimensional', 'Surface Defect', 'Wrong Part', 'Otro'];

type FormData = {
  cliente: string;
  planta: string;
  parte: string;
  lote: string;
  qty: string;
  issue: string;
  descripcion: string;
  defecto: string;
  supervisor: string;
  turno: string;
  tarifa: string;
  oc: string;
  notas: string;
};

const EMPTY: FormData = {
  cliente: '', planta: '', parte: '', lote: '', qty: '',
  issue: '', descripcion: '', defecto: '', supervisor: '',
  turno: '', tarifa: '$40', oc: '', notas: '',
};

export default function NuevoTicket() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const set = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    if (field === 'cliente') setForm(prev => ({ ...prev, cliente: value, planta: '' }));
  };

  const validateStep1 = () => {
    const e: Partial<FormData> = {};
    if (!form.cliente)     e.cliente = 'Requerido';
    if (!form.planta)      e.planta  = 'Requerido';
    if (!form.parte)       e.parte   = 'Requerido';
    if (!form.lote)        e.lote    = 'Requerido';
    if (!form.qty)         e.qty     = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<FormData> = {};
    if (!form.issue)       e.issue      = 'Requerido';
    if (!form.defecto)     e.defecto    = 'Requerido';
    if (!form.supervisor)  e.supervisor = 'Requerido';
    if (!form.turno)       e.turno      = 'Requerido';
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
      await addDoc(collection(db, 'tickets'), { ...form, creadoEn: new Date().toISOString() });
      setLoading(false);
      router.push('/tickets');
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
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
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '36px',
  });

  const labelStyle = {
    display: 'block' as const, fontSize: '12px', fontWeight: 500,
    color: 'var(--gray-700)', marginBottom: '5px',
  };

  const errorStyle = { fontSize: '11px', color: '#EF4444', marginTop: '3px' };

  return (
    <Layout title="Nuevo Ticket">
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px', gap: '0' }}>
          {[
            { n: 1, label: 'Cliente & Parte' },
            { n: 2, label: 'Issue & Operación' },
            { n: 3, label: 'Confirmar' },
          ].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: step > s.n ? 'pointer' : 'default' }}
                onClick={() => { if (step > s.n) setStep(s.n); }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700,
                  background: step > s.n ? '#10B981' : step === s.n ? 'var(--gray-900)' : 'var(--gray-200)',
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

        {/* Card */}
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Cliente & Parte</div>
              <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>Datos del cliente y la pieza afectada</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Cliente *</label>
                  <select value={form.cliente} onChange={e => set('cliente', e.target.value)} style={selectStyle('cliente')}>
                    <option value="">Seleccionar cliente</option>
                    {CLIENTES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.cliente && <div style={errorStyle}>{errors.cliente}</div>}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Planta *</label>
                  <select value={form.planta} onChange={e => set('planta', e.target.value)} style={selectStyle('planta')} disabled={!form.cliente}>
                    <option value="">Seleccionar planta</option>
                    {(PLANTAS[form.cliente] || []).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.planta && <div style={errorStyle}>{errors.planta}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Número de Parte *</label>
                  <input value={form.parte} onChange={e => set('parte', e.target.value)} placeholder="195364" style={{ ...inputStyle('parte'), fontFamily: MONO }} />
                  {errors.parte && <div style={errorStyle}>{errors.parte}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Lote *</label>
                  <input value={form.lote} onChange={e => set('lote', e.target.value)} placeholder="02226" style={{ ...inputStyle('lote'), fontFamily: MONO }} />
                  {errors.lote && <div style={errorStyle}>{errors.lote}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Cantidad en Lote *</label>
                  <input type="number" value={form.qty} onChange={e => set('qty', e.target.value)} placeholder="9720" style={inputStyle('qty')} />
                  {errors.qty && <div style={errorStyle}>{errors.qty}</div>}
                </div>

                <div>
                  <label style={labelStyle}>OC / Purchase Order</label>
                  <input value={form.oc} onChange={e => set('oc', e.target.value)} placeholder="PO-31764 (opcional)" style={{ ...inputStyle('oc'), fontFamily: MONO }} />
                </div>

              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Issue & Operación</div>
              <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>Descripción del defecto y datos del servicio</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Título del Issue *</label>
                  <input value={form.issue} onChange={e => set('issue', e.target.value)} placeholder="Missing Tabs — Mal Troquelado" style={inputStyle('issue')} />
                  {errors.issue && <div style={errorStyle}>{errors.issue}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Tipo de Defecto *</label>
                  <select value={form.defecto} onChange={e => set('defecto', e.target.value)} style={selectStyle('defecto')}>
                    <option value="">Seleccionar defecto</option>
                    {DEFECTOS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.defecto && <div style={errorStyle}>{errors.defecto}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Tarifa por Hora</label>
                  <input value={form.tarifa} onChange={e => set('tarifa', e.target.value)} placeholder="$40" style={{ ...inputStyle('tarifa'), fontFamily: MONO }} />
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
                  <label style={labelStyle}>Turno *</label>
                  <select value={form.turno} onChange={e => set('turno', e.target.value)} style={selectStyle('turno')}>
                    <option value="">Seleccionar turno</option>
                    {TURNOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.turno && <div style={errorStyle}>{errors.turno}</div>}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Descripción del Problema</label>
                  <textarea
                    value={form.descripcion}
                    onChange={e => set('descripcion', e.target.value)}
                    placeholder="Describe el defecto encontrado, condición del lote y acción requerida..."
                    rows={3}
                    style={{ ...inputStyle('descripcion'), resize: 'vertical', lineHeight: 1.5 }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Notas Adicionales</label>
                  <textarea
                    value={form.notas}
                    onChange={e => set('notas', e.target.value)}
                    placeholder="Notas internas, instrucciones especiales..."
                    rows={2}
                    style={{ ...inputStyle('notas'), resize: 'vertical', lineHeight: 1.5 }}
                  />
                </div>

              </div>
            </>
          )}

          {/* ── STEP 3 — Confirmar ── */}
          {step === 3 && (
            <>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Confirmar Ticket</div>
              <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>Revisa los datos antes de crear el ticket</div>

              <div style={{ background: 'var(--gray-50)', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--gray-400)', marginBottom: '14px' }}>Resumen</div>
                {[
                  { label: 'Cliente',    value: form.cliente },
                  { label: 'Planta',     value: form.planta },
                  { label: 'Parte',      value: form.parte,   mono: true },
                  { label: 'Lote',       value: form.lote,    mono: true },
                  { label: 'Cantidad',   value: `${form.qty} pzas` },
                  { label: 'Issue',      value: form.issue },
                  { label: 'Defecto',    value: form.defecto },
                  { label: 'Supervisor', value: form.supervisor },
                  { label: 'Turno',      value: form.turno },
                  { label: 'Tarifa',     value: form.tarifa,  mono: true },
                  ...(form.oc ? [{ label: 'OC', value: form.oc, mono: true }] : []),
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--gray-200)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{f.label}</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--gray-800)', fontFamily: f.mono ? MONO : 'inherit' }}>{f.value}</span>
                  </div>
                ))}
                {form.descripcion && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '4px' }}>Descripción</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--gray-700)', lineHeight: 1.5 }}>{form.descripcion}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--gray-100)' }}>
            <button
              onClick={() => step > 1 ? setStep(step - 1) : router.push('/tickets')}
              style={{ padding: '9px 18px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '7px', fontSize: '13.5px', color: 'var(--gray-600)', cursor: 'pointer' }}
            >
              {step > 1 ? '← Atrás' : 'Cancelar'}
            </button>

            {step < 3 ? (
              <button onClick={handleNext} style={{ padding: '9px 24px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>
                Siguiente →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} style={{ padding: '9px 24px', background: loading ? 'var(--gray-400)' : '#F97316', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13.5px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Creando...' : '✓ Crear Ticket'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
