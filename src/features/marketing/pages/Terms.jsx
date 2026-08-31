import { LegalLayout, LegalSection } from '../components/LegalLayout'

const CONTACT = 'llerenarenzo123@gmail.com'

export function Terms() {
  return (
    <LegalLayout title="Términos del Servicio" updatedAt="31 de agosto de 2026">
      <p>
        Al crear una cuenta o usar <strong>Luki</strong> (tuluki.com) aceptas estos términos. Si
        no estás de acuerdo, no uses el servicio. Para consultas escribe a{' '}
        <a href={`mailto:${CONTACT}`} className="link-muted">{CONTACT}</a>.
      </p>

      <LegalSection title="1. Qué es Luki">
        <p>
          Luki es una herramienta de finanzas personales que lee las notificaciones de tu banco
          o billetera —desde tu correo, con tu autorización— y arma un resumen de tus gastos e
          ingresos, con un asesor basado en inteligencia artificial. Es un proyecto individual,
          ofrecido “tal cual”.
        </p>
      </LegalSection>

      <LegalSection title="2. Tu cuenta">
        <p>
          Eres responsable de mantener la confidencialidad de tus credenciales y de la actividad
          que ocurra en tu cuenta. Debes proporcionar información veraz y tener al menos 18 años.
        </p>
      </LegalSection>

      <LegalSection title="3. Uso aceptable">
        <p>
          Te comprometes a no usar Luki para fines ilícitos, a no intentar vulnerar su seguridad,
          sobrecargar la infraestructura, ni acceder a datos de otras personas. Conectas
          únicamente cuentas de correo de tu titularidad.
        </p>
      </LegalSection>

      <LegalSection title="4. El asesor con IA no es asesoría financiera profesional">
        <p>
          Las respuestas del asesor se generan con modelos de lenguaje y pueden contener errores.
          Son orientativas y no constituyen asesoría financiera, contable, legal ni tributaria
          profesional. Las decisiones que tomes con base en esa información son tu
          responsabilidad.
        </p>
      </LegalSection>

      <LegalSection title="5. Planes y pagos">
        <p>
          Luki puede ofrecer funciones de pago mediante suscripción. Los pagos se procesan a
          través de Stripe. Puedes cancelar cuando quieras; la cancelación aplica al final del
          periodo ya pagado y no genera reembolsos por periodos en curso, salvo que la ley
          aplicable disponga lo contrario.
        </p>
      </LegalSection>

      <LegalSection title="6. Disponibilidad">
        <p>
          Luki se ofrece sin garantías de disponibilidad ininterrumpida. Puede haber
          mantenimientos, cambios de funcionalidad o interrupciones. Podemos suspender o
          discontinuar el servicio, avisando con antelación razonable cuando sea posible.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitación de responsabilidad">
        <p>
          En la máxima medida permitida por la ley, Luki y su operador no serán responsables por
          daños indirectos, incidentales o consecuentes, ni por pérdida de datos o de
          oportunidades, derivados del uso o la imposibilidad de uso del servicio.
        </p>
      </LegalSection>

      <LegalSection title="8. Terminación">
        <p>
          Puedes dejar de usar Luki y solicitar la eliminación de tu cuenta en cualquier momento
          escribiendo a <a href={`mailto:${CONTACT}`} className="link-muted">{CONTACT}</a>.
          Podemos cerrar cuentas que incumplan estos términos.
        </p>
      </LegalSection>

      <LegalSection title="9. Ley aplicable">
        <p>
          Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia
          se someterá a los tribunales competentes de Lima, Perú.
        </p>
      </LegalSection>

      <LegalSection title="10. Cambios">
        <p>
          Podemos actualizar estos términos. Si el cambio es relevante, lo reflejaremos en esta
          página actualizando la fecha del encabezado.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}

export default Terms
