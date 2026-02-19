import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

const PAISES = ['Canada', 'USA', 'Mexico', 'Otro'];

type FormData = {
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  pais: string;
  planta: string;
  ciudad: string;
  direccion: string;
  notas: string;
};

const EMPTY: FormData = {
  nombre: '', contacto: '', email: '', telefono: '',
  pais: '', planta: '', ciudad: '', direccion: '', notas: '',
};

export default function NuevoCliente() {
  const router = useRouter();
  const [form, setForm]     = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.nombre)   e.nombre   = 'Requerido';
    if (!form.contacto) e.contacto = 'Requerido';
    if (!form.email)    e.email    = 'Requerido';
    if (!form.pais)     e.pais     = 'Requerido';
    if (!form.planta)   e.planta   = 'Requerido';
    if (!form.ciudad)   e.ciudad   = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'clientes'), { ...form, creadoEn: new Date().toISOString() });
      setLoading(false);
      router.push('/clientes');
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
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px',
  });

  const labelStyle = { display: 'block' as const, fontSize: '12px', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '5px' };
  const errorStyle = { fontSize: '11px', color: '#EF4444', marginTop: '3px' };

  return (
    <Layout title="Nuevo Cliente">
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Datos del Cliente</div>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>Información de contacto y planta</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* Nombre */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Nombre de la Empresa *</label>
              <input value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Eurospec Mfg." style={inputStyle('nombre')} />
              {errors.nombre && <div style={errorStyle}>{errors.nombre}</div>}
            </div>

            {/* Contacto */}
            <div>
              <label style={labelStyle}>Nombre del Contacto *</label>
              <input value={form.contacto} onChange={e => set('contacto', e.target.value)} placeholder="James Whitfield" style={inputStyle('contacto')} />
              {errors.contacto && <div style={errorStyle}>{errors.contacto}</div>}
            </div>

            {/* País */}
            <div>
              <label style={labelStyle}>País *</label>
              <select value={form.pais} onChange={e => set('pais', e.target.value)} style={selectStyle('pais')}>
                <option value="">Seleccionar país</option>
                {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.pais && <div style={errorStyle}>{errors.pais}</div>}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="j.whitfield@eurospec.com" style={{ ...inputStyle('email'), fontFamily: MONO }} />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>

            {/* Teléfono */}
            <div>
              <label style={labelStyle}>Teléfono</label>
              <input value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+1 519 555 0142" style={{ ...inputStyle('telefono'), fontFamily: MONO }} />
            </div>

            {/* Separador */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--gray-100)', paddingTop: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Planta</div>
            </div>

            {/* Nombre planta */}
            <div>
              <label style={labelStyle}>Nombre de la Planta *</label>
              <input value={form.planta} onChange={e => set('planta', e.target.value)} placeholder="Fisher Dynamics" style={inputStyle('planta')} />
              {errors.planta && <div style={errorStyle}>{errors.planta}</div>}
            </div>

            {/* Ciudad */}
            <div>
              <label style={labelStyle}>Ciudad *</label>
              <input value={form.ciudad} onChange={e => set('ciudad', e.target.value)} placeholder="Newmarket, ON" style={inputStyle('ciudad')} />
              {errors.ciudad && <div style={errorStyle}>{errors.ciudad}</div>}
            </div>

            {/* Dirección */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Dirección</label>
              <input value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="123 Industrial Dr, Newmarket, ON L3Y 7B3" style={inputStyle('direccion')} />
            </div>

            {/* Notas */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notas</label>
              <textarea value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Información adicional, condiciones especiales de contrato..." rows={3} style={{ ...inputStyle('notas'), resize: 'vertical', lineHeight: 1.5 }} />
            </div>

          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--gray-100)' }}>
            <button onClick={() => router.push('/clientes')} style={{ padding: '9px 18px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '7px', fontSize: '13.5px', color: 'var(--gray-600)', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={loading} style={{ padding: '9px 24px', background: loading ? 'var(--gray-400)' : 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13.5px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Guardando...' : '✓ Crear Cliente'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
