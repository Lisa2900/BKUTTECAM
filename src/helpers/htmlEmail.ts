import { FormType } from "../types";


export default function generateEmailHTML(data: FormType): string {
  // Aquí puedes definir colores, fuentes, etc.
  const primaryColor = "#2C3E50";
  const bgColor = "#F4F4F4";
  const textColor = "#333333";
  const labelColor = "#555555";
  const lineColor = "#DDDDDD";

  // función auxiliar: si valor existe, generar línea
  function row(label: string, value?: string) {
    if (!value) return "";
    // etiqueta + valor, estilo inline
    return `
      <tr>
        <td style="padding: 8px 0; vertical-align: top; color: ${labelColor}; font-weight: bold;">
          ${label}:
        </td>
        <td style="padding: 8px 0; color: ${textColor};">
          ${value}
        </td>
      </tr>
    `;
  }

  // Comienza el HTML
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Datos del formulario</title>
</head>
<body style="margin:0; padding:0; background-color: ${bgColor};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin: auto; background-color: white; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: ${primaryColor}; color: white; font-size: 24px;">
        Información del formulario
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          ${row("Nombre", data.nombre)}
          ${row("Matrícula", data.matricula)}
          ${row("Email", data.email)}
          ${row("Teléfono", data.telefono)}
          ${row("Carrera", data.carrera)}
          ${row("Nivel", data.nivel)}
          ${row("Entrega", data.entrega)}
          ${row("Documentos solicitados", data["documentos-solicitados"])}
          ${row("Comentarios", data.comentarios)}
          ${row("Referencia", data.referencia)}
          ${row("Número de seguro", data["numero-seguro"])}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; font-size: 12px; color: ${labelColor}; border-top: 1px solid ${lineColor};">
        Este correo fue generado automáticamente. Por favor, no respondas a este mensaje.
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return html;
}
