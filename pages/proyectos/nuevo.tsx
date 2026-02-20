import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const MONO = "ui-monospace, 'SF Mono', 'Cascadia Code', monospace";

export default function NuevoProyecto() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: '',
    cliente: '',
    planta: '',
    ciudad: '',
    parte: '',
    lote: '',
    cantidad: '',
    tarifa: '',
    supervisor: 'A. Serrano',
    notas: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.id || !form.cliente || !form.planta || !form.ciudad) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'proyectos'), {
        ...form,
        estado: 'Activo',
        ec: '#059669',
        eb: '#ECFDF5',
        creadoEn: new Date().toISOString(),
      });

      router.push('/proyectos');
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      alert('Error al crear proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Nuevo Proyecto">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '6px' }}>Nuevo Proyecto</div>
          <div style={{ fontSize: '14px', color: 'var(--gray-500)' }}>Registra un nuevo proyecto en el sistema</div>
        </div>

        {/* Form */}
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', overflow: 'hidden' }}>

          {/* Step 1: Info Básica */}
          {step === 1 && (
            <div style={{ padding: '30px' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '20px' }}>Información Básica</div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: '6px' }}>ID del Proyecto *</label>
                <input type="text" name="id" value={form.id} onChange={handleChange} placeholder="ej: EM26-01" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', fontFamily: MONO }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: '6px' }}>Cliente *</label>
                <input type="text" name="cliente" value={form.cliente} onChange={handleChange} placeholder="ej: Eurospec Mfg." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: '6px' }}>Planta *</label>
                <input type="text" name="planta" value={form.planta} onChange={handleChange} placeholder="ej: Fisher Dynamics" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: '6px' }}>Ciudad *</label>
                <input type="text" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="ej: Newmarket, ON" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => router.push('/proyectos')} style={{ flex: 1, padding: '10px', background: 'var(--gray-100)', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: 'var(--gray-600)' }}>
                  Cancelar
                </button>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: '10px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Detalles */}
          {step === 2 && (
            <div style={{ padding: '30px' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '20px' }}>Detalles del Proyecto</div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: '6px' }}>Parte</label>
                <input type="text" name="parte" value={form.parte} onChange={handleChange} placeholder="ej: 195364" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', fontFamily: MONO }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: '6px' }}>Lote</label>
                <input type="text" name="lote" value={form.lote} onChange={handleChange} placeholder="ej: 02226" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', fontFamily: MONO }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: '6px' }}>Cantidad</label>
                <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} placeholder="ej: 9720" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', fontFamily: MONO }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: '6px' }}>Tarifa</label>
                <input type="text" name="tarifa" value={form.tarifa} onChange={handleChange} placeholder="ej: $40/hr" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', fontFamily: MONO }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '10px', background: 'var(--gray-100)', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: 'var(--gray-600)' }}>
                  ← Anterior
                </button>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: '10px', background: 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Supervisor y Notas */}
          {step === 3 && (
            <div style={{ padding: '30px' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '20px' }}>Supervisor y Notas</div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: '6px' }}>Supervisor</label>
                <select name="supervisor" value={form.supervisor} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', background: 'white' }}>
                  <option value="A. Serrano">A. Serrano</option>
                  <option value="O. Pech">O. Pech</option>
                  <option value="J. Martínez">J. Martínez</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-600)', marginBottom: '6px' }}>Notas</label>
                <textarea name="notas" value={form.notas} onChange={handleChange} placeholder="Agrega notas adicionales..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', minHeight: '120px', fontFamily: 'inherit', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: '10px', background: 'var(--gray-100)', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: 'var(--gray-600)' }}>
                  ← Anterior
                </button>
                <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '10px', background: loading ? 'var(--gray-400)' : 'var(--gray-900)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Guardando...' : '✓ Guardar Proyecto'}
                </button>
              </div>
            </div>
          )}

          {/* Progress */}
          <div style={{ padding: '12px 30px', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)', display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ width: '8px', height: '8px', borderRadius: '50%', background: s <= step ? 'var(--gray-900)' : 'var(--gray-300)', transition: 'all 0.2s' }} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
