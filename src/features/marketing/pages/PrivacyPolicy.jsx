import { LegalLayout, LegalSection } from '../components/LegalLayout'

const CONTACT = 'llerenarenzo123@gmail.com'

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Política de Privacidad" updatedAt="31 de agosto de 2026">
      <p>
        Esta política explica qué datos tratamos en <strong>Luki</strong> (tuluki.com), con qué
        fin, con quién los compartimos y cómo puedes eliminarlos. Luki es un servicio de
        finanzas personales operado por una persona natural desde Perú. Para cualquier consulta
        sobre privacidad puedes escribir a{' '}
        <a href={`mailto:${CONTACT}`} className="link-muted">
          {CONTACT}
        </a>
        .
      </p>

      <LegalSection title="1. Responsable del tratamiento">
        <p>
          El responsable es la persona natural que opera Luki, con domicilio en Perú y contacto
          en <a href={`mailto:${CONTACT}`} className="link-muted">{CONTACT}</a>. Al ser un
          proyecto individual, no existe una razón social ni un RUC asociados al servicio.
        </p>
      </LegalSection>

      <LegalSection title="2. Qué datos recopilamos">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Datos de cuenta:</strong> tu nombre visible, tu correo electrónico y tu
            contraseña (que se guarda solo como hash con BCrypt, nunca en texto plano).
          </li>
          <li>
            <strong>Conexión con Gmail (opcional):</strong> si conectas tu cuenta de Google,
            guardamos los tokens de OAuth cifrados en reposo (AES-256-GCM) y la dirección de
            correo de la cuenta conectada.
          </li>
          <li>
            <strong>Contenido de correos bancarios:</strong> del buzón que conectas, Luki lee
            únicamente los correos cuyo remitente pertenece a una lista de dominios de bancos y
            billeteras (por ejemplo BCP, Interbank, BBVA, Yape). De esos correos procesamos el
            texto de la notificación para extraer la transacción. No leemos, almacenamos ni
            indexamos el resto de tu bandeja.
          </li>
          <li>
            <strong>Correos reenviados (alternativa a Gmail):</strong> si reenvías notificaciones
            a la dirección <code>@inbox.tuluki.com</code> que te asignamos, procesamos ese correo
            del mismo modo.
          </li>
          <li>
            <strong>Datos de transacciones derivados:</strong> monto, moneda, comercio,
            categoría, tipo (gasto o ingreso) y fecha, obtenidos a partir de las notificaciones.
          </li>
          <li>
            <strong>Datos técnicos:</strong> registros de errores y diagnóstico (a través de
            Sentry) e identificadores para notificaciones push si las activas.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Para qué usamos tus datos">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Extraer transacciones a partir de las notificaciones de tu banco o billetera.</li>
          <li>Categorizar cada gasto y calcular tu resumen mensual (ingresos, gastos, balance, evolución).</li>
          <li>Responder tus preguntas en el asesor financiero con IA, usando tus totales del mes.</li>
          <li>Enviarte notificaciones push, si las activas.</li>
          <li>Operar el servicio: autenticación, soporte, seguridad y corrección de errores.</li>
        </ul>
        <p>No usamos tus datos para publicidad ni los vendemos a terceros.</p>
      </LegalSection>

      <LegalSection title="4. Uso de las APIs de Google (Gmail)">
        <p>
          Luki solicita el permiso{' '}
          <code>https://www.googleapis.com/auth/gmail.readonly</code>, que es de{' '}
          <strong>solo lectura</strong>: no enviamos, no borramos ni modificamos correos.
          También solicitamos <code>openid</code> y <code>email</code> para mostrarte qué cuenta
          tienes conectada.
        </p>
        <p>
          El uso y la transferencia por parte de Luki de la información recibida de las APIs de
          Google se ajustará a la{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noreferrer"
            className="link-muted"
          >
            Política de Datos de Usuario de los Servicios de API de Google
          </a>
          , incluidos sus requisitos de Uso Limitado (<em>Limited Use</em>). En concreto:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Los datos de Gmail solo se usan para la función visible al usuario: extraer y categorizar tus transacciones.</li>
          <li>No transferimos esos datos a terceros salvo lo necesario para proveer o mejorar esa función, por seguridad, por obligación legal, o en el marco de una fusión o adquisición (con aviso previo).</li>
          <li>No usamos los datos de Gmail para publicidad y no los vendemos.</li>
          <li>Ninguna persona lee tus datos de Gmail, salvo que nos des tu consentimiento explícito para un caso puntual (por ejemplo, resolver un problema de soporte), sea necesario por seguridad o lo exija la ley.</li>
          <li>No usamos el contenido de tus correos para entrenar modelos de inteligencia artificial de propósito general.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Con quién compartimos datos (encargados / subencargados)">
        <p>
          Nos apoyamos en proveedores que tratan datos por cuenta nuestra, solo para prestar el
          servicio:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li><strong>Google LLC</strong> — API de Gmail (lectura de correos bancarios) y API de Gemini (extracción y categorización de transacciones, y respuestas del asesor). El texto de la notificación bancaria se envía a Gemini de forma transitoria para procesarlo.</li>
          <li><strong>xAI</strong> — modelo Grok, usado solo como respaldo del asesor si Gemini no está disponible.</li>
          <li><strong>Stripe</strong> — procesamiento de pagos si contratas un plan de pago. Luki no almacena datos de tu tarjeta.</li>
          <li><strong>Twilio SendGrid</strong> — recepción de los correos que reenvías a tu dirección <code>@inbox.tuluki.com</code>.</li>
          <li><strong>Sentry (Functional Software, Inc.)</strong> — monitoreo de errores.</li>
          <li><strong>Google Firebase</strong> — envío de notificaciones push (si las activas).</li>
          <li><strong>Render</strong> — alojamiento de la aplicación y de la base de datos.</li>
          <li><strong>Cloudflare</strong> — DNS y entrega de contenido.</li>
        </ul>
        <p>
          Algunos de estos proveedores están fuera de Perú (principalmente en EE. UU.), por lo
          que tus datos pueden transferirse internacionalmente con las salvaguardas contractuales
          de cada proveedor.
        </p>
      </LegalSection>

      <LegalSection title="6. Conservación y eliminación">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Desconectar Gmail:</strong> desde “Cuentas de Gmail” puedes desconectar una
            cuenta en cualquier momento. Al hacerlo eliminamos los tokens de OAuth de esa
            conexión y dejamos de leer tu bandeja. Puedes además revocar el acceso desde{' '}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noreferrer"
              className="link-muted"
            >
              la configuración de tu cuenta de Google
            </a>
            .
          </li>
          <li>
            <strong>Eliminar tu cuenta:</strong> escríbenos a{' '}
            <a href={`mailto:${CONTACT}`} className="link-muted">{CONTACT}</a> y borraremos tu
            cuenta y los datos asociados (transacciones, conexiones, tokens) en un plazo máximo
            de 30 días, salvo lo que debamos conservar por obligación legal.
          </li>
          <li>
            Mientras tu cuenta esté activa conservamos tus transacciones para poder mostrarte tu
            historial. Los registros técnicos de errores se conservan por un periodo limitado.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Seguridad">
        <p>
          Ciframos en reposo los tokens de OAuth de Gmail (AES-256-GCM), guardamos las
          contraseñas solo como hash (BCrypt), servimos todo el tráfico por HTTPS y limitamos el
          acceso a la base de datos. Ningún sistema es 100% infalible, pero aplicamos medidas
          razonables acordes al tamaño del servicio.
        </p>
      </LegalSection>

      <LegalSection title="8. Tus derechos">
        <p>
          Puedes solicitar acceso, rectificación, actualización o supresión de tus datos, así
          como oponerte a determinados tratamientos, escribiendo a{' '}
          <a href={`mailto:${CONTACT}`} className="link-muted">{CONTACT}</a>. Responderemos en un
          plazo razonable.
        </p>
      </LegalSection>

      <LegalSection title="9. Menores de edad">
        <p>Luki no está dirigido a menores de 18 años y no recopilamos datos de menores de forma consciente.</p>
      </LegalSection>

      <LegalSection title="10. Cambios a esta política">
        <p>
          Podemos actualizar esta política. Si el cambio es relevante, lo indicaremos en esta
          página actualizando la fecha del encabezado.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}

export default PrivacyPolicy
