/**
 * Catálogo de ayuda electrónica por campo. Cada entrada explica el CONCEPTO del campo (qué
 * es / para qué sirve) y la FORMA DE USO (cómo completarlo bien), con un ejemplo cuando
 * ayuda. Los formularios lo consumen por clave (`<Field help="transactions.expense.amount">`),
 * así el texto vive en un solo lugar y un test verifica que ninguna clave usada falte.
 *
 * @typedef {{ title: string, concept: string, usage: string, example?: string }} FieldHelpEntry
 * @type {Record<string, FieldHelpEntry>}
 */
export const FIELD_HELP = {
  // --- Autenticación ---
  'auth.email': {
    title: 'Correo electrónico',
    concept: 'Es tu identificador en Luki: con él inicias sesión y te enviamos los avisos de la cuenta, como el enlace para restablecer tu contraseña.',
    usage: 'Escribe un correo al que tengas acceso, con @ y dominio, sin espacios.',
    example: 'tucorreo@gmail.com',
  },
  'auth.displayName': {
    title: 'Nombre',
    concept: 'Es el nombre con el que te ven los demás, por ejemplo los miembros de tus grupos de gastos compartidos, y con el que Luki te saluda.',
    usage: 'Escribe tu nombre o cómo te conocen. No necesita ser único.',
    example: 'Renzo',
  },
  'auth.password': {
    title: 'Contraseña',
    concept: 'Es la clave secreta que protege tu cuenta y tus datos financieros.',
    usage: 'Escribe la contraseña con la que te registraste. Usa el ojo del campo para comprobar lo que escribes. Si no la recuerdas, usa "¿Olvidaste tu contraseña?".',
  },
  'auth.newPassword': {
    title: 'Contraseña nueva',
    concept: 'Es la clave secreta que protegerá tu cuenta desde ahora; reemplaza a la anterior.',
    usage: 'Usa al menos 8 caracteres. Combina letras, números y símbolos, y no repitas una contraseña de otro servicio.',
    example: 'Mínimo 8 caracteres',
  },
  'auth.confirmPassword': {
    title: 'Confirmar contraseña',
    concept: 'Es una segunda escritura de la contraseña para asegurar que no cometiste un error de tipeo, ya que no se muestra en pantalla.',
    usage: 'Vuelve a escribir exactamente la misma contraseña del campo anterior. Si no coinciden, te avisamos.',
  },

  // --- Movimientos ---
  'transactions.expense.amount': {
    title: 'Monto del gasto',
    concept: 'Es cuánto dinero salió de tu bolsillo en este gasto, en soles (S/).',
    usage: 'Escribe solo el número, con punto para los decimales y hasta 2 decimales. Debe ser mayor que 0.',
    example: '24.50',
  },
  'transactions.expense.merchant': {
    title: 'Comercio o destinatario',
    concept: 'Es el lugar o la persona a quien pagaste. Luki lo usa para reconocerlo la próxima vez y proponerte la categoría.',
    usage: 'Escribe el nombre del comercio, del servicio o de la persona, tal como lo reconocerías luego en tu lista.',
    example: 'Almuerzo, Uber, Juan Pérez',
  },
  'transactions.expense.category': {
    title: 'Categoría',
    concept: 'Es el tipo de gasto (comida, transporte, salud…). Con ella Luki arma el resumen de en qué se te va el dinero cada mes.',
    usage: 'Elige la que mejor describa el gasto. Si dudas, elige "Otros"; podrás cambiarla después desde Movimientos.',
  },
  'transactions.income.amount': {
    title: 'Monto del ingreso',
    concept: 'Es cuánto dinero recibiste, en soles (S/). Se suma a tus ingresos del mes.',
    usage: 'Escribe solo el número, con punto para los decimales y hasta 2 decimales. Debe ser mayor que 0.',
    example: '1500.00',
  },
  'transactions.income.source': {
    title: 'Origen del ingreso',
    concept: 'Es de quién o de dónde viene el dinero. Te ayuda a reconocer el ingreso en tu historial.',
    usage: 'Escribe el nombre de la persona, la empresa o el concepto que te pagó.',
    example: 'Sueldo, Juan Pérez',
  },
  'transactions.complete.amount': {
    title: 'Monto',
    concept: 'Es el importe real del gasto, en soles (S/). Luki no pudo leerlo del correo, por eso lo completas tú.',
    usage: 'Cópialo de tu constancia o app del banco. Solo el número, con punto para los decimales.',
    example: '10.00',
  },
  'transactions.complete.merchant': {
    title: '¿En qué o a quién?',
    concept: 'Es el comercio, servicio o persona a quien pagaste. Luki no lo identificó en el correo.',
    usage: 'Escribe cómo quieres ver este gasto en tu lista. Puedes mirar el detalle de la constancia para saber el nombre.',
    example: 'Metropolitano, Almuerzo',
  },
  'transactions.complete.category': {
    title: 'Categoría',
    concept: 'Es el tipo de gasto con el que se cuenta en tu resumen mensual.',
    usage: 'Elige la que mejor lo describa. Podrás cambiarla después desde la lista de movimientos.',
  },


  // --- Grupos ---
  'groups.name': {
    title: 'Nombre del grupo',
    concept: 'Un grupo reúne a varias personas para compartir gastos y saber quién le debe a quién. El nombre es cómo lo reconocen todos los miembros.',
    usage: 'Elige un nombre corto que describa la ocasión o el grupo de personas.',
    example: 'Viaje a Cusco, Depa con Juan',
  },
  'groups.inviteEmail': {
    title: 'Correo del invitado',
    concept: 'Es el correo con el que la otra persona se registró en Luki. Le llegará una invitación para unirse al grupo.',
    usage: 'Escribe el correo exacto de su cuenta. Solo puedes invitar a quien ya tenga cuenta; si no la tiene, pídele que se registre primero.',
    example: 'amigo@ejemplo.com',
  },
  'groups.expense.description': {
    title: 'Descripción del gasto',
    concept: 'Es el motivo del gasto compartido, para que todo el grupo entienda de qué se trata.',
    usage: 'Escribe en pocas palabras qué se pagó.',
    example: 'Hotel, Cena, Taxi',
  },
  'groups.expense.amount': {
    title: 'Monto total',
    concept: 'Es lo que costó el gasto completo, en soles (S/), sin dividir. Luki lo reparte entre quienes participan.',
    usage: 'Escribe el total pagado, con punto para los decimales. Debe ser mayor que 0.',
    example: '120.00',
  },
  'groups.expense.paidBy': {
    title: '¿Quién pagó?',
    concept: 'Es el miembro que puso el dinero de su bolsillo. Los demás participantes le quedarán debiendo su parte.',
    usage: 'Elige a la persona que realizó el pago. Si fuiste tú, elige "Tú".',
  },
  'groups.expense.participants': {
    title: '¿Entre quiénes se divide?',
    concept: 'Son las personas que se benefician del gasto y deben pagar su parte. El monto se divide en partes iguales entre las marcadas.',
    usage: 'Marca a todos los que participaron en el gasto, incluido quien pagó si le corresponde su parte. Debe haber al menos una persona.',
  },

  // --- Módulos ---
  'workspaces.name': {
    title: 'Nombre del módulo',
    concept: 'Un módulo es un contenedor aparte para separar tus gastos (por ejemplo, el negocio de lo personal), cada uno con sus propias categorías.',
    usage: 'Escribe un nombre corto, de hasta 60 caracteres.',
    example: 'Empresa, Hijo, Inversiones',
  },
  'workspaces.color': {
    title: 'Color del módulo',
    concept: 'Es el color con el que reconoces el módulo en los selectores y en el resumen.',
    usage: 'Haz clic en el color que prefieras; el marcado con ✓ es el elegido.',
  },
  'workspaces.icon': {
    title: 'Ícono del módulo',
    concept: 'Es el dibujo que acompaña al módulo y te ayuda a distinguirlo de un vistazo.',
    usage: 'Haz clic en el ícono que mejor represente el módulo.',
  },
  'workspaces.category.new': {
    title: 'Nueva categoría',
    concept: 'Las categorías clasifican los gastos dentro de este módulo, y cada módulo tiene las suyas.',
    usage: 'Escribe el nombre y pulsa el botón + o Enter. No puede repetirse dentro del módulo.',
    example: 'Marketing, Sueldos',
  },

  // --- Asesor ---
  'advisor.question': {
    title: 'Tu pregunta a Luki',
    concept: 'Luki AI es un asesor que responde usando los gastos e ingresos de este mes que ya registraste.',
    usage: 'Escribe tu duda en lenguaje normal y pulsa Enter. También puedes tocar una de las sugerencias.',
    example: '¿En qué se me fue la plata este mes?',
  },
}

/** @param {string} key @returns {FieldHelpEntry | undefined} */
export function getFieldHelp(key) {
  return FIELD_HELP[key]
}
