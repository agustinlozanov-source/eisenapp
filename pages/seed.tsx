import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const TICKETS = [
  {
    id: 'EM26-01',
    cliente: 'Eurospec Mfg.',
    contacto: 'James Whitfield',
    planta: 'Fisher Dynamics',
    ciudad: 'Newmarket, ON',
    issue: 'Missing Tabs — Mal Troquelado',
    descripcion: 'Piezas con tabs faltantes detectadas en línea de producción. Cliente requiere inspección 100% del lote en planta.',
    parte: '195364',
    lote: '02226',
    qty: '9,720',
    oc: '',
    estado: 'En Proceso',
    asignado: 'A. Serrano',
    fecha: '2026-02-10',
    semana: 'Sem 07',
    tarifa: '$40/hr',
  },
  {
    id: 'RD26-01',
    cliente: 'Ranger Die Inc.',
    contacto: 'Bob Ranger',
    planta: 'Adient',
    ciudad: 'Matamoros, MX',
    issue: 'Metal Split — Bkt Reinforcement',
    descripcion: 'Metal split encontrado en bracket de refuerzo. Lote completo en warehouse pendiente de disposición.',
    parte: '3232903',
    lote: '32825',
    qty: '6,290',
    oc: 'PO-31764',
    estado: 'En Espera',
    asignado: 'O. Pech',
    fecha: '2026-02-12',
    semana: 'Sem 07',
    tarifa: '$40/hr',
  },
];

const CLIENTES = [
  {
    id: 'CLI-001',
    nombre: 'Eurospec Mfg.',
    contacto: 'James Whitfield',
    email: 'j.whitfield@eurospec.com',
    telefono: '+1 519 555 0142',
    planta: 'Fisher Dynamics',
    ciudad: 'Newmarket, ON',
    pais: 'Canada',
    estado: 'Activo',
  },
  {
    id: 'CLI-002',
    nombre: 'Ranger Die Inc.',
    contacto: 'Bob Ranger',
    email: 'b.ranger@rangerdie.com',
    telefono: '+1 519 555 0198',
    planta: 'Adient',
    ciudad: 'Matamoros, MX',
    pais: 'Mexico',
    estado: 'Activo',
  },
];

const SEMANAS = [
  { id: 'SEM-07-EM', proyecto: 'EM26-01', cliente: 'Eurospec Mfg.', planta: 'Fisher Dynamics', semana: 'Sem 07', fechaInicio: '2026-02-09', fechaFin: '2026-02-14', supervisor: 'A. Serrano', dias: 5, horas: 40, tarifa: '$40', total: 1600, estado: 'Lista para Facturar', pod: true, reporte: true, firma: true, oc: true },
  { id: 'SEM-06-EM', proyecto: 'EM26-01', cliente: 'Eurospec Mfg.', planta: 'Fisher Dynamics', semana: 'Sem 06', fechaInicio: '2026-02-02', fechaFin: '2026-02-07', supervisor: 'A. Serrano', dias: 5, horas: 40, tarifa: '$40', total: 1600, estado: 'Facturada', pod: true, reporte: true, firma: true, oc: true },
];

const INSPECCIONES = [
  { id: 'INS-001', proyecto: 'EM26-01', cliente: 'Eurospec Mfg.', planta: 'Fisher Dynamics', fecha: '2026-02-14', supervisor: 'A. Serrano', turno: 'Matutino', total: 1944, ok: 1900, nok: 44, tasaNok: '2.26%', firma: true, semana: 'Sem 07' },
  { id: 'INS-002', proyecto: 'EM26-01', cliente: 'Eurospec Mfg.', planta: 'Fisher Dynamics', fecha: '2026-02-13', supervisor: 'A. Serrano', turno: 'Matutino', total: 1920, ok: 1915, nok: 5, tasaNok: '0.26%', firma: true, semana: 'Sem 07' },
];

const FACTURAS = [
  { id: 'FAC-001', proyecto: 'EM26-01', cliente: 'Eurospec Mfg.', semana: 'Sem 06', fechaEmision: '2026-02-10', fechaVencimiento: '2026-03-11', horas: 40, tarifa: '$40', total: 1600, estado: 'Enviada', oc: 'PO-31764' },
];

const PAGOS = [
  { id: 'PAG-001', factura: 'FAC-001', cliente: 'Eurospec Mfg.', proyecto: 'EM26-01', monto: 1600, fechaEsperada: '2026-03-11', estado: 'Pendiente', metodo: 'Wire Transfer' },
];

export default function Seed() {
  const [log, setLog]       = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const runSeed = async () => {
    setLoading(true);
    setLog([]);

    try {
      // Seed tickets
      addLog('Creando tickets...');
      for (const ticket of TICKETS) {
        await setDoc(doc(db, 'tickets', ticket.id), ticket);
        addLog(`✓ Ticket ${ticket.id} — ${ticket.cliente}`);
      }

      // Seed clientes
      addLog('Creando clientes...');
      for (const cliente of CLIENTES) {
        await setDoc(doc(db, 'clientes', cliente.id), cliente);
        addLog(`✓ Cliente ${cliente.id} — ${cliente.nombre}`);
      }

      // Seed semanas
      addLog('Creando semanas...');
      for (const semana of SEMANAS) {
        await setDoc(doc(db, 'semanas', semana.id), semana);
        addLog(`✓ Semana ${semana.id} — ${semana.semana}`);
      }

      // Seed inspecciones
      addLog('Creando inspecciones...');
      for (const inspeccion of INSPECCIONES) {
        await setDoc(doc(db, 'inspecciones', inspeccion.id), inspeccion);
        addLog(`✓ Inspección ${inspeccion.id} — ${inspeccion.fecha}`);
      }

      // Seed facturas
      addLog('Creando facturas...');
      for (const factura of FACTURAS) {
        await setDoc(doc(db, 'facturas', factura.id), factura);
        addLog(`✓ Factura ${factura.id} — ${factura.cliente}`);
      }

      // Seed pagos
      addLog('Creando pagos...');
      for (const pago of PAGOS) {
        await setDoc(doc(db, 'pagos', pago.id), pago);
        addLog(`✓ Pago ${pago.id} — ${pago.cliente}`);
      }

      addLog('');
      addLog('✅ Seed completado. Firestore tiene datos.');
      setDone(true);
    } catch (err: any) {
      addLog(`❌ Error: ${err.message}`);
    }

    setLoading(false);
  };

  const MONO = "ui-monospace, 'SF Mono', monospace";

  return (
    <Layout title="Seed — Poblar Firestore">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>Seed de Datos</div>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>
            Crea los documentos iniciales en Firestore. Solo necesitas correr esto una vez.
          </div>

          <div style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Se crearán:</div>
            <div style={{ fontSize: '13px', color: 'var(--gray-700)', marginBottom: '4px' }}>• {TICKETS.length} tickets</div>
            <div style={{ fontSize: '13px', color: 'var(--gray-700)', marginBottom: '4px' }}>• {CLIENTES.length} clientes</div>
            <div style={{ fontSize: '13px', color: 'var(--gray-700)', marginBottom: '4px' }}>• {SEMANAS.length} semanas</div>
            <div style={{ fontSize: '13px', color: 'var(--gray-700)', marginBottom: '4px' }}>• {INSPECCIONES.length} inspecciones</div>
            <div style={{ fontSize: '13px', color: 'var(--gray-700)', marginBottom: '4px' }}>• {FACTURAS.length} facturas</div>
            <div style={{ fontSize: '13px', color: 'var(--gray-700)' }}>• {PAGOS.length} pagos</div>
          </div>

          {!done && (
            <button
              onClick={runSeed}
              disabled={loading}
              style={{
                width: '100%', padding: '10px',
                background: loading ? 'var(--gray-400)' : '#F97316',
                color: 'white', border: 'none', borderRadius: '7px',
                fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
              }}>
              {loading ? 'Cargando datos...' : '▶ Ejecutar Seed'}
            </button>
          )}

          {log.length > 0 && (
            <div style={{ background: '#0F172A', borderRadius: '8px', padding: '14px 16px', fontFamily: MONO, fontSize: '12.5px', lineHeight: 1.7 }}>
              {log.map((line, i) => (
                <div key={i} style={{ color: line.startsWith('✅') ? '#4ADE80' : line.startsWith('❌') ? '#F87171' : line.startsWith('✓') ? '#86EFAC' : '#94A3B8' }}>
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          )}

          {done && (
            <div style={{ marginTop: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#065F46' }}>
              ✅ Listo. Ahora puedes ir a <strong>/tickets</strong>, <strong>/clientes</strong>, <strong>/semanas</strong>, <strong>/inspecciones</strong>, <strong>/facturas</strong> y <strong>/pagos</strong> para ver los datos reales.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
