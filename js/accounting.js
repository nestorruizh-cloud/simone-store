// =========================================================================
// SIMONE STORE — ERP DE CONTABILIDAD, INVENTARIOS, COSTEO, CARTERA Y RIFAS
// Pre-cargado con el histórico real del Excel de Simone (Andrea & Leonor)
// =========================================================================

const ERP_STORAGE_KEY = 'simone_accounting_erp_v1';

function fmtCOP(val) {
  const n = Math.round(Number(val) || 0);
  if (n < 0) return '-$' + Math.abs(n).toLocaleString('es-CO');
  return '$' + n.toLocaleString('es-CO');
}

// -------------------------------------------------------------------------
// 1. BASE DE DATOS INICIAL (EXTRAÍDA EXACTAMENTE DEL EXCEL DE SIMONE)
// -------------------------------------------------------------------------
function getInitialERPDatabase() {
  return {
    // HOJA 4: LIBRO MAYOR / FLUJO DE CAJA GENERAL (60 movimientos reales, saldo final $391.300)
    cajaGeneral: [
      { id: 'cj-1', fecha: '2026-06-15', descripcion: 'VENTAS VARIAS', categoria: 'Ingreso Venta', debe: 232400, haber: 0 },
      { id: 'cj-2', fecha: '2026-06-15', descripcion: 'VENTAS FERIA', categoria: 'Ingreso Venta', debe: 291000, haber: 0 },
      { id: 'cj-3', fecha: '2026-06-15', descripcion: 'VENTAS ANDREA', categoria: 'Ingreso Venta', debe: 270000, haber: 0 },
      { id: 'cj-4', fecha: '2026-06-15', descripcion: 'REEMBOLSO GASTOS ANDREA', categoria: 'Reembolso Socia', debe: 0, haber: 270000 },
      { id: 'cj-5', fecha: '2026-06-15', descripcion: 'GANANCIA VENTAS ANDREA', categoria: 'Comisión Socia', debe: 0, haber: 100000 },
      { id: 'cj-6', fecha: '2026-06-15', descripcion: 'REEMBOLSO GASTOS LEONOR', categoria: 'Reembolso Socia', debe: 0, haber: 346200 },
      { id: 'cj-7', fecha: '2026-06-15', descripcion: 'GANANCIA VENTAS LEONOR', categoria: 'Comisión Socia', debe: 0, haber: 100000 },
      { id: 'cj-8', fecha: '2026-06-15', descripcion: 'NASLY', categoria: 'Ingreso Venta', debe: 40000, haber: 0 },
      { id: 'cj-9', fecha: '2026-06-16', descripcion: 'ESPERANZA ROBAYO', categoria: 'Ingreso Venta', debe: 42000, haber: 0 },
      { id: 'cj-10', fecha: '2026-06-16', descripcion: 'IVAN - ANDREA', categoria: 'Ingreso Venta', debe: 75000, haber: 0 },
      { id: 'cj-11', fecha: '2026-06-17', descripcion: 'CHELA', categoria: 'Ingreso Venta', debe: 61000, haber: 0 },
      { id: 'cj-12', fecha: '2026-06-23', descripcion: '3 FLORES PEQUEÑAS', categoria: 'Ingreso Venta', debe: 6000, haber: 0 },
      { id: 'cj-13', fecha: '2026-06-24', descripcion: 'GIAN CARLO', categoria: 'Ingreso Venta', debe: 350000, haber: 0 },
      { id: 'cj-14', fecha: '2026-06-25', descripcion: 'REEMBOLSO LEONOR', categoria: 'Reembolso Socia', debe: 0, haber: 519400 },
      { id: 'cj-15', fecha: '2026-06-30', descripcion: 'JUNIOR', categoria: 'Ingreso Venta', debe: 67000, haber: 0 },
      { id: 'cj-16', fecha: '2026-06-30', descripcion: 'SRA NAYIBE', categoria: 'Ingreso Venta', debe: 20000, haber: 0 },
      { id: 'cj-17', fecha: '2026-06-30', descripcion: 'AMIGO DE JUNIOR', categoria: 'Ingreso Venta', debe: 30000, haber: 0 },
      { id: 'cj-18', fecha: '2026-06-30', descripcion: 'MECHAS PEBETERO + 9000', categoria: 'Ingreso Venta', debe: 49000, haber: 0 },
      { id: 'cj-19', fecha: '2026-07-08', descripcion: 'FENNY', categoria: 'Ingreso Venta', debe: 40000, haber: 0 },
      { id: 'cj-20', fecha: '2026-07-29', descripcion: 'VELAS NAVIDAD (INSUMOS)', categoria: 'Compra Insumos', debe: 0, haber: 150000 },
      { id: 'cj-21', fecha: '2026-07-29', descripcion: 'REGISTRO CAMARA DE COMERCIO', categoria: 'Gasto Legal/Operativo', debe: 0, haber: 91300 },
      { id: 'cj-22', fecha: '2026-07-30', descripcion: 'VECINA - HIJO VECINA GATOS', categoria: 'Ingreso Venta', debe: 44000, haber: 0 },
      { id: 'cj-23', fecha: '2026-08-04', descripcion: 'VECINA - PERRO CHELA', categoria: 'Ingreso Venta', debe: 18000, haber: 0 },
      { id: 'cj-24', fecha: '2026-09-09', descripcion: 'PAGOS ANDREA - JULIO', categoria: 'Ingreso Venta', debe: 129000, haber: 0 },
      { id: 'cj-25', fecha: '2026-09-09', descripcion: 'ABONO CUENTAS ANDREA', categoria: 'Reembolso Socia', debe: 0, haber: 129000 },
      { id: 'cj-26', fecha: '2026-09-09', descripcion: 'PAGO SILICONA ANDREA', categoria: 'Reembolso Socia', debe: 0, haber: 60000 },
      { id: 'cj-27', fecha: '2026-09-12', descripcion: 'PAGO GIAN', categoria: 'Ingreso Venta', debe: 400000, haber: 0 },
      { id: 'cj-28', fecha: '2026-09-09', descripcion: 'COMISION ANDREA', categoria: 'Comisión Socia', debe: 0, haber: 200000 },
      { id: 'cj-29', fecha: '2026-09-09', descripcion: 'COMISION LEO', categoria: 'Comisión Socia', debe: 0, haber: 200000 },
      { id: 'cj-30', fecha: '2026-08-15', descripcion: 'ABONO VECINA PEBETERO', categoria: 'Ingreso Venta', debe: 22000, haber: 0 },
      { id: 'cj-31', fecha: '2026-08-25', descripcion: 'EDWIN PAGO PERROS', categoria: 'Ingreso Venta', debe: 36000, haber: 0 },
      { id: 'cj-32', fecha: '2026-09-10', descripcion: 'MECHAS', categoria: 'Ingreso Venta', debe: 105000, haber: 0 },
      { id: 'cj-33', fecha: '2026-09-13', descripcion: 'AMPARO HERMANA', categoria: 'Ingreso Venta', debe: 28000, haber: 0 },
      { id: 'cj-34', fecha: '2026-09-13', descripcion: 'HIJA JUSTO', categoria: 'Ingreso Venta', debe: 7000, haber: 0 },
      { id: 'cj-35', fecha: '2026-09-13', descripcion: 'JACOBO MORENO', categoria: 'Ingreso Venta', debe: 7000, haber: 0 },
      { id: 'cj-36', fecha: '2026-09-14', descripcion: 'CHUCHO', categoria: 'Ingreso Venta', debe: 165000, haber: 0 },
      { id: 'cj-37', fecha: '2026-09-15', descripcion: 'PATRICIA', categoria: 'Ingreso Venta', debe: 62000, haber: 0 },
      { id: 'cj-38', fecha: '2026-09-17', descripcion: 'JUSTO', categoria: 'Ingreso Venta', debe: 84000, haber: 0 },
      { id: 'cj-39', fecha: '2026-09-17', descripcion: 'SRA CALLE', categoria: 'Ingreso Venta', debe: 7000, haber: 0 },
      { id: 'cj-40', fecha: '2026-09-19', descripcion: 'FERIA ROSITA', categoria: 'Ingreso Venta', debe: 259000, haber: 0 },
      { id: 'cj-41', fecha: '2026-09-20', descripcion: 'VENTAS ANDREA', categoria: 'Ingreso Venta', debe: 395000, haber: 0 },
      { id: 'cj-42', fecha: '2026-09-20', descripcion: 'ANDREA BOLETAS RIFA', categoria: 'Ingreso Rifa', debe: 45000, haber: 0 },
      { id: 'cj-43', fecha: '2026-09-20', descripcion: 'LEO BOLETAS RIFA', categoria: 'Ingreso Rifa', debe: 75000, haber: 0 },
      { id: 'cj-44', fecha: '2026-09-20', descripcion: 'ABONO CTAS ANDREA (AJUSTE CAJA)', categoria: 'Reembolso Socia', debe: 0, haber: 412200 },
      { id: 'cj-45', fecha: '2026-09-20', descripcion: 'ABONO CTAS LEONOR', categoria: 'Reembolso Socia', debe: 0, haber: 388000 },
      { id: 'cj-46', fecha: '2026-09-20', descripcion: 'COMISION ANDREA', categoria: 'Comisión Socia', debe: 0, haber: 200000 },
      { id: 'cj-47', fecha: '2026-09-20', descripcion: 'COMISION LEONOR', categoria: 'Comisión Socia', debe: 0, haber: 200000 },
      { id: 'cj-48', fecha: '2026-09-25', descripcion: 'EDWIN SUPERMERCADO', categoria: 'Ingreso Venta', debe: 22000, haber: 0 },
      { id: 'cj-49', fecha: '2026-09-25', descripcion: 'PERROS DANIEL NATHALIA', categoria: 'Ingreso Venta', debe: 40000, haber: 0 },
      { id: 'cj-50', fecha: '2026-09-25', descripcion: 'PAGO SRA NAYIBE', categoria: 'Ingreso Venta', debe: 18000, haber: 0 },
      { id: 'cj-51', fecha: '2026-09-27', descripcion: 'SALDO RECORDATORIOS GERALDINE', categoria: 'Ingreso Venta', debe: 350000, haber: 0 },
      { id: 'cj-52', fecha: '2026-09-27', descripcion: 'PAGO GLORIA PEBETERO WATSMELL', categoria: 'Ingreso Venta', debe: 42000, haber: 0 },
      { id: 'cj-53', fecha: '2026-09-24', descripcion: 'TEMU SEPTIEMBRE 24', categoria: 'Compra Insumos', debe: 0, haber: 144500 },
      { id: 'cj-54', fecha: '2026-09-26', descripcion: 'TEMU SEPTIEMBRE 26', categoria: 'Compra Insumos', debe: 0, haber: 86000 },
      { id: 'cj-55', fecha: '2026-09-27', descripcion: 'ABONO CUENTAS ANDREA', categoria: 'Reembolso Socia', debe: 0, haber: 119500 },
      { id: 'cj-56', fecha: '2026-10-01', descripcion: 'NATHALIA', categoria: 'Ingreso Venta', debe: 28000, haber: 0 },
      { id: 'cj-57', fecha: '2026-10-28', descripcion: 'SRA FERRETERIA ROMA', categoria: 'Ingreso Venta', debe: 24000, haber: 0 },
      { id: 'cj-58', fecha: '2026-10-28', descripcion: 'ANGELA 1ER PEDIDO', categoria: 'Ingreso Venta', debe: 94000, haber: 0 },
      { id: 'cj-59', fecha: '2026-10-28', descripcion: 'ANGELA 2DO PEDIDO', categoria: 'Ingreso Venta', debe: 6000, haber: 0 },
      { id: 'cj-60', fecha: '2026-11-03', descripcion: 'ANGELA PERRO AMIGA', categoria: 'Ingreso Venta', debe: 22000, haber: 0 }
    ],

    // HOJA 2: REGISTRO DE VENTAS Y CARTERA POR COBRAR
    ventas: [
      { id: 'v-1', fecha: '2026-05-20', comprador: 'CHELA', producto: 'VELAS ELEGANTES', medioPago: 'EFECTIVO', valor: 30000, insumos: 0, pago: 30000, debe: 0 },
      { id: 'v-2', fecha: '2026-05-20', comprador: 'CHELA', producto: 'PERRO PIJAMA', medioPago: 'EFECTIVO', valor: 15000, insumos: 0, pago: 15000, debe: 0 },
      { id: 'v-3', fecha: '2026-05-20', comprador: 'CHELA', producto: 'WAX MELTS', medioPago: 'EFECTIVO', valor: 18000, insumos: 0, pago: 18000, debe: 0 },
      { id: 'v-4', fecha: '2026-05-23', comprador: 'MECHAS', producto: 'SCHNAUZER', medioPago: 'EFECTIVO', valor: 45000, insumos: 0, pago: 45000, debe: 0 },
      { id: 'v-5', fecha: '2026-05-23', comprador: 'MECHAS', producto: 'KIT FLORES + CORAZÓN', medioPago: 'EFECTIVO', valor: 41500, insumos: 0, pago: 41500, debe: 0 },
      { id: 'v-6', fecha: '2026-05-23', comprador: 'MECHAS', producto: 'VIRGEN', medioPago: 'EFECTIVO', valor: 13500, insumos: 0, pago: 13500, debe: 0 },
      { id: 'v-7', fecha: '2026-05-23', comprador: 'MECHAS', producto: 'PEBETERO + WAX MELTS', medioPago: 'EFECTIVO', valor: 40000, insumos: 0, pago: 40000, debe: 0 },
      { id: 'v-8', fecha: '2026-05-23', comprador: 'MECHAS', producto: 'BOUQUET 7 FLORES', medioPago: 'EFECTIVO', valor: 24400, insumos: 0, pago: 24400, debe: 0 },
      { id: 'v-9', fecha: '2026-05-23', comprador: 'KAREN', producto: '2 KAMOS', medioPago: 'EFECTIVO', valor: 56000, insumos: 0, pago: 56000, debe: 0 },
      { id: 'v-10', fecha: '2026-05-23', comprador: 'KAREN', producto: 'KIARA', medioPago: 'EFECTIVO', valor: 18000, insumos: 0, pago: 18000, debe: 0 },
      { id: 'v-11', fecha: '2026-05-23', comprador: 'KAREN', producto: 'PAPÁ BIGOTE', medioPago: 'EFECTIVO', valor: 18000, insumos: 0, pago: 18000, debe: 0 },
      { id: 'v-12', fecha: '2026-05-23', comprador: 'KAREN', producto: 'CERVEZA', medioPago: 'EFECTIVO', valor: 25000, insumos: 0, pago: 25000, debe: 0 },
      { id: 'v-13', fecha: '2026-05-23', comprador: 'KAREN', producto: 'KAMO', medioPago: 'PENDIENTE', valor: 28000, insumos: 0, pago: 0, debe: 28000 },
      { id: 'v-14', fecha: '2026-05-23', comprador: 'NASLY', producto: '2 GATOS', medioPago: 'EFECTIVO', valor: 40000, insumos: 0, pago: 40000, debe: 0 },
      { id: 'v-15', fecha: '2026-05-23', comprador: 'FENNY', producto: 'BOUQUET 7 FLORES', medioPago: 'EFECTIVO', valor: 40000, insumos: 0, pago: 40000, debe: 0 },
      { id: 'v-16', fecha: '2026-06-01', comprador: 'ANDREA', producto: 'PERRO OJÓN', medioPago: 'ABONO SOCIA', valor: 30000, insumos: 0, pago: 30000, debe: 0 },
      { id: 'v-17', fecha: '2026-06-01', comprador: 'GLORIA', producto: 'SCHNAUZER', medioPago: 'EFECTIVO', valor: 30000, insumos: 0, pago: 30000, debe: 0 },
      { id: 'v-18', fecha: '2026-06-01', comprador: 'KAREN', producto: 'VARIOS', medioPago: 'EFECTIVO', valor: 26000, insumos: 0, pago: 26000, debe: 0 },
      { id: 'v-19', fecha: '2026-06-01', comprador: 'IVAN', producto: 'BOUQUETS FRASCO', medioPago: 'EFECTIVO', valor: 84000, insumos: 0, pago: 84000, debe: 0 },
      { id: 'v-20', fecha: '2026-06-01', comprador: 'ANGELA', producto: '2 PERROS GRANDES', medioPago: 'EFECTIVO', valor: 60000, insumos: 0, pago: 60000, debe: 0 },
      { id: 'v-21', fecha: '2026-06-01', comprador: 'ANGELA', producto: 'MARIPOSA', medioPago: 'EFECTIVO', valor: 10000, insumos: 0, pago: 10000, debe: 0 },
      { id: 'v-22', fecha: '2026-06-01', comprador: 'KAREN AVILA', producto: 'VIRGEN GORDA', medioPago: 'EFECTIVO', valor: 15000, insumos: 0, pago: 15000, debe: 0 },
      { id: 'v-23', fecha: '2026-06-01', comprador: 'ANDREA', producto: 'VIRGEN CORAZÓN', medioPago: 'ABONO SOCIA', valor: 15000, insumos: 0, pago: 15000, debe: 0 },
      { id: 'v-24', fecha: '2026-06-13', comprador: 'FERIA', producto: 'PEBETERO + WAX MELTS', medioPago: 'EFECTIVO', valor: 60000, insumos: 0, pago: 60000, debe: 0 },
      { id: 'v-25', fecha: '2026-06-13', comprador: 'FERIA', producto: 'PERRO BOXER PEQUEÑO', medioPago: 'EFECTIVO', valor: 15000, insumos: 0, pago: 15000, debe: 0 },
      { id: 'v-26', fecha: '2026-06-13', comprador: 'FERIA', producto: 'GATO NEGRO', medioPago: 'NEQUI', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-27', fecha: '2026-06-13', comprador: 'FERIA', producto: '2 COPA MUNDIAL', medioPago: 'EFECTIVO', valor: 50000, insumos: 0, pago: 50000, debe: 0 },
      { id: 'v-28', fecha: '2026-06-13', comprador: 'FERIA', producto: 'PERRO PIJAMA', medioPago: 'BRE-B', valor: 18000, insumos: 0, pago: 18000, debe: 0 },
      { id: 'v-29', fecha: '2026-06-13', comprador: 'FERIA', producto: 'PERRO SHIH TZU', medioPago: 'BRE-B', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-30', fecha: '2026-06-13', comprador: 'FERIA', producto: 'VIRGEN GORDA', medioPago: 'EFECTIVO', valor: 15000, insumos: 0, pago: 15000, debe: 0 },
      { id: 'v-31', fecha: '2026-06-13', comprador: 'FERIA', producto: 'PERRO BEAGLE', medioPago: 'BRE-B', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-32', fecha: '2026-06-13', comprador: 'FERIA', producto: 'WAX MELTS FRUTOS ROJOS', medioPago: 'BRE-B', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-33', fecha: '2026-06-13', comprador: 'FERIA', producto: 'COPITO', medioPago: 'EFECTIVO', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-34', fecha: '2026-06-13', comprador: 'FERIA', producto: 'PAPÁ BIGOTE', medioPago: 'EFECTIVO', valor: 18000, insumos: 0, pago: 18000, debe: 0 },
      { id: 'v-35', fecha: '2026-06-13', comprador: 'FERIA', producto: 'VIRGEN', medioPago: 'NEQUI', valor: 15000, insumos: 0, pago: 15000, debe: 0 },
      { id: 'v-36', fecha: '2026-06-14', comprador: 'PANCHA HANS', producto: 'PEBETERO', medioPago: 'NEQUI', valor: 22000, insumos: 0, pago: 22000, debe: 0 },
      { id: 'v-37', fecha: '2026-06-14', comprador: 'PANCHA HANS', producto: 'PERRO CORGI', medioPago: 'NEQUI', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-38', fecha: '2026-06-14', comprador: 'SIMON', producto: 'COPA MUNDO', medioPago: 'PENDIENTE', valor: 25000, insumos: 0, pago: 0, debe: 25000 },
      { id: 'v-39', fecha: '2026-06-14', comprador: 'CAROLINA', producto: 'GATO NEGRO', medioPago: 'EFECTIVO', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-40', fecha: '2026-06-14', comprador: 'IVAN', producto: '2 PASTOR ALEMÁN', medioPago: 'DAVIPLATA', valor: 50000, insumos: 0, pago: 50000, debe: 0 },
      { id: 'v-41', fecha: '2026-06-14', comprador: 'IVAN', producto: 'COPA MUNDO', medioPago: 'DAVIPLATA', valor: 25000, insumos: 0, pago: 25000, debe: 0 },
      { id: 'v-42', fecha: '2026-06-14', comprador: 'CONSTANZA', producto: '2 COPA MUNDO', medioPago: 'EFECTIVO', valor: 50000, insumos: 0, pago: 50000, debe: 0 },
      { id: 'v-43', fecha: '2026-06-14', comprador: 'CONSTANZA', producto: 'GATO GRIS', medioPago: 'EFECTIVO', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-44', fecha: '2026-06-21', comprador: 'NAYIBE', producto: 'BOTELLA + BANDEJA + 3 ROSAS', medioPago: 'EFECTIVO', valor: 82000, insumos: 0, pago: 82000, debe: 0 },
      { id: 'v-45', fecha: '2026-06-22', comprador: 'GABRIEL', producto: '2 VÍRGENES', medioPago: 'NEQUI', valor: 30000, insumos: 0, pago: 30000, debe: 0 },
      { id: 'v-46', fecha: '2026-06-22', comprador: 'CHUCHO', producto: '4 VÍRGENES', medioPago: 'EFECTIVO', valor: 60000, insumos: 0, pago: 60000, debe: 0 },
      { id: 'v-47', fecha: '2026-06-23', comprador: 'JUNIOR', producto: '1 COPA MUNDIAL', medioPago: 'EFECTIVO', valor: 25000, insumos: 0, pago: 25000, debe: 0 },
      { id: 'v-48', fecha: '2026-06-23', comprador: 'NAYIBE', producto: 'SACHET MARACUYÁ', medioPago: 'EFECTIVO', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-49', fecha: '2026-06-23', comprador: 'NAYIBE', producto: '3 FLORES PEQUEÑAS', medioPago: 'EFECTIVO', valor: 6000, insumos: 0, pago: 6000, debe: 0 },
      { id: 'v-50', fecha: '2026-06-23', comprador: 'ANDREA', producto: 'PAPÁ BIGOTE', medioPago: 'PENDIENTE', valor: 18000, insumos: 0, pago: 0, debe: 18000 },
      { id: 'v-51', fecha: '2026-06-25', comprador: 'ANDREA', producto: 'VELAS RIZADAS', medioPago: 'EFECTIVO', valor: 27000, insumos: 0, pago: 27000, debe: 0 },
      { id: 'v-52', fecha: '2026-06-27', comprador: 'ANDREA', producto: '2 SAGRADA FAMILIA', medioPago: 'EFECTIVO', valor: 32000, insumos: 0, pago: 32000, debe: 0 },
      { id: 'v-53', fecha: '2026-06-27', comprador: 'JUNIOR', producto: '1 PERRO AMARILLO + 1 SAMOYEDO', medioPago: 'EFECTIVO', valor: 42000, insumos: 0, pago: 42000, debe: 0 },
      { id: 'v-54', fecha: '2026-07-21', comprador: 'HIJO VECINA', producto: '1 GATO GRIS + 1 GATO AMARILLO', medioPago: 'EFECTIVO', valor: 44000, insumos: 0, pago: 44000, debe: 0 },
      { id: 'v-55', fecha: '2026-07-30', comprador: 'VECINA', producto: '1 PERRO CHELA', medioPago: 'EFECTIVO', valor: 18000, insumos: 0, pago: 18000, debe: 0 },
      { id: 'v-56', fecha: '2026-08-05', comprador: 'VECINA', producto: '1 PEBETERO + WAX MELTS X12', medioPago: 'EFECTIVO', valor: 40000, insumos: 0, pago: 40000, debe: 0 },
      { id: 'v-57', fecha: '2026-09-09', comprador: 'JOSE ANDREA', producto: '1 COPA MUNDIAL', medioPago: 'EFECTIVO', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-58', fecha: '2026-09-09', comprador: 'EDWIN', producto: '2 SHIH TZU', medioPago: 'EFECTIVO', valor: 36000, insumos: 0, pago: 36000, debe: 0 },
      { id: 'v-59', fecha: '2026-09-09', comprador: 'GIAN CARLO', producto: '150 RECORDATORIOS + 1 BARCO', medioPago: 'NEQUI', valor: 600000, insumos: 0, pago: 600000, debe: 0 },
      { id: 'v-60', fecha: '2026-09-09', comprador: 'GIAN CARLO', producto: '1 BOUQUET VIDRIO', medioPago: 'PENDIENTE', valor: 30000, insumos: 0, pago: 0, debe: 30000 },
      { id: 'v-61', fecha: '2026-09-07', comprador: 'KAREN', producto: '1 BOUQUET VIDRIO + 2 CORAZONES + 1 MARIPOSA', medioPago: 'PENDIENTE', valor: 54000, insumos: 0, pago: 0, debe: 54000 },
      { id: 'v-62', fecha: '2026-09-10', comprador: 'MECHAS', producto: '3 BOUQUET 3 FLORES + 6 ROSAS + 4 CORAZONES', medioPago: 'EFECTIVO', valor: 105000, insumos: 0, pago: 105000, debe: 0 },
      { id: 'v-63', fecha: '2026-09-13', comprador: 'AMPARO', producto: '4 ROSAS', medioPago: 'NEQUI', valor: 28000, insumos: 0, pago: 28000, debe: 0 },
      { id: 'v-64', fecha: '2026-09-13', comprador: 'HIJA JUSTO / JACOBO', producto: '2 ROSAS', medioPago: 'NEQUI', valor: 14000, insumos: 0, pago: 14000, debe: 0 },
      { id: 'v-65', fecha: '2026-09-13', comprador: 'JEIMY', producto: '4 CORAZONES', medioPago: 'EFECTIVO', valor: 34000, insumos: 0, pago: 34000, debe: 0 },
      { id: 'v-66', fecha: '2026-09-14', comprador: 'CHUCHO', producto: '10 ROSAS + 5 CORAZONES', medioPago: 'EFECTIVO', valor: 105000, insumos: 0, pago: 105000, debe: 0 },
      { id: 'v-67', fecha: '2026-09-15', comprador: 'PATRICIA', producto: '1 PEBETERO + 1 SACHET + 1 BOUQUET 5 FLORES', medioPago: 'NEQUI', valor: 62000, insumos: 0, pago: 62000, debe: 0 },
      { id: 'v-68', fecha: '2026-09-17', comprador: 'JUSTO / CALLE / HUGO', producto: '15 ROSAS', medioPago: 'EFECTIVO', valor: 105000, insumos: 0, pago: 105000, debe: 0 },
      { id: 'v-69', fecha: '2026-09-18', comprador: 'BOYACA', producto: 'VELAS CUMPLEAÑOS', medioPago: 'NEQUI', valor: 26000, insumos: 0, pago: 26000, debe: 0 },
      { id: 'v-70', fecha: '2026-09-20', comprador: 'GERALDINE', producto: '70 RECORDATORIOS', medioPago: 'NEQUI', valor: 560000, insumos: 210000, pago: 560000, debe: 0 },
      { id: 'v-71', fecha: '2026-09-20', comprador: 'JEIMY', producto: '4 CORAZONES', medioPago: 'EFECTIVO', valor: 34000, insumos: 0, pago: 34000, debe: 0 },
      { id: 'v-72', fecha: '2026-09-20', comprador: 'DANIEL', producto: 'FRASCOS', medioPago: 'NEQUI ANDREA', valor: 105000, insumos: 0, pago: 105000, debe: 0 },
      { id: 'v-73', fecha: '2026-09-20', comprador: 'SANDRA JJ', producto: 'FLORES', medioPago: 'NEQUI ANDREA', valor: 20000, insumos: 0, pago: 20000, debe: 0 },
      { id: 'v-74', fecha: '2026-09-19', comprador: 'NATHALIA', producto: '4 FLORES', medioPago: 'NEQUI LEONOR', valor: 28000, insumos: 0, pago: 28000, debe: 0 },
      { id: 'v-75', fecha: '2026-09-19', comprador: 'ESPERANZA', producto: '1 FLOR + 5 CORAZONES', medioPago: 'PENDIENTE', valor: 42000, insumos: 0, pago: 0, debe: 42000 },
      { id: 'v-76', fecha: '2026-09-25', comprador: 'CLAUDIA FERRETERIA', producto: '1 BOUQUET 7 FLORES', medioPago: 'EFECTIVO', valor: 24000, insumos: 0, pago: 24000, debe: 0 },
      { id: 'v-77', fecha: '2026-09-30', comprador: 'CLAUDIA FERRETERIA', producto: 'PEBETERO + CORAZONES', medioPago: 'PENDIENTE', valor: 42000, insumos: 0, pago: 0, debe: 42000 },
      { id: 'v-78', fecha: '2026-11-03', comprador: 'ANGELA AMIGA', producto: 'PERRO AMARILLO', medioPago: 'EFECTIVO', valor: 22000, insumos: 0, pago: 22000, debe: 0 }
    ],

    // HOJA 3: INVENTARIO FÍSICO, VALORIZADO Y CONSIGNACIÓN (33 referencias reales, $1.810.000)
    inventario: [
      { id: 'inv-1', producto: 'KAMO LABRADOR', cantidad: 1, precioVenta: 30000, consignacion: 30000, andrea: 1, leo: 0 },
      { id: 'inv-2', producto: 'SCHNAUZER', cantidad: 1, precioVenta: 35000, consignacion: 35000, andrea: 1, leo: 1 },
      { id: 'inv-3', producto: 'TERRIER', cantidad: 4, precioVenta: 22000, consignacion: 22000, andrea: 1, leo: 0 },
      { id: 'inv-4', producto: 'GOLDEN SENTADO', cantidad: 3, precioVenta: 25000, consignacion: 25000, andrea: 1, leo: 0 },
      { id: 'inv-5', producto: 'GOLDEN ACOSTADO', cantidad: 1, precioVenta: 25000, consignacion: 25000, andrea: 1, leo: 0 },
      { id: 'inv-6', producto: 'PERRO GORDO', cantidad: 1, precioVenta: 38000, consignacion: 38000, andrea: 1, leo: 0 },
      { id: 'inv-7', producto: 'PERRO SHIH TZU', cantidad: 1, precioVenta: 18000, consignacion: 18000, andrea: 1, leo: 0 },
      { id: 'inv-8', producto: 'COPITO', cantidad: 0, precioVenta: 20000, consignacion: 20000, andrea: 1, leo: 0 },
      { id: 'inv-9', producto: 'COPITO PIJAMA', cantidad: 1, precioVenta: 18000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-10', producto: 'PERRO BEAGLE', cantidad: 1, precioVenta: 18000, consignacion: 18000, andrea: 1, leo: 0 },
      { id: 'inv-11', producto: 'CARA TRISTE', cantidad: 1, precioVenta: 15000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-12', producto: 'KIARA', cantidad: 2, precioVenta: 18000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-13', producto: 'GATO ELEGANTE', cantidad: 3, precioVenta: 20000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-14', producto: 'GATO PARADO', cantidad: 3, precioVenta: 22000, consignacion: 22000, andrea: 1, leo: 0 },
      { id: 'inv-15', producto: 'GATO TIERNO', cantidad: 2, precioVenta: 22000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-16', producto: 'HUELLA', cantidad: 2, precioVenta: 10000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-17', producto: 'ANGEL', cantidad: 7, precioVenta: 8000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-18', producto: 'VIRGEN CRUZ', cantidad: 3, precioVenta: 12000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-19', producto: 'VIRGEN GUADALUPE', cantidad: 4, precioVenta: 15000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-20', producto: 'VIRGEN CORAZON', cantidad: 5, precioVenta: 15000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-21', producto: 'PAPA BIGOTE', cantidad: 6, precioVenta: 18000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-22', producto: 'BOUQUET 7 FLORES', cantidad: 1, precioVenta: 24000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-23', producto: 'BOUQUETS VASO', cantidad: 4, precioVenta: 30000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-24', producto: 'PEONIAS', cantidad: 2, precioVenta: 15000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-25', producto: 'ROSAS', cantidad: 2, precioVenta: 15000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-26', producto: 'MARIPOSAS', cantidad: 2, precioVenta: 15000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-27', producto: 'CORAZONES PEQUEÑOS', cantidad: 5, precioVenta: 8000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-28', producto: 'VELAS ELEGANTES', cantidad: 1, precioVenta: 35000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-29', producto: 'WAX MELTS', cantidad: 6, precioVenta: 20000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-30', producto: 'CERVEZA', cantidad: 3, precioVenta: 25000, consignacion: 0, andrea: 1, leo: 0 },
      { id: 'inv-31', producto: 'COPA MUNDO', cantidad: 0, precioVenta: 25000, consignacion: 0, andrea: 2, leo: 0 },
      { id: 'inv-32', producto: 'PEBETEROS', cantidad: 18, precioVenta: 20000, consignacion: 0, andrea: 0, leo: 0 },
      { id: 'inv-33', producto: 'GATO NUEVO', cantidad: 1, precioVenta: 25000, consignacion: 0, andrea: 0, leo: 0 }
    ],

    // HOJA 1: COMPRAS A PROVEEDORES E INSUMOS
    proveedores: [
      { id: 'pr-1', fecha: '2026-03-21', proveedor: 'HOME CENTER', debe: 22900, haber: 0 },
      { id: 'pr-2', fecha: '2026-04-16', proveedor: 'VELA BELLA', debe: 85400, haber: 0 },
      { id: 'pr-3', fecha: '2026-05-12', proveedor: 'COMPRA PLANTILLAS', debe: 31000, haber: 0 },
      { id: 'pr-4', fecha: '2026-04-25', proveedor: 'COMERCIAL 360', debe: 74000, haber: 0 },
      { id: 'pr-5', fecha: '2026-05-11', proveedor: 'CINTAS KENNEDY', debe: 31800, haber: 0 },
      { id: 'pr-6', fecha: '2026-05-11', proveedor: 'VELA BELLA', debe: 218000, haber: 0 },
      { id: 'pr-7', fecha: '2026-05-13', proveedor: 'COMERCIAL 360', debe: 49000, haber: 0 },
      { id: 'pr-8', fecha: '2026-05-19', proveedor: 'VELA BELLA', debe: 346200, haber: 0 },
      { id: 'pr-9', fecha: '2026-06-03', proveedor: 'NUBITA', debe: 100550, haber: 0 },
      { id: 'pr-10', fecha: '2026-06-04', proveedor: 'COMERCIAL 360', debe: 100500, haber: 0 },
      { id: 'pr-11', fecha: '2026-06-06', proveedor: 'DOLLAR CITY', debe: 17154, haber: 0 },
      { id: 'pr-12', fecha: '2026-06-06', proveedor: 'DOLLAR CITY', debe: 69000, haber: 0 },
      { id: 'pr-13', fecha: '2026-06-11', proveedor: 'HOMO (CAJAS)', debe: 44100, haber: 0 },
      { id: 'pr-14', fecha: '2026-06-11', proveedor: 'PAPELERIA T', debe: 16800, haber: 0 },
      { id: 'pr-15', fecha: '2026-06-12', proveedor: 'PAPELERIA TINTAL', debe: 8800, haber: 0 },
      { id: 'pr-16', fecha: '2026-06-12', proveedor: 'COMPRAS TEMU', debe: 150000, haber: 0 },
      { id: 'pr-17', fecha: '2026-06-15', proveedor: 'ABONO FRAS ANDREA', debe: 0, haber: 270000 },
      { id: 'pr-18', fecha: '2026-06-15', proveedor: 'ABONO FRAS LEO', debe: 0, haber: 346200 },
      { id: 'pr-19', fecha: '2026-07-29', proveedor: 'VELAS DESEOS', debe: 150000, haber: 0 },
      { id: 'pr-20', fecha: '2026-08-01', proveedor: 'INSUMOS VARIOS 360', debe: 174000, haber: 0 },
      { id: 'pr-21', fecha: '2026-08-03', proveedor: 'SILICONA MOLDES VELA BELLA', debe: 60000, haber: 0 },
      { id: 'pr-22', fecha: '2026-08-26', proveedor: 'COMPRA INSUMOS VELA BELLA', debe: 442000, haber: 0 }
    ],

    // CUENTA DE REEMBOLSOS — SOCIA ANDREA RUIZ
    cuentaAndrea: [
      { id: 'ca-1', fecha: '2026-08-01', concepto: 'PLANTILLAS MUNDO', tipo: 'compra', monto: 34000 },
      { id: 'ca-2', fecha: '2026-08-15', concepto: 'TEMU AGOSTO 15', tipo: 'compra', monto: 106000 },
      { id: 'ca-3', fecha: '2026-08-15', concepto: 'TRANSPORTES', tipo: 'compra', monto: 10000 },
      { id: 'ca-4', fecha: '2026-08-08', concepto: 'TEMU AGOSTO 8', tipo: 'compra', monto: 84000 },
      { id: 'ca-5', fecha: '2026-08-27', concepto: 'TEMU AGOSTO 27', tipo: 'compra', monto: 170000 },
      { id: 'ca-6', fecha: '2026-08-15', concepto: 'TEMU AGOSTO 15 (2)', tipo: 'compra', monto: 68000 },
      { id: 'ca-7', fecha: '2026-08-06', concepto: 'SILICONA AGOSTO 6', tipo: 'compra', monto: 60000 },
      { id: 'ca-8', fecha: '2026-08-28', concepto: 'TEMU MOLDES E INSUMOS', tipo: 'compra', monto: 127170 },
      { id: 'ca-9', fecha: '2026-08-30', concepto: 'VELA BELLA', tipo: 'compra', monto: 91200 },
      { id: 'ca-10', fecha: '2026-09-01', concepto: 'AROMAS LILIANA', tipo: 'compra', monto: 135000 },
      { id: 'ca-11', fecha: '2026-09-02', concepto: 'TRANSPORTES', tipo: 'compra', monto: 20000 },
      { id: 'ca-12', fecha: '2026-09-05', concepto: 'QUIMIFRESH - FRASCOS', tipo: 'compra', monto: 46000 },
      { id: 'ca-13', fecha: '2026-08-09', concepto: 'ABONO REEMBOLSO ANDREA (AGO 9)', tipo: 'abono', monto: 129000 },
      { id: 'ca-14', fecha: '2026-08-09', concepto: 'ABONO SILICONA ANDREA (AGO 9)', tipo: 'abono', monto: 60000 },
      { id: 'ca-15', fecha: '2026-09-20', concepto: 'ABONO SEPTIEMBRE 20', tipo: 'abono', monto: 292200 },
      { id: 'ca-16', fecha: '2026-09-27', concepto: 'ABONO SEPTIEMBRE 27', tipo: 'abono', monto: 119500 }
    ],

    // CUENTA DE REEMBOLSOS — SOCIA LEONOR HERRERA
    cuentaLeonor: [
      { id: 'cl-1', fecha: '2026-08-20', concepto: '360 COMERCIAL', tipo: 'compra', monto: 174000 },
      { id: 'cl-2', fecha: '2026-08-20', concepto: 'TRANSPORTE', tipo: 'compra', monto: 12000 },
      { id: 'cl-3', fecha: '2026-08-25', concepto: 'PAPEL FOTOGRAFICO', tipo: 'compra', monto: 14000 },
      { id: 'cl-4', fecha: '2026-09-01', concepto: 'HAMBURGUESAS JORNADA', tipo: 'compra', monto: 25000 },
      { id: 'cl-5', fecha: '2026-09-01', concepto: 'VELA BELLA - LEO', tipo: 'compra', monto: 442000 },
      { id: 'cl-6', fecha: '2026-09-02', concepto: 'DOMICILIO LEO', tipo: 'compra', monto: 11500 },
      { id: 'cl-7', fecha: '2026-09-10', concepto: 'VELA BELLA', tipo: 'compra', monto: 80000 },
      { id: 'cl-8', fecha: '2026-09-18', concepto: 'CINTAS', tipo: 'compra', monto: 50000 },
      { id: 'cl-9', fecha: '2026-09-18', concepto: 'TRANSPORTE', tipo: 'compra', monto: 21500 },
      { id: 'cl-10', fecha: '2026-09-20', concepto: 'ABONO CUENTAS LEONOR (SEP 20)', tipo: 'abono', monto: 388000 }
    ],

    // SUB-MÓDULO 5: FICHAS DE COSTEO Y RECETARIO DE ESTIMACIONES
    fichasCosteo: [
      {
        id: 'fc-1',
        nombre: 'Recordatorio Evento (Ej. Pedido 70 uds Geraldine)',
        gramosCera: 60,
        costoKgCera: 24000,
        mlAroma: 4,
        costoMlAroma: 200,
        costoPabiloColor: 260,
        costoEnvase: 0,
        costoEmpaque: 500,
        costoManoObra: 0,
        markupPct: 166.7,
        precioVentaFinal: 8000
      },
      {
        id: 'fc-2',
        nombre: 'Perro Mediano Escultórico (Shih Tzu / Beagle / Kiara)',
        gramosCera: 140,
        costoKgCera: 25000,
        mlAroma: 8,
        costoMlAroma: 220,
        costoPabiloColor: 540,
        costoEnvase: 0,
        costoEmpaque: 1200,
        costoManoObra: 1000,
        markupPct: 125,
        precioVentaFinal: 18000
      },
      {
        id: 'fc-3',
        nombre: 'Perro Grande (Kamo Labrador / Schnauzer)',
        gramosCera: 260,
        costoKgCera: 25000,
        mlAroma: 14,
        costoMlAroma: 220,
        costoPabiloColor: 720,
        costoEnvase: 0,
        costoEmpaque: 1700,
        costoManoObra: 2000,
        markupPct: 115,
        precioVentaFinal: 30000
      },
      {
        id: 'fc-4',
        nombre: 'Bouquet 7 Flores en Caja / Base',
        gramosCera: 180,
        costoKgCera: 25000,
        mlAroma: 12,
        costoMlAroma: 250,
        costoPabiloColor: 800,
        costoEnvase: 1200,
        costoEmpaque: 1500,
        costoManoObra: 1500,
        markupPct: 92,
        precioVentaFinal: 24000
      },
      {
        id: 'fc-5',
        nombre: 'Bouquet Floral en Vaso de Vidrio (8oz)',
        gramosCera: 200,
        costoKgCera: 25000,
        mlAroma: 15,
        costoMlAroma: 250,
        costoPabiloColor: 750,
        costoEnvase: 3500,
        costoEmpaque: 1500,
        costoManoObra: 1500,
        markupPct: 87.5,
        precioVentaFinal: 30000
      },
      {
        id: 'fc-6',
        nombre: 'Virgen Guadalupe / Virgen Corazón',
        gramosCera: 110,
        costoKgCera: 25000,
        mlAroma: 6,
        costoMlAroma: 220,
        costoPabiloColor: 430,
        costoEnvase: 0,
        costoEmpaque: 1000,
        costoManoObra: 1000,
        markupPct: 130,
        precioVentaFinal: 15000
      },
      {
        id: 'fc-7',
        nombre: 'Caja x10 Velas de los Deseos Personalizadas (Navidad)',
        gramosCera: 300,
        costoKgCera: 22000,
        mlAroma: 5,
        costoMlAroma: 200,
        costoPabiloColor: 1400,
        costoEnvase: 0,
        costoEmpaque: 3500,
        costoManoObra: 2500,
        markupPct: 133.3,
        precioVentaFinal: 35000
      }
    ]
  };
}

let erpState = null;

function loadERPDatabase() {
  try {
    const saved = localStorage.getItem(ERP_STORAGE_KEY);
    if (saved) {
      erpState = JSON.parse(saved);
      if (!erpState.fichasCosteo) {
        erpState.fichasCosteo = getInitialERPDatabase().fichasCosteo;
      }
    } else {
      erpState = getInitialERPDatabase();
      localStorage.setItem(ERP_STORAGE_KEY, JSON.stringify(erpState));
    }
  } catch (e) {
    console.error('Error loading local ERP database:', e);
    erpState = getInitialERPDatabase();
  }

  // Sincronización con Cloudflare D1 en segundo plano (/api/accounting)
  fetch('/api/accounting', {
    method: 'GET',
    headers: { 'X-Admin-Key': 'simone2026' }
  })
    .then(res => (res.ok ? res.json() : null))
    .then(data => {
      if (!data) return;
      if (data.accounting && data.accounting.cajaGeneral) {
        erpState = data.accounting;
        if (!erpState.fichasCosteo) {
          erpState.fichasCosteo = getInitialERPDatabase().fichasCosteo;
        }
        localStorage.setItem(ERP_STORAGE_KEY, JSON.stringify(erpState));
        refreshAllERPViews();
      } else if (data.cloudActive) {
        // Sembrar base inicial en Cloudflare D1 la primera vez
        saveERPDatabase();
      }
    })
    .catch(() => {
      // Modo local sin backend /api/accounting
    });
}

function saveERPDatabase() {
  try {
    localStorage.setItem(ERP_STORAGE_KEY, JSON.stringify(erpState));
  } catch (e) {
    console.error('Error saving ERP database:', e);
  }

  // Persistir en Cloudflare D1 (/api/accounting)
  fetch('/api/accounting', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': 'simone2026'
    },
    body: JSON.stringify(erpState)
  }).catch(() => {
    // Modo local offline
  });
}

// -------------------------------------------------------------------------
// 2. CÁLCULO GLOBAL DE KPIS FINANCIEROS EN TIEMPO REAL
// -------------------------------------------------------------------------
function renderERPKPIs() {
  if (!erpState) return;

  // 1. Saldo en Caja General (Debe - Haber)
  let totalDebeCaja = 0;
  let totalHaberCaja = 0;
  erpState.cajaGeneral.forEach(m => {
    totalDebeCaja += Number(m.debe) || 0;
    totalHaberCaja += Number(m.haber) || 0;
  });
  const saldoCaja = totalDebeCaja - totalHaberCaja;

  // 2. Ventas Totales y Cartera por Cobrar
  let totalVentas = 0;
  let totalRecaudadoVentas = 0;
  let totalCarteraPorCobrar = 0;
  let clientesConDeuda = 0;
  erpState.ventas.forEach(v => {
    totalVentas += Number(v.valor) || 0;
    totalRecaudadoVentas += Number(v.pago) || 0;
    const d = Number(v.debe) || 0;
    totalCarteraPorCobrar += d;
    if (d > 0) clientesConDeuda++;
  });

  // 3. Inventario Físico y Valorizado
  let totalUnidadesStock = 0;
  let totalValorStock = 0;
  let totalConsignacion = 0;
  erpState.inventario.forEach(item => {
    const cant = Number(item.cantidad) || 0;
    const pv = Number(item.precioVenta) || 0;
    totalUnidadesStock += cant;
    totalValorStock += cant * pv;
    totalConsignacion += Number(item.consignacion) || 0;
  });

  // 4. Saldo por Reembolsar a Andrea y Leonor
  let comprasAndrea = 0;
  let abonosAndrea = 0;
  erpState.cuentaAndrea.forEach(item => {
    if (item.tipo === 'compra') comprasAndrea += Number(item.monto) || 0;
    else abonosAndrea += Number(item.monto) || 0;
  });
  const saldoAndrea = comprasAndrea - abonosAndrea;

  let comprasLeonor = 0;
  let abonosLeonor = 0;
  erpState.cuentaLeonor.forEach(item => {
    if (item.tipo === 'compra') comprasLeonor += Number(item.monto) || 0;
    else abonosLeonor += Number(item.monto) || 0;
  });
  const saldoLeonor = comprasLeonor - abonosLeonor;

  const elCaja = document.getElementById('erp-kpi-caja');
  const elCajaSub = document.getElementById('erp-kpi-caja-sub');
  const elVentas = document.getElementById('erp-kpi-ventas');
  const elVentasSub = document.getElementById('erp-kpi-ventas-sub');
  const elCartera = document.getElementById('erp-kpi-cartera');
  const elCarteraSub = document.getElementById('erp-kpi-cartera-sub');
  const elInv = document.getElementById('erp-kpi-inventario');
  const elInvSub = document.getElementById('erp-kpi-inventario-sub');
  const elAndrea = document.getElementById('erp-kpi-andrea');
  const elAndreaSub = document.getElementById('erp-kpi-andrea-sub');
  const elLeonor = document.getElementById('erp-kpi-leonor');
  const elLeonorSub = document.getElementById('erp-kpi-leonor-sub');

  if (elCaja) elCaja.textContent = fmtCOP(saldoCaja);
  if (elCajaSub) elCajaSub.textContent = `Entradas: ${fmtCOP(totalDebeCaja)} · Salidas: ${fmtCOP(totalHaberCaja)}`;
  if (elVentas) elVentas.textContent = fmtCOP(totalVentas);
  if (elVentasSub) elVentasSub.textContent = `${erpState.ventas.length} ventas registradas · Recaudado: ${fmtCOP(totalRecaudadoVentas)}`;
  if (elCartera) elCartera.textContent = fmtCOP(totalCarteraPorCobrar);
  if (elCarteraSub) elCarteraSub.textContent = `${clientesConDeuda} pedidos con saldo pendiente`;
  if (elInv) elInv.textContent = fmtCOP(totalValorStock);
  if (elInvSub) elInvSub.textContent = `${totalUnidadesStock} uds en stock · En consignación: ${fmtCOP(totalConsignacion)}`;
  if (elAndrea) elAndrea.textContent = fmtCOP(saldoAndrea);
  if (elAndreaSub) elAndreaSub.textContent = `Compras: ${fmtCOP(comprasAndrea)} · Abonado: ${fmtCOP(abonosAndrea)}`;
  if (elLeonor) elLeonor.textContent = fmtCOP(saldoLeonor);
  if (elLeonorSub) elLeonorSub.textContent = `Compras: ${fmtCOP(comprasLeonor)} · Abonado: ${fmtCOP(abonosLeonor)}`;
}

// -------------------------------------------------------------------------
// 3. SUB-MÓDULO 1: LIBRO MAYOR / CAJA GENERAL
// -------------------------------------------------------------------------
function renderCajaGeneralTable() {
  const tbody = document.getElementById('erp-caja-tbody');
  const tfoot = document.getElementById('erp-caja-tfoot');
  const searchInput = document.getElementById('erp-caja-search');
  if (!tbody || !erpState) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  tbody.innerHTML = '';

  let runningBalance = 0;
  let sumDebe = 0;
  let sumHaber = 0;

  erpState.cajaGeneral.forEach((row, idx) => {
    const debe = Number(row.debe) || 0;
    const haber = Number(row.haber) || 0;
    runningBalance += debe - haber;

    const matches = !query ||
      (row.descripcion && row.descripcion.toLowerCase().includes(query)) ||
      (row.categoria && row.categoria.toLowerCase().includes(query)) ||
      (row.fecha && row.fecha.includes(query));

    if (!matches) return;

    sumDebe += debe;
    sumHaber += haber;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:0.84rem; white-space:nowrap;">${row.fecha || '-'}</td>
      <td style="font-weight:600;">${row.descripcion}</td>
      <td><span class="erp-badge erp-badge-neutral">${row.categoria || 'General'}</span></td>
      <td class="num-col ${debe > 0 ? 'val-positive' : ''}">${debe > 0 ? fmtCOP(debe) : '-'}</td>
      <td class="num-col ${haber > 0 ? 'val-negative' : ''}">${haber > 0 ? fmtCOP(haber) : '-'}</td>
      <td class="num-col val-balance">${fmtCOP(runningBalance)}</td>
      <td style="text-align:center;">
        <button type="button" class="btn btn-danger btn-sm erp-del-caja" data-idx="${idx}" title="Eliminar fila">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (tfoot) {
    tfoot.innerHTML = `
      <tr class="erp-tfoot-totals">
        <td colspan="3">TOTALES LIBRO MAYOR (FÓRMULA AUTOMÁTICA: SALDO = DEBE - HABER)</td>
        <td class="num-col val-positive">${fmtCOP(sumDebe)}</td>
        <td class="num-col val-negative">${fmtCOP(sumHaber)}</td>
        <td class="num-col val-balance">${fmtCOP(runningBalance)}</td>
        <td></td>
      </tr>
    `;
  }

  tbody.querySelectorAll('.erp-del-caja').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (confirm('¿Eliminar este movimiento de Caja General? El saldo acumulado se recalculará automáticamente.')) {
        erpState.cajaGeneral.splice(idx, 1);
        saveERPDatabase();
        refreshAllERPViews();
      }
    });
  });
}

// -------------------------------------------------------------------------
// 4. SUB-MÓDULO 2: VENTAS, CLIENTES Y CARTERA POR COBRAR
// -------------------------------------------------------------------------
function renderVentasCarteraTable() {
  const tbody = document.getElementById('erp-ventas-tbody');
  const tfoot = document.getElementById('erp-ventas-tfoot');
  const searchInput = document.getElementById('erp-ventas-search');
  const filterSelect = document.getElementById('erp-ventas-filter');
  if (!tbody || !erpState) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filterMode = filterSelect ? filterSelect.value : 'all';

  tbody.innerHTML = '';

  let sumValor = 0;
  let sumInsumos = 0;
  let sumPago = 0;
  let sumDebe = 0;

  erpState.ventas.forEach((v, idx) => {
    const valor = Number(v.valor) || 0;
    const insumos = Number(v.insumos) || 0;
    const pago = Number(v.pago) || 0;
    const debe = Number(v.debe) || 0;

    const matchesSearch = !query ||
      (v.comprador && v.comprador.toLowerCase().includes(query)) ||
      (v.producto && v.producto.toLowerCase().includes(query)) ||
      (v.medioPago && v.medioPago.toLowerCase().includes(query));

    let matchesFilter = true;
    if (filterMode === 'pendientes') matchesFilter = debe > 0;
    else if (filterMode === 'pagados') matchesFilter = debe <= 0;
    else if (filterMode !== 'all') matchesFilter = (v.medioPago || '').toUpperCase().includes(filterMode);

    if (!matchesSearch || !matchesFilter) return;

    sumValor += valor;
    sumInsumos += insumos;
    sumPago += pago;
    sumDebe += debe;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:0.84rem; white-space:nowrap;">${v.fecha || '-'}</td>
      <td style="font-weight:700; color:var(--primary-deep);">${v.comprador || 'CLIENTE'}</td>
      <td>${v.producto}</td>
      <td><span class="erp-badge erp-badge-neutral">${v.medioPago || 'EFECTIVO'}</span></td>
      <td class="num-col" style="font-weight:700;">${fmtCOP(valor)}</td>
      <td class="num-col">${insumos > 0 ? fmtCOP(insumos) : '-'}</td>
      <td class="num-col val-positive">${pago > 0 ? fmtCOP(pago) : '$0'}</td>
      <td class="num-col ${debe > 0 ? 'val-negative' : ''}">${debe > 0 ? fmtCOP(debe) : '$0'}</td>
      <td>
        ${debe > 0
          ? `<span class="erp-badge erp-badge-pending">⏳ Debe ${fmtCOP(debe)}</span>`
          : `<span class="erp-badge erp-badge-paid">✅ Pagado</span>`
        }
      </td>
      <td style="white-space:nowrap;">
        ${debe > 0
          ? `<button type="button" class="btn btn-primary btn-sm erp-cobrar-venta" data-idx="${idx}" title="Marcar como pagado y sumar a Caja">✔ Cobrar</button>`
          : ''
        }
        <button type="button" class="btn btn-danger btn-sm erp-del-venta" data-idx="${idx}" title="Eliminar venta">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (tfoot) {
    tfoot.innerHTML = `
      <tr class="erp-tfoot-totals">
        <td colspan="4">TOTALES FORMULADOS DE VENTAS Y CARTERA</td>
        <td class="num-col">${fmtCOP(sumValor)}</td>
        <td class="num-col">${fmtCOP(sumInsumos)}</td>
        <td class="num-col val-positive">${fmtCOP(sumPago)}</td>
        <td class="num-col val-negative">${fmtCOP(sumDebe)}</td>
        <td colspan="2">Cartera pendiente: ${fmtCOP(sumDebe)}</td>
      </tr>
    `;
  }

  tbody.querySelectorAll('.erp-cobrar-venta').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const venta = erpState.ventas[idx];
      if (!venta) return;
      const montoPendiente = Number(venta.debe) || 0;
      const medio = prompt(`Registrar pago de ${venta.comprador} (${venta.producto}) por ${fmtCOP(montoPendiente)}.\nIngrese medio de pago (EFECTIVO, NEQUI, DAVIPLATA, BRE-B):`, 'NEQUI');
      if (!medio) return;
      venta.pago = (Number(venta.pago) || 0) + montoPendiente;
      venta.debe = 0;
      venta.medioPago = medio.toUpperCase();

      const addCaja = confirm(`¿Deseas registrar también la entrada de ${fmtCOP(montoPendiente)} en el Libro Mayor (Caja General)?`);
      if (addCaja) {
        erpState.cajaGeneral.push({
          id: 'cj-' + Date.now(),
          fecha: new Date().toISOString().slice(0, 10),
          descripcion: `PAGO CARTERA ${venta.comprador} (${venta.producto})`,
          categoria: 'Ingreso Venta',
          debe: montoPendiente,
          haber: 0
        });
      }
      saveERPDatabase();
      refreshAllERPViews();
      if (typeof showToast === 'function') showToast(`✅ Pago de ${venta.comprador} registrado correctamente.`);
    });
  });

  tbody.querySelectorAll('.erp-del-venta').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (confirm('¿Eliminar este registro de venta?')) {
        erpState.ventas.splice(idx, 1);
        saveERPDatabase();
        refreshAllERPViews();
      }
    });
  });
}

// -------------------------------------------------------------------------
// 5. SUB-MÓDULO 3: INVENTARIO FÍSICO, VALORIZADO Y CONSIGNACIÓN
// -------------------------------------------------------------------------
function renderInventarioTable() {
  const tbody = document.getElementById('erp-inventario-tbody');
  const tfoot = document.getElementById('erp-inventario-tfoot');
  const searchInput = document.getElementById('erp-inventario-search');
  if (!tbody || !erpState) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  tbody.innerHTML = '';

  let sumCantidad = 0;
  let sumTotalValorizado = 0;
  let sumConsignacion = 0;
  let sumAndrea = 0;
  let sumLeo = 0;

  erpState.inventario.forEach((item, idx) => {
    const matches = !query || (item.producto && item.producto.toLowerCase().includes(query));
    if (!matches) return;

    const cant = Number(item.cantidad) || 0;
    const pv = Number(item.precioVenta) || 0;
    const totalVal = cant * pv;
    const consig = Number(item.consignacion) || 0;
    const uAndrea = Number(item.andrea) || 0;
    const uLeo = Number(item.leo) || 0;

    sumCantidad += cant;
    sumTotalValorizado += totalVal;
    sumConsignacion += consig;
    sumAndrea += uAndrea;
    sumLeo += uLeo;

    let statusBadge = `<span class="erp-badge erp-badge-paid">🟢 Disponible</span>`;
    if (cant === 0) statusBadge = `<span class="erp-badge erp-badge-pending">🔴 Agotado</span>`;
    else if (cant === 1) statusBadge = `<span class="erp-badge erp-badge-warn">🟡 Última Unidad</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--primary-deep);">${item.producto}</td>
      <td style="text-align:center;">
        <div class="stock-stepper">
          <button type="button" class="stock-step-btn" data-action="dec" data-idx="${idx}">-</button>
          <span style="min-width:26px; text-align:center; font-weight:800; font-size:0.95rem;">${cant}</span>
          <button type="button" class="stock-step-btn" data-action="inc" data-idx="${idx}">+</button>
        </div>
      </td>
      <td class="num-col">${fmtCOP(pv)}</td>
      <td class="num-col val-balance">${fmtCOP(totalVal)}</td>
      <td class="num-col">${consig > 0 ? fmtCOP(consig) : '$0'}</td>
      <td style="text-align:center; font-weight:600;">${uAndrea || 0}</td>
      <td style="text-align:center; font-weight:600;">${uLeo || 0}</td>
      <td>${statusBadge}</td>
      <td style="text-align:center;">
        <button type="button" class="btn btn-danger btn-sm erp-del-inv" data-idx="${idx}" title="Eliminar referencia">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (tfoot) {
    tfoot.innerHTML = `
      <tr class="erp-tfoot-totals">
        <td>TOTAL INVENTARIO VALORIZADO (= CANTIDAD × P/VENTA)</td>
        <td style="text-align:center;">${sumCantidad} uds</td>
        <td>-</td>
        <td class="num-col val-balance">${fmtCOP(sumTotalValorizado)}</td>
        <td class="num-col">${fmtCOP(sumConsignacion)}</td>
        <td style="text-align:center;">${sumAndrea} uds</td>
        <td style="text-align:center;">${sumLeo} uds</td>
        <td colspan="2"></td>
      </tr>
    `;
  }

  tbody.querySelectorAll('.stock-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const action = btn.getAttribute('data-action');
      const item = erpState.inventario[idx];
      if (!item) return;
      if (action === 'inc') item.cantidad = (Number(item.cantidad) || 0) + 1;
      else if (action === 'dec') item.cantidad = Math.max(0, (Number(item.cantidad) || 0) - 1);
      saveERPDatabase();
      refreshAllERPViews();
    });
  });

  tbody.querySelectorAll('.erp-del-inv').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (confirm('¿Eliminar este producto del inventario?')) {
        erpState.inventario.splice(idx, 1);
        saveERPDatabase();
        refreshAllERPViews();
      }
    });
  });
}

// -------------------------------------------------------------------------
// 6. SUB-MÓDULO 4: TABLA UNIFICADA DE PROVEEDORES Y CUENTAS DE SOCIAS
// -------------------------------------------------------------------------
function renderProveedoresYSocias() {
  if (!erpState) return;

  const tbody = document.getElementById('erp-socias-unified-tbody');
  const tfoot = document.getElementById('erp-socias-unified-tfoot');
  const searchInput = document.getElementById('erp-socias-search');
  const filterQuienSelect = document.getElementById('erp-socias-filter-quien');
  const filterTipoSelect = document.getElementById('erp-socias-filter-tipo');
  const summaryPill = document.getElementById('erp-socias-summary-pill');

  // Actualizar badges de saldos individuales de Andrea y Leonor siempre
  let saldoAndrea = 0;
  (erpState.cuentaAndrea || []).forEach(r => {
    const m = Number(r.monto) || 0;
    saldoAndrea += (r.tipo === 'compra' ? m : -m);
  });
  let saldoLeonor = 0;
  (erpState.cuentaLeonor || []).forEach(r => {
    const m = Number(r.monto) || 0;
    saldoLeonor += (r.tipo === 'compra' ? m : -m);
  });

  const badgeAndrea = document.getElementById('erp-andrea-badge-saldo');
  const badgeLeonor = document.getElementById('erp-leonor-badge-saldo');
  if (badgeAndrea) badgeAndrea.textContent = fmtCOP(saldoAndrea);
  if (badgeLeonor) badgeLeonor.textContent = fmtCOP(saldoLeonor);

  if (!tbody) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filterQuien = filterQuienSelect ? filterQuienSelect.value : 'all';
  const filterTipo = filterTipoSelect ? filterTipoSelect.value : 'all';

  // Marcar botón rápido activo
  document.querySelectorAll('.erp-quick-socia-filter').forEach(btn => {
    const isAct = btn.getAttribute('data-filter') === filterQuien;
    btn.style.background = isAct ? '#2B2625' : '#FFFFFF';
    btn.style.color = isAct ? '#FAF6F0' : '#2B2625';
    btn.style.borderColor = isAct ? '#2B2625' : '#C9BCAE';
  });

  // Consolidar todos los movimientos de las 3 fuentes en una sola lista unificada
  const unifiedRows = [];

  (erpState.cuentaAndrea || []).forEach((row, idx) => {
    const m = Number(row.monto) || 0;
    const isCompra = row.tipo === 'compra';
    unifiedRows.push({
      sourceKey: 'cuentaAndrea',
      sourceIdx: idx,
      cuentaLabel: '👩‍💼 Socia: Andrea Ruiz',
      cuentaBadgeClass: 'erp-badge-neutral',
      fecha: row.fecha || '',
      concepto: row.concepto || '',
      tipo: isCompra ? 'compra' : 'abono',
      compraMonto: isCompra ? m : 0,
      abonoMonto: !isCompra ? m : 0
    });
  });

  (erpState.cuentaLeonor || []).forEach((row, idx) => {
    const m = Number(row.monto) || 0;
    const isCompra = row.tipo === 'compra';
    unifiedRows.push({
      sourceKey: 'cuentaLeonor',
      sourceIdx: idx,
      cuentaLabel: '👩‍💼 Socia: Leonor Herrera',
      cuentaBadgeClass: 'erp-badge-neutral',
      fecha: row.fecha || '',
      concepto: row.concepto || '',
      tipo: isCompra ? 'compra' : 'abono',
      compraMonto: isCompra ? m : 0,
      abonoMonto: !isCompra ? m : 0
    });
  });

  (erpState.proveedores || []).forEach((row, idx) => {
    const d = Number(row.debe) || 0;
    const h = Number(row.haber) || 0;
    const isCompra = d >= h;
    unifiedRows.push({
      sourceKey: 'proveedores',
      sourceIdx: idx,
      cuentaLabel: '🏭 Proveedor / General',
      cuentaBadgeClass: 'erp-badge-warn',
      fecha: row.fecha || '',
      concepto: row.proveedor || '',
      tipo: isCompra ? 'compra' : 'abono',
      compraMonto: d,
      abonoMonto: h
    });
  });

  // Filtrar según Cuenta/Responsable, Tipo y Búsqueda
  const filtered = unifiedRows.filter(item => {
    let matchQuien = true;
    if (filterQuien === 'cuentaAndrea') matchQuien = item.sourceKey === 'cuentaAndrea';
    else if (filterQuien === 'cuentaLeonor') matchQuien = item.sourceKey === 'cuentaLeonor';
    else if (filterQuien === 'socias') matchQuien = (item.sourceKey === 'cuentaAndrea' || item.sourceKey === 'cuentaLeonor');
    else if (filterQuien === 'proveedores') matchQuien = item.sourceKey === 'proveedores';

    let matchTipo = true;
    if (filterTipo === 'compra') matchTipo = item.tipo === 'compra';
    else if (filterTipo === 'abono') matchTipo = item.tipo === 'abono';

    const matchSearch = !query ||
      item.concepto.toLowerCase().includes(query) ||
      item.cuentaLabel.toLowerCase().includes(query) ||
      item.fecha.toLowerCase().includes(query);

    return matchQuien && matchTipo && matchSearch;
  });

  tbody.innerHTML = '';
  let runningSaldo = 0;
  let totalCompras = 0;
  let totalAbonos = 0;

  filtered.forEach(item => {
    totalCompras += item.compraMonto;
    totalAbonos += item.abonoMonto;
    runningSaldo += (item.compraMonto - item.abonoMonto);

    const isCompra = item.tipo === 'compra';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:0.8rem; white-space:nowrap;">${item.fecha || '-'}</td>
      <td><span class="erp-badge ${item.cuentaBadgeClass}">${item.cuentaLabel}</span></td>
      <td style="font-weight:600; color:#0f172a;">${item.concepto}</td>
      <td>
        ${isCompra
          ? `<span class="erp-badge erp-badge-warn">🛒 Compra Insumos (+)</span>`
          : `<span class="erp-badge erp-badge-paid">💸 Abono / Reembolso (-)</span>`
        }
      </td>
      <td class="num-col ${item.compraMonto > 0 ? 'val-negative' : ''}">${item.compraMonto > 0 ? '+' + fmtCOP(item.compraMonto) : '-'}</td>
      <td class="num-col ${item.abonoMonto > 0 ? 'val-positive' : ''}">${item.abonoMonto > 0 ? '-' + fmtCOP(item.abonoMonto) : '-'}</td>
      <td class="num-col val-balance">${fmtCOP(runningSaldo)}</td>
      <td style="text-align:center;">
        <button type="button" class="btn btn-danger btn-sm erp-del-unified-socia" data-key="${item.sourceKey}" data-idx="${item.sourceIdx}" title="Eliminar registro">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (summaryPill) {
    summaryPill.textContent = `${filtered.length} registros · Compras: ${fmtCOP(totalCompras)} · Abonos: ${fmtCOP(totalAbonos)} · Saldo Neto: ${fmtCOP(runningSaldo)}`;
  }

  if (tfoot) {
    tfoot.innerHTML = `
      <tr class="erp-tfoot-totals">
        <td colspan="4">TOTALES CONSOLIDADOS DE LA VISTA FILTRADA (${filtered.length} MOVIMIENTOS)</td>
        <td class="num-col val-negative">+${fmtCOP(totalCompras)}</td>
        <td class="num-col val-positive">-${fmtCOP(totalAbonos)}</td>
        <td class="num-col val-balance">${fmtCOP(runningSaldo)}</td>
        <td></td>
      </tr>
    `;
  }

  tbody.querySelectorAll('.erp-del-unified-socia').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-key');
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (confirm('¿Eliminar este movimiento? El saldo se recalculará automáticamente.')) {
        erpState[k].splice(idx, 1);
        saveERPDatabase();
        refreshAllERPViews();
      }
    });
  });
}

// -------------------------------------------------------------------------
// 7. SUB-MÓDULO 5: ESTIMADOR DE COSTOS Y CALCULADORA DE PRECIO FINAL
// -------------------------------------------------------------------------
function calculateLiveCostEstimator() {
  const gramosCera = parseFloat(document.getElementById('est-gramos-cera')?.value) || 0;
  const costoKgCera = parseFloat(document.getElementById('est-costo-kg-cera')?.value) || 0;
  const mlAroma = parseFloat(document.getElementById('est-ml-aroma')?.value) || 0;
  const costoMlAroma = parseFloat(document.getElementById('est-costo-ml-aroma')?.value) || 0;
  const costoPabilo = parseFloat(document.getElementById('est-costo-pabilo')?.value) || 0;
  const costoEnvase = parseFloat(document.getElementById('est-costo-envase')?.value) || 0;
  const costoEmpaque = parseFloat(document.getElementById('est-costo-empaque')?.value) || 0;
  const costoManoObra = parseFloat(document.getElementById('est-costo-mano-obra')?.value) || 0;

  const metodoPrecio = document.getElementById('est-metodo-precio')?.value || 'markup';
  const pctGanancia = parseFloat(document.getElementById('est-pct-ganancia')?.value) || 0;
  const redondeo = parseInt(document.getElementById('est-redondeo')?.value || '1000', 10);
  const precioManual = parseFloat(document.getElementById('est-precio-manual')?.value) || 0;

  const loteCantidad = Math.max(1, parseInt(document.getElementById('est-lote-cantidad')?.value || '1', 10));
  const loteDescuentoPct = Math.min(90, Math.max(0, parseFloat(document.getElementById('est-lote-descuento')?.value) || 0));

  // Costos por componente
  const costoCeraUnit = (gramosCera / 1000) * costoKgCera;
  const costoAromaUnit = mlAroma * costoMlAroma;
  const costoUnitarioTotal = Math.round(
    costoCeraUnit + costoAromaUnit + costoPabilo + costoEnvase + costoEmpaque + costoManoObra
  );

  // Cálculo del Precio Sugerido
  let precioCalculado = costoUnitarioTotal;
  if (metodoPrecio === 'margen') {
    const safeMargin = Math.min(95, Math.max(0, pctGanancia));
    precioCalculado = costoUnitarioTotal / (1 - safeMargin / 100);
  } else {
    precioCalculado = costoUnitarioTotal * (1 + pctGanancia / 100);
  }

  if (redondeo > 1) {
    precioCalculado = Math.round(precioCalculado / redondeo) * redondeo;
  } else {
    precioCalculado = Math.round(precioCalculado);
  }

  const precioFinalUnitario = precioManual > 0 ? Math.round(precioManual) : precioCalculado;
  const gananciaUnitaria = precioFinalUnitario - costoUnitarioTotal;
  const margenRealPct = precioFinalUnitario > 0
    ? Math.round((gananciaUnitaria / precioFinalUnitario) * 100)
    : 0;
  const markupRealPct = costoUnitarioTotal > 0
    ? Math.round((gananciaUnitaria / costoUnitarioTotal) * 100)
    : 0;

  // Actualizar etiquetas de sub-costos en el formulario
  const subCeraEl = document.getElementById('est-sub-cera');
  const subAromaEl = document.getElementById('est-sub-aroma');
  if (subCeraEl) subCeraEl.textContent = `Costo cera por unidad: ${fmtCOP(costoCeraUnit)}`;
  if (subAromaEl) subAromaEl.textContent = `Costo fragancia por unidad: ${fmtCOP(costoAromaUnit)}`;

  // Actualizar Tarjetas de Resultado Unitario
  const resCostoEl = document.getElementById('est-res-costo-unit');
  const resPrecioEl = document.getElementById('est-res-precio-final');
  const resGananciaEl = document.getElementById('est-res-ganancia-unit');
  const resMargenEl = document.getElementById('est-res-margen-pct');

  if (resCostoEl) resCostoEl.textContent = fmtCOP(costoUnitarioTotal);
  if (resPrecioEl) resPrecioEl.textContent = fmtCOP(precioFinalUnitario);
  if (resGananciaEl) resGananciaEl.textContent = fmtCOP(gananciaUnitaria);
  if (resMargenEl) resMargenEl.textContent = `${margenRealPct}% Margen (${markupRealPct}% s/costo)`;

  // Simulador por Lote / Volumen (Ej. 70 o 150 recordatorios)
  const precioUnitConDesc = Math.round(precioFinalUnitario * (1 - loteDescuentoPct / 100));
  const loteInsumosTotal = costoUnitarioTotal * loteCantidad;
  const loteVentaTotal = precioUnitConDesc * loteCantidad;
  const loteGananciaTotal = loteVentaTotal - loteInsumosTotal;
  const utilidadPorSocia = Math.round(loteGananciaTotal / 2);

  const bCantEl = document.getElementById('est-batch-qty-label');
  const bUnitDescEl = document.getElementById('est-batch-unit-price');
  const bInsumosEl = document.getElementById('est-batch-cost-total');
  const bVentaEl = document.getElementById('est-batch-sale-total');
  const bGananciaEl = document.getElementById('est-batch-profit-total');
  const bSociasEl = document.getElementById('est-batch-socias-split');

  if (bCantEl) bCantEl.textContent = `${loteCantidad} unidades`;
  if (bUnitDescEl) bUnitDescEl.textContent = `${fmtCOP(precioUnitConDesc)} c/u (${loteDescuentoPct}% desc.)`;
  if (bInsumosEl) bInsumosEl.textContent = fmtCOP(loteInsumosTotal);
  if (bVentaEl) bVentaEl.textContent = fmtCOP(loteVentaTotal);
  if (bGananciaEl) bGananciaEl.textContent = fmtCOP(loteGananciaTotal);
  if (bSociasEl) bSociasEl.textContent = `${fmtCOP(utilidadPorSocia)} Andrea / ${fmtCOP(utilidadPorSocia)} Leonor`;

  return {
    costoUnitarioTotal,
    precioFinalUnitario,
    gananciaUnitaria,
    margenRealPct,
    markupRealPct
  };
}

function renderFichasCosteoTable() {
  const tbody = document.getElementById('erp-fichas-costeo-tbody');
  if (!tbody || !erpState) return;
  tbody.innerHTML = '';

  erpState.fichasCosteo.forEach((f, idx) => {
    const costoCera = ((Number(f.gramosCera) || 0) / 1000) * (Number(f.costoKgCera) || 0);
    const costoAroma = (Number(f.mlAroma) || 0) * (Number(f.costoMlAroma) || 0);
    const costoTotal = Math.round(
      costoCera +
      costoAroma +
      (Number(f.costoPabiloColor) || 0) +
      (Number(f.costoEnvase) || 0) +
      (Number(f.costoEmpaque) || 0) +
      (Number(f.costoManoObra) || 0)
    );
    const precioFinal = Number(f.precioVentaFinal) || 0;
    const ganancia = precioFinal - costoTotal;
    const margen = precioFinal > 0 ? Math.round((ganancia / precioFinal) * 100) : 0;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--primary-deep);">${f.nombre}</td>
      <td style="font-size:0.82rem; color:var(--text-muted);">
        Cera: ${f.gramosCera}g (${fmtCOP(costoCera)}) · Aroma: ${f.mlAroma}ml (${fmtCOP(costoAroma)}) · Empaque/Envase: ${fmtCOP((Number(f.costoEnvase) || 0) + (Number(f.costoEmpaque) || 0))}
      </td>
      <td class="num-col val-negative">${fmtCOP(costoTotal)}</td>
      <td class="num-col val-balance">${fmtCOP(precioFinal)}</td>
      <td class="num-col val-positive">+${fmtCOP(ganancia)}</td>
      <td style="text-align:center;"><span class="erp-badge erp-badge-paid">${margen}% margen</span></td>
      <td style="white-space:nowrap;">
        <button type="button" class="btn btn-outline btn-sm erp-load-ficha" data-idx="${idx}">🧮 Cargar</button>
        <button type="button" class="btn btn-danger btn-sm erp-del-ficha" data-idx="${idx}">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.erp-load-ficha').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const f = erpState.fichasCosteo[idx];
      if (!f) return;
      document.getElementById('est-nombre-producto').value = f.nombre;
      document.getElementById('est-gramos-cera').value = f.gramosCera;
      document.getElementById('est-costo-kg-cera').value = f.costoKgCera;
      document.getElementById('est-ml-aroma').value = f.mlAroma;
      document.getElementById('est-costo-ml-aroma').value = f.costoMlAroma;
      document.getElementById('est-costo-pabilo').value = f.costoPabiloColor;
      document.getElementById('est-costo-envase').value = f.costoEnvase;
      document.getElementById('est-costo-empaque').value = f.costoEmpaque;
      document.getElementById('est-costo-mano-obra').value = f.costoManoObra;
      document.getElementById('est-pct-ganancia').value = f.markupPct || 120;
      document.getElementById('est-precio-manual').value = f.precioVentaFinal;
      const modeBadge = document.getElementById('est-mode-badge');
      if (modeBadge) {
        modeBadge.textContent = `🔵 Editando: ${f.nombre}`;
        modeBadge.className = 'erp-badge erp-badge-warn';
      }
      calculateLiveCostEstimator();
      document.getElementById('est-nombre-producto')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof showToast === 'function') showToast(`📐 Ficha "${f.nombre}" cargada en la calculadora.`);
    });
  });

  tbody.querySelectorAll('.erp-del-ficha').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (confirm('¿Eliminar esta ficha de costeo del recetario?')) {
        erpState.fichasCosteo.splice(idx, 1);
        saveERPDatabase();
        renderFichasCosteoTable();
      }
    });
  });
}

// -------------------------------------------------------------------------
// 8. EXPORTACIÓN A EXCEL (CSV UTF-8 CON BOM)
// -------------------------------------------------------------------------
function exportERPToCSV() {
  if (!erpState) return;
  let csv = '\uFEFF'; // BOM para que Excel en español abra tildes y columnas perfecto

  csv += '=== 1. LIBRO MAYOR / CAJA GENERAL ===\n';
  csv += 'FECHA,DESCRIPCION,CATEGORIA,DEBE,HABER,SALDO\n';
  let saldo = 0;
  erpState.cajaGeneral.forEach(r => {
    saldo += (Number(r.debe) || 0) - (Number(r.haber) || 0);
    csv += `${r.fecha},"${r.descripcion}","${r.categoria}",${r.debe || 0},${r.haber || 0},${saldo}\n`;
  });

  csv += '\n=== 2. REGISTRO DE VENTAS Y CARTERA ===\n';
  csv += 'FECHA,COMPRADOR,PRODUCTO,MEDIO DE PAGO,VALOR VENTA,INSUMOS,PAGO RECIBIDO,DEBE PENDIENTE\n';
  erpState.ventas.forEach(v => {
    csv += `${v.fecha},"${v.comprador}","${v.producto}","${v.medioPago}",${v.valor || 0},${v.insumos || 0},${v.pago || 0},${v.debe || 0}\n`;
  });

  csv += '\n=== 3. INVENTARIO FISICO Y VALORIZADO ===\n';
  csv += 'PRODUCTO,CANTIDAD,PRECIO VENTA,TOTAL VALORIZADO,CONSIGNACION,ANDREA,LEONOR\n';
  erpState.inventario.forEach(i => {
    const tot = (Number(i.cantidad) || 0) * (Number(i.precioVenta) || 0);
    csv += `"${i.producto}",${i.cantidad},${i.precioVenta},${tot},${i.consignacion || 0},${i.andrea || 0},${i.leo || 0}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Simone_Contabilidad_Inventario_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// -------------------------------------------------------------------------
// 8.5 DASHBOARD DE GRÁFICAS FINANCIERAS EJECUTIVAS (SVG & BARRAS DINÁMICAS)
// -------------------------------------------------------------------------
function fmtShortCOP(val) {
  const n = Math.abs(Number(val) || 0);
  const sign = (Number(val) || 0) < 0 ? '-' : '';
  if (n >= 1000000) return `${sign}$${(n / 1000000).toFixed(2).replace('.', ',')}M`;
  if (n >= 1000) return `${sign}$${Math.round(n / 1000)}k`;
  return `${sign}$${n}`;
}

function renderERPCharts() {
  if (!erpState) return;
  renderChartFlujoCaja();
  renderChartVentasMedios();
  renderChartSociasYProveedores();
  renderChartInventarioTop();
}

// GRÁFICA 1: Flujo de Caja Mensual (Barras Agrupadas Debe vs Haber + Línea de Saldo)
function renderChartFlujoCaja() {
  const container = document.getElementById('erp-chart-flujo-caja');
  if (!container) return;

  const monthNames = {
    '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic'
  };

  const monthlyMap = {};
  (erpState.cajaGeneral || []).forEach(r => {
    const ym = (r.fecha || '2026-06').slice(0, 7);
    if (!monthlyMap[ym]) monthlyMap[ym] = { ym, debe: 0, haber: 0 };
    monthlyMap[ym].debe += Number(r.debe) || 0;
    monthlyMap[ym].haber += Number(r.haber) || 0;
  });

  const months = Object.values(monthlyMap).sort((a, b) => a.ym.localeCompare(b.ym));
  if (months.length === 0) {
    container.innerHTML = '<div style="color:#64748b; font-size:0.8rem;">Sin movimientos registrados</div>';
    return;
  }

  let runningSaldo = 0;
  let maxVal = 100000;
  months.forEach(m => {
    runningSaldo += (m.debe - m.haber);
    m.saldo = runningSaldo;
    maxVal = Math.max(maxVal, m.debe, m.haber, Math.abs(m.saldo));
  });

  const svgW = 540;
  const svgH = 210;
  const padL = 48;
  const padR = 18;
  const padT = 22;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const stepX = plotW / months.length;
  const barW = Math.min(24, Math.max(12, stepX * 0.28));

  // Líneas guía horizontales
  let gridLines = '';
  for (let i = 0; i <= 4; i++) {
    const val = Math.round((maxVal * i) / 4);
    const y = padT + plotH - (i / 4) * plotH;
    gridLines += `
      <line x1="${padL}" y1="${y}" x2="${svgW - padR}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="${i === 0 ? '0' : '3,3'}" stroke-width="1" />
      <text x="${padL - 6}" y="${y + 3}" text-anchor="end" fill="#64748b" font-size="9.5" font-family="monospace">${fmtShortCOP(val)}</text>
    `;
  }

  let barsSvg = '';
  let linePoints = [];
  let dotsSvg = '';

  months.forEach((m, idx) => {
    const cx = padL + idx * stepX + stepX / 2;
    const hDebe = Math.max(2, (m.debe / maxVal) * plotH);
    const hHaber = Math.max(2, (m.haber / maxVal) * plotH);
    const yDebe = padT + plotH - hDebe;
    const yHaber = padT + plotH - hHaber;

    const ySaldo = padT + plotH - (Math.max(0, m.saldo) / maxVal) * plotH;
    linePoints.push(`${cx},${ySaldo}`);

    const parts = m.ym.split('-');
    const labelMes = `${monthNames[parts[1]] || parts[1]} ${parts[0].slice(2)}`;

    barsSvg += `
      <!-- Barra Debe (Entradas) -->
      <rect x="${cx - barW - 2}" y="${yDebe}" width="${barW}" height="${hDebe}" rx="3" fill="#059669">
        <title>${labelMes} · Entradas: ${fmtCOP(m.debe)}</title>
      </rect>
      <!-- Barra Haber (Salidas) -->
      <rect x="${cx + 2}" y="${yHaber}" width="${barW}" height="${hHaber}" rx="3" fill="#dc2626">
        <title>${labelMes} · Salidas: ${fmtCOP(m.haber)}</title>
      </rect>
      <!-- Etiqueta Mes -->
      <text x="${cx}" y="${svgH - 12}" text-anchor="middle" fill="#1e293b" font-size="10.5" font-weight="700">${labelMes}</text>
    `;

    dotsSvg += `
      <circle cx="${cx}" cy="${ySaldo}" r="4" fill="#0f172a" stroke="#ffffff" stroke-width="1.5">
        <title>${labelMes} · Saldo Acumulado: ${fmtCOP(m.saldo)}</title>
      </circle>
      <text x="${cx}" y="${Math.max(12, ySaldo - 7)}" text-anchor="middle" fill="#0f172a" font-size="9.5" font-weight="700" font-family="monospace">${fmtShortCOP(m.saldo)}</text>
    `;
  });

  const polyline = linePoints.length > 1
    ? `<polyline fill="none" stroke="#0f172a" stroke-width="2.2" points="${linePoints.join(' ')}" />`
    : '';

  container.innerHTML = `
    <div style="width:100%;">
      <svg viewBox="0 0 ${svgW} ${svgH}" style="width:100%; height:auto; overflow:visible;">
        ${gridLines}
        ${barsSvg}
        ${polyline}
        ${dotsSvg}
      </svg>
      <div style="display:flex; justify-content:space-between; gap:8px; padding-top:8px; border-top:1px solid #e2e8f0; font-size:0.74rem; color:#475569;">
        <span>Meses analizados: <strong>${months.length}</strong></span>
        <span>Saldo actual en Caja: <strong style="color:#065f46; font-family:var(--erp-font-mono);">${fmtCOP(runningSaldo)}</strong></span>
      </div>
    </div>
  `;
}

// GRÁFICA 2: Ventas por Medio de Pago & Estado de Cartera (Dona SVG + Barras)
function renderChartVentasMedios() {
  const container = document.getElementById('erp-chart-ventas-medios');
  if (!container) return;

  const mediosMap = {
    'NEQUI': { label: 'Nequi', val: 0, color: '#1d4ed8' },
    'EFECTIVO': { label: 'Efectivo', val: 0, color: '#059669' },
    'DAVIPLATA': { label: 'Daviplata', val: 0, color: '#dc2626' },
    'BRE-B': { label: 'Bre-B', val: 0, color: '#7c3aed' },
    'PENDIENTE': { label: 'Por Cobrar (Cartera)', val: 0, color: '#d97706' }
  };

  let totalVentas = 0;
  let totalRecaudado = 0;
  let totalDebe = 0;

  (erpState.ventas || []).forEach(v => {
    const valor = Number(v.valor) || 0;
    const pago = Number(v.pago) || 0;
    const debe = Number(v.debe) || 0;
    totalVentas += valor;
    totalRecaudado += pago;
    totalDebe += debe;

    const rawMedio = (v.medioPago || 'EFECTIVO').toUpperCase();
    if (debe > 0) {
      mediosMap['PENDIENTE'].val += debe;
    }
    if (pago > 0) {
      if (rawMedio.includes('NEQUI')) mediosMap['NEQUI'].val += pago;
      else if (rawMedio.includes('DAVI')) mediosMap['DAVIPLATA'].val += pago;
      else if (rawMedio.includes('BRE')) mediosMap['BRE-B'].val += pago;
      else mediosMap['EFECTIVO'].val += pago;
    }
  });

  const items = Object.values(mediosMap).filter(m => m.val > 0).sort((a, b) => b.val - a.val);
  const sumMedios = items.reduce((acc, m) => acc + m.val, 0) || 1;

  // Construir SVG Donut con stroke-dasharray
  const r = 56;
  const c = 2 * Math.PI * r;
  let offset = 0;
  let segmentsSvg = '';

  items.forEach(item => {
    const frac = item.val / sumMedios;
    const dash = frac * c;
    segmentsSvg += `
      <circle cx="80" cy="80" r="${r}" fill="transparent"
        stroke="${item.color}" stroke-width="22"
        stroke-dasharray="${dash} ${c - dash}"
        stroke-dashoffset="${-offset}"
        transform="rotate(-90 80 80)">
        <title>${item.label}: ${fmtCOP(item.val)} (${Math.round(frac * 100)}%)</title>
      </circle>
    `;
    offset += dash;
  });

  const pctRecaudado = totalVentas > 0 ? Math.round((totalRecaudado / totalVentas) * 100) : 100;

  const barsHtml = items.map(item => {
    const pct = Math.round((item.val / sumMedios) * 100);
    return `
      <div class="erp-hbar-row">
        <div class="erp-hbar-top">
          <span class="erp-hbar-label">
            <i class="erp-legend-dot" style="background:${item.color}; margin-right:5px;"></i>${item.label}
          </span>
          <span class="erp-hbar-val">${fmtCOP(item.val)} (${pct}%)</span>
        </div>
        <div class="erp-hbar-track">
          <div class="erp-hbar-fill" style="width:${pct}%; background:${item.color};"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="erp-donut-layout">
      <div style="text-align:center;">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="${r}" fill="transparent" stroke="#e2e8f0" stroke-width="22" />
          ${segmentsSvg}
          <text x="80" y="75" text-anchor="middle" fill="#64748b" font-size="9.5" font-weight="700">TOTAL VENTAS</text>
          <text x="80" y="92" text-anchor="middle" fill="#0f172a" font-size="12.5" font-weight="800" font-family="monospace">${fmtShortCOP(totalVentas)}</text>
        </svg>
        <div style="font-size:0.72rem; color:#475569; font-weight:700;">
          Recaudado: <span style="color:#059669;">${pctRecaudado}%</span> · Por cobrar: <span style="color:#dc2626;">${100 - pctRecaudado}%</span>
        </div>
      </div>
      <div class="erp-hbar-list">
        ${barsHtml}
      </div>
    </div>
  `;
}

// GRÁFICA 3: Cuentas de Socias (Andrea vs Leonor) y Top Proveedores
function renderChartSociasYProveedores() {
  const container = document.getElementById('erp-chart-socias-proveedores');
  if (!container) return;

  let compAndrea = 0, abonoAndrea = 0;
  (erpState.cuentaAndrea || []).forEach(r => {
    const m = Number(r.monto) || 0;
    if (r.tipo === 'compra') compAndrea += m;
    else abonoAndrea += m;
  });
  const saldoAndrea = compAndrea - abonoAndrea;
  const pctAndrea = compAndrea > 0 ? Math.min(100, Math.round((abonoAndrea / compAndrea) * 100)) : 0;

  let compLeonor = 0, abonoLeonor = 0;
  (erpState.cuentaLeonor || []).forEach(r => {
    const m = Number(r.monto) || 0;
    if (r.tipo === 'compra') compLeonor += m;
    else abonoLeonor += m;
  });
  const saldoLeonor = compLeonor - abonoLeonor;
  const pctLeonor = compLeonor > 0 ? Math.min(100, Math.round((abonoLeonor / compLeonor) * 100)) : 0;

  // Consolidar principales proveedores de insumos
  const supTotals = {
    'VELA BELLA (Cera/Insumos)': 0,
    'TEMU (Moldes/Empaques)': 0,
    'COMERCIAL 360': 0,
    'AROMAS / QUIMIFRESH / OTROS': 0
  };

  const addPurchase = (concepto, monto) => {
    if (monto <= 0) return;
    const c = (concepto || '').toUpperCase();
    if (c.includes('VELA BELLA') || c.includes('SILICONA')) supTotals['VELA BELLA (Cera/Insumos)'] += monto;
    else if (c.includes('TEMU')) supTotals['TEMU (Moldes/Empaques)'] += monto;
    else if (c.includes('360')) supTotals['COMERCIAL 360'] += monto;
    else supTotals['AROMAS / QUIMIFRESH / OTROS'] += monto;
  };

  (erpState.cuentaAndrea || []).forEach(r => { if (r.tipo === 'compra') addPurchase(r.concepto, Number(r.monto) || 0); });
  (erpState.cuentaLeonor || []).forEach(r => { if (r.tipo === 'compra') addPurchase(r.concepto, Number(r.monto) || 0); });
  (erpState.proveedores || []).forEach(r => { addPurchase(r.proveedor, Number(r.debe) || 0); });

  const maxSup = Math.max(1, ...Object.values(supTotals));
  const supBars = Object.entries(supTotals).map(([name, val]) => {
    const w = Math.round((val / maxSup) * 100);
    return `
      <div class="erp-hbar-row">
        <div class="erp-hbar-top">
          <span class="erp-hbar-label">${name}</span>
          <span class="erp-hbar-val">${fmtCOP(val)}</span>
        </div>
        <div class="erp-hbar-track" style="height:8px;">
          <div class="erp-hbar-fill" style="width:${w}%; background:#334155;"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div class="erp-Socias-compare-grid">
        <!-- Box Andrea -->
        <div class="erp-socia-mini-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="font-size:0.78rem; color:#0f172a;">👩‍💼 Andrea Ruiz</strong>
            <span class="erp-badge erp-badge-warn">Por reembolsar: ${fmtCOP(saldoAndrea)}</span>
          </div>
          <div style="font-size:0.72rem; color:#475569; display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Compras: <strong>${fmtCOP(compAndrea)}</strong></span>
            <span>Abonado: <strong style="color:#059669;">${fmtCOP(abonoAndrea)} (${pctAndrea}%)</strong></span>
          </div>
          <div class="erp-hbar-track" style="height:9px;">
            <div class="erp-hbar-fill" style="width:${pctAndrea}%; background:#059669;"></div>
          </div>
        </div>

        <!-- Box Leonor -->
        <div class="erp-socia-mini-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="font-size:0.78rem; color:#0f172a;">👩‍💼 Leonor Herrera</strong>
            <span class="erp-badge erp-badge-warn">Por reembolsar: ${fmtCOP(saldoLeonor)}</span>
          </div>
          <div style="font-size:0.72rem; color:#475569; display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Compras: <strong>${fmtCOP(compLeonor)}</strong></span>
            <span>Abonado: <strong style="color:#059669;">${fmtCOP(abonoLeonor)} (${pctLeonor}%)</strong></span>
          </div>
          <div class="erp-hbar-track" style="height:9px;">
            <div class="erp-hbar-fill" style="width:${pctLeonor}%; background:#059669;"></div>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #e2e8f0; padding-top:8px;">
        <div style="font-size:0.72rem; font-weight:700; text-transform:uppercase; color:#475569; margin-bottom:6px;">
          🏭 Concentración de Compras por Proveedor / Rubro
        </div>
        <div class="erp-hbar-list" style="gap:6px;">
          ${supBars}
        </div>
      </div>
    </div>
  `;
}

// GRÁFICA 4: Top Referencias de Mayor Valor en Inventario ($ COP)
function renderChartInventarioTop() {
  const container = document.getElementById('erp-chart-inventario-top');
  if (!container) return;

  const ranked = (erpState.inventario || [])
    .map(item => {
      const cant = Number(item.cantidad) || 0;
      const pv = Number(item.precioVenta) || 0;
      return {
        producto: item.producto,
        cantidad: cant,
        totalVal: cant * pv
      };
    })
    .filter(i => i.totalVal > 0)
    .sort((a, b) => b.totalVal - a.totalVal)
    .slice(0, 7);

  const maxVal = ranked.length > 0 ? ranked[0].totalVal : 1;

  const rowsHtml = ranked.map((r, idx) => {
    const pct = Math.round((r.totalVal / maxVal) * 100);
    const color = idx === 0 ? '#2B2625' : idx < 3 ? '#D37B5D' : '#726563';
    return `
      <div class="erp-hbar-row">
        <div class="erp-hbar-top">
          <span class="erp-hbar-label">${idx + 1}. ${r.producto} <small style="color:#726563;">(${r.cantidad} uds)</small></span>
          <span class="erp-hbar-val">${fmtCOP(r.totalVal)}</span>
        </div>
        <div class="erp-hbar-track" style="height:9px;">
          <div class="erp-hbar-fill" style="width:${pct}%; background:${color};"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="erp-hbar-list">
      ${rowsHtml}
    </div>
  `;
}

// -------------------------------------------------------------------------
// 9. INICIALIZACIÓN Y EVENTOS DE FORMULARIOS DEL ERP
// -------------------------------------------------------------------------
function refreshAllERPViews() {
  renderERPKPIs();
  renderERPCharts();
  renderCajaGeneralTable();
  renderVentasCarteraTable();
  renderInventarioTable();
  renderProveedoresYSocias();
  renderFichasCosteoTable();
  calculateLiveCostEstimator();
}

function initERPAccountingModule() {
  loadERPDatabase();

  // Sub-tabs navigation inside ERP
  const subBtns = document.querySelectorAll('.erp-subtab-btn');
  const subPanels = document.querySelectorAll('.erp-subpanel');
  subBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-subtab');
      subBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      subPanels.forEach(p => {
        p.classList.toggle('active', p.id === target);
      });
    });
  });

  // Search and Filter inputs
  document.getElementById('erp-caja-search')?.addEventListener('input', renderCajaGeneralTable);
  document.getElementById('erp-ventas-search')?.addEventListener('input', renderVentasCarteraTable);
  document.getElementById('erp-ventas-filter')?.addEventListener('change', renderVentasCarteraTable);
  document.getElementById('erp-inventario-search')?.addEventListener('input', renderInventarioTable);
  document.getElementById('erp-socias-search')?.addEventListener('input', renderProveedoresYSocias);
  document.getElementById('erp-socias-filter-quien')?.addEventListener('change', renderProveedoresYSocias);
  document.getElementById('erp-socias-filter-tipo')?.addEventListener('change', renderProveedoresYSocias);

  // Botones de vista rápida por cuenta (Todo, Andrea, Leonor, Socias, Proveedores)
  document.querySelectorAll('.erp-quick-socia-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter') || 'all';
      const selectEl = document.getElementById('erp-socias-filter-quien');
      if (selectEl) {
        selectEl.value = f;
      }
      renderProveedoresYSocias();
    });
  });

  // Form 1: Agregar Movimiento a Caja General
  const formCaja = document.getElementById('erp-form-add-caja');
  if (formCaja) {
    formCaja.addEventListener('submit', (e) => {
      e.preventDefault();
      const fecha = document.getElementById('add-caja-fecha').value || new Date().toISOString().slice(0, 10);
      const desc = document.getElementById('add-caja-desc').value.trim().toUpperCase();
      const cat = document.getElementById('add-caja-cat').value;
      const tipo = document.getElementById('add-caja-tipo').value;
      const monto = Math.round(parseFloat(document.getElementById('add-caja-monto').value) || 0);
      if (!desc || monto <= 0) return;

      erpState.cajaGeneral.push({
        id: 'cj-' + Date.now(),
        fecha,
        descripcion: desc,
        categoria: cat,
        debe: tipo === 'debe' ? monto : 0,
        haber: tipo === 'haber' ? monto : 0
      });
      saveERPDatabase();
      formCaja.reset();
      document.getElementById('add-caja-fecha').value = new Date().toISOString().slice(0, 10);
      refreshAllERPViews();
      if (typeof showToast === 'function') showToast('✅ Movimiento agregado a Caja General.');
    });
  }

  // Form 2: Registrar Nueva Venta / Cuenta por Cobrar
  const formVenta = document.getElementById('erp-form-add-venta');
  if (formVenta) {
    formVenta.addEventListener('submit', (e) => {
      e.preventDefault();
      const fecha = document.getElementById('add-venta-fecha').value || new Date().toISOString().slice(0, 10);
      const comprador = document.getElementById('add-venta-comprador').value.trim().toUpperCase();
      const producto = document.getElementById('add-venta-producto').value.trim().toUpperCase();
      const medioPago = document.getElementById('add-venta-medio').value;
      const valor = Math.round(parseFloat(document.getElementById('add-venta-valor').value) || 0);
      const insumos = Math.round(parseFloat(document.getElementById('add-venta-insumos').value) || 0);
      const pago = Math.round(parseFloat(document.getElementById('add-venta-pago').value) || 0);
      const debe = Math.max(0, valor - pago);

      if (!comprador || !producto || valor <= 0) return;

      erpState.ventas.unshift({
        id: 'v-' + Date.now(),
        fecha,
        comprador,
        producto,
        medioPago,
        valor,
        insumos,
        pago,
        debe
      });
      saveERPDatabase();
      formVenta.reset();
      document.getElementById('add-venta-fecha').value = new Date().toISOString().slice(0, 10);
      refreshAllERPViews();
      if (typeof showToast === 'function') showToast(`✅ Venta a ${comprador} registrada.`);
    });
  }

  // Form 3: Agregar / Actualizar Producto en Inventario
  const formInv = document.getElementById('erp-form-add-inv');
  if (formInv) {
    formInv.addEventListener('submit', (e) => {
      e.preventDefault();
      const producto = document.getElementById('add-inv-producto').value.trim().toUpperCase();
      const cantidad = parseInt(document.getElementById('add-inv-cantidad').value || '0', 10);
      const precioVenta = Math.round(parseFloat(document.getElementById('add-inv-precio').value) || 0);
      const consignacion = Math.round(parseFloat(document.getElementById('add-inv-consig').value) || 0);
      const andrea = parseInt(document.getElementById('add-inv-andrea').value || '0', 10);
      const leo = parseInt(document.getElementById('add-inv-leo').value || '0', 10);

      if (!producto || precioVenta <= 0) return;

      erpState.inventario.push({
        id: 'inv-' + Date.now(),
        producto,
        cantidad,
        precioVenta,
        consignacion,
        andrea,
        leo
      });
      saveERPDatabase();
      formInv.reset();
      refreshAllERPViews();
      if (typeof showToast === 'function') showToast(`📦 "${producto}" agregado al inventario.`);
    });
  }

  // Form 4: Movimiento Unificado (Cuenta Socia Andrea / Leonor / Proveedores)
  const formSocia = document.getElementById('erp-form-add-socia');
  if (formSocia) {
    formSocia.addEventListener('submit', (e) => {
      e.preventDefault();
      const sociaKey = document.getElementById('add-socia-quien').value; // 'cuentaAndrea', 'cuentaLeonor' o 'proveedores'
      const fecha = document.getElementById('add-socia-fecha').value || new Date().toISOString().slice(0, 10);
      const concepto = document.getElementById('add-socia-concepto').value.trim().toUpperCase();
      const tipo = document.getElementById('add-socia-tipo').value; // 'compra' o 'abono'
      const monto = Math.round(parseFloat(document.getElementById('add-socia-monto').value) || 0);
      if (!concepto || monto <= 0) return;

      if (sociaKey === 'proveedores') {
        erpState.proveedores.push({
          id: 'pr-' + Date.now(),
          fecha,
          proveedor: concepto,
          debe: tipo === 'compra' ? monto : 0,
          haber: tipo === 'abono' ? monto : 0
        });
      } else {
        erpState[sociaKey].push({
          id: 'cs-' + Date.now(),
          fecha,
          concepto,
          tipo,
          monto
        });
      }
      saveERPDatabase();
      formSocia.reset();
      document.getElementById('add-socia-fecha').value = new Date().toISOString().slice(0, 10);
      refreshAllERPViews();
      if (typeof showToast === 'function') showToast('✅ Movimiento registrado en la tabla unificada.');
    });
  }

  // Eventos en vivo para la Calculadora de Costos y Precio Final
  const costInputs = [
    'est-gramos-cera', 'est-costo-kg-cera', 'est-ml-aroma', 'est-costo-ml-aroma',
    'est-costo-pabilo', 'est-costo-envase', 'est-costo-empaque', 'est-costo-mano-obra',
    'est-metodo-precio', 'est-pct-ganancia', 'est-redondeo', 'est-precio-manual',
    'est-lote-cantidad', 'est-lote-descuento'
  ];
  costInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calculateLiveCostEstimator);
      el.addEventListener('change', calculateLiveCostEstimator);
    }
  });

  // Botones para Limpiar y Crear un Nuevo Cálculo desde Cero
  const resetToNewCalculation = () => {
    const nameInput = document.getElementById('est-nombre-producto');
    if (nameInput) nameInput.value = '';
    document.getElementById('est-gramos-cera').value = 0;
    document.getElementById('est-costo-kg-cera').value = 25000;
    document.getElementById('est-ml-aroma').value = 0;
    document.getElementById('est-costo-ml-aroma').value = 220;
    document.getElementById('est-costo-pabilo').value = 0;
    document.getElementById('est-costo-envase').value = 0;
    document.getElementById('est-costo-empaque').value = 0;
    document.getElementById('est-costo-mano-obra').value = 0;
    document.getElementById('est-pct-ganancia').value = 120;
    document.getElementById('est-precio-manual').value = 0;

    const modeBadge = document.getElementById('est-mode-badge');
    if (modeBadge) {
      modeBadge.textContent = '🟢 Nuevo Cálculo desde Cero';
      modeBadge.className = 'erp-badge erp-badge-paid';
    }
    calculateLiveCostEstimator();
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nameInput.focus();
    }
    if (typeof showToast === 'function') showToast('✨ Calculadora limpia. Ingresa el nombre y los gramos de tu nueva vela.');
  };

  document.getElementById('est-new-calc-btn')?.addEventListener('click', resetToNewCalculation);
  document.getElementById('est-new-calc-btn-bottom')?.addEventListener('click', resetToNewCalculation);

  // Botón Guardar Ficha de Costeo en el Recetario
  const btnSaveFicha = document.getElementById('est-save-ficha-btn');
  if (btnSaveFicha) {
    btnSaveFicha.addEventListener('click', () => {
      const nombre = (document.getElementById('est-nombre-producto')?.value || '').trim();
      if (!nombre) {
        alert('Escribe primero el nombre de la vela o producto que estás costeando.');
        document.getElementById('est-nombre-producto')?.focus();
        return;
      }
      const calc = calculateLiveCostEstimator();
      const newFichaData = {
        id: 'fc-' + Date.now(),
        nombre,
        gramosCera: parseFloat(document.getElementById('est-gramos-cera')?.value) || 0,
        costoKgCera: parseFloat(document.getElementById('est-costo-kg-cera')?.value) || 0,
        mlAroma: parseFloat(document.getElementById('est-ml-aroma')?.value) || 0,
        costoMlAroma: parseFloat(document.getElementById('est-costo-ml-aroma')?.value) || 0,
        costoPabiloColor: parseFloat(document.getElementById('est-costo-pabilo')?.value) || 0,
        costoEnvase: parseFloat(document.getElementById('est-costo-envase')?.value) || 0,
        costoEmpaque: parseFloat(document.getElementById('est-costo-empaque')?.value) || 0,
        costoManoObra: parseFloat(document.getElementById('est-costo-mano-obra')?.value) || 0,
        markupPct: parseFloat(document.getElementById('est-pct-ganancia')?.value) || 100,
        precioVentaFinal: calc.precioFinalUnitario
      };

      const existingIdx = erpState.fichasCosteo.findIndex(f => f.nombre.toLowerCase() === nombre.toLowerCase());
      if (existingIdx !== -1) {
        newFichaData.id = erpState.fichasCosteo[existingIdx].id;
        erpState.fichasCosteo[existingIdx] = newFichaData;
      } else {
        erpState.fichasCosteo.unshift(newFichaData);
      }

      saveERPDatabase();
      renderFichasCosteoTable();
      if (typeof showToast === 'function') showToast(`💾 Ficha "${nombre}" guardada con Precio Final ${fmtCOP(calc.precioFinalUnitario)}.`);
    });
  }

  // Botón Enviar Producto Costeado al Inventario
  const btnSendToInv = document.getElementById('est-send-to-inv-btn');
  if (btnSendToInv) {
    btnSendToInv.addEventListener('click', () => {
      const nombre = (document.getElementById('est-nombre-producto')?.value || '').trim().toUpperCase();
      if (!nombre) {
        alert('Escribe primero el nombre del producto para enviarlo al inventario.');
        return;
      }
      const calc = calculateLiveCostEstimator();
      const existing = erpState.inventario.find(i => i.producto.toUpperCase() === nombre);
      if (existing) {
        existing.precioVenta = calc.precioFinalUnitario;
      } else {
        erpState.inventario.unshift({
          id: 'inv-' + Date.now(),
          producto: nombre,
          cantidad: 1,
          precioVenta: calc.precioFinalUnitario,
          consignacion: 0,
          andrea: 0,
          leo: 0
        });
      }
      saveERPDatabase();
      refreshAllERPViews();
      if (typeof showToast === 'function') showToast(`📦 "${nombre}" actualizado en Inventario a ${fmtCOP(calc.precioFinalUnitario)}.`);
    });
  }

  // Botón de Exportar CSV
  document.getElementById('erp-export-csv-btn')?.addEventListener('click', exportERPToCSV);

  // Set default dates on forms
  const today = new Date().toISOString().slice(0, 10);
  ['add-caja-fecha', 'add-venta-fecha', 'add-prov-fecha', 'add-socia-fecha'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = today;
  });

  refreshAllERPViews();
}

document.addEventListener('DOMContentLoaded', () => {
  initERPAccountingModule();
});
