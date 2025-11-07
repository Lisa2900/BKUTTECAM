import { FormType } from "../types";

export default function generateEmailHTML(data: FormType): string {
  // Paleta de colores verde-naranja elegante
  const primaryGreen = "#2D7A4F";      // Verde institucional
  const accentOrange = "#F57C00";      // Naranja vibrante
  const lightGreen = "#E8F5E9";        // Verde claro para fondo
  const darkGray = "#2C3E50";          // Gris oscuro para texto
  const lightGray = "#F5F5F5";         // Gris claro alternado
  const borderColor = "#C8E6C9";       // Verde claro para bordes
  const textPrimary = "#1B5E20";       // Verde oscuro para texto
  const textSecondary = "#555555";     // Gris medio

  // función auxiliar: si valor existe, generar fila con diseño elegante
  function row(label: string, value?: string, index?: number) {
    if (!value) return "";
    const bgColor = index && index % 2 === 0 ? lightGray : "white";
    return `
      <tr style="background-color: ${bgColor};">
        <td style="padding: 16px 20px; vertical-align: top; color: ${textPrimary}; font-weight: 600; font-size: 14px; border-bottom: 1px solid ${borderColor}; width: 35%;">
          ${label}
        </td>
        <td style="padding: 16px 20px; color: ${darkGray}; font-size: 14px; border-bottom: 1px solid ${borderColor}; line-height: 1.6;">
          ${value}
        </td>
      </tr>
    `;
  }

  // Filtrar campos que existen y enumerarlos
  const fields = [
    { label: "Nombre completo", value: data.nombre },
    { label: "Matrícula", value: data.matricula },
    { label: "Correo electrónico", value: data.email },
    { label: "Teléfono", value: data.telefono },
    { label: "Carrera", value: data.carrera },
    { label: "Nivel", value: data.nivel },
    { label: "Fecha de entrega", value: data.entrega },
    { label: "Documentos solicitados", value: data["documentos-solicitados"] },
    { label: "Comentarios adicionales", value: data.comentarios },
    { label: "Referencia de pago", value: data.referencia },
    { label: "Número de seguro", value: data["numero-seguro"] }
  ].filter(f => f.value);

  const rows = fields.map((field, index) => row(field.label, field.value, index)).join("");

  // HTML con diseño elegante
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitud de Trámite - UTTECAM</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, ${lightGreen} 0%, #ffffff 100%); font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  
  <!-- Contenedor principal -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Card principal -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 650px; width: 100%; background-color: white; border-radius: 16px; box-shadow: 0 8px 24px rgba(45, 122, 79, 0.12); overflow: hidden;">
          
          <!-- Header con gradiente y logo -->
          <tr>
            <td style="background: linear-gradient(135deg, ${primaryGreen} 0%, ${accentOrange} 100%); padding: 0; position: relative;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <img src="cid:logo" alt="UTTECAM" style="max-width: 180px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      Nueva Solicitud de Trámite
                    </h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.95); font-size: 15px; font-weight: 400;">
                      Servicios Escolares - UTTECAM
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Barra decorativa -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, ${accentOrange} 0%, ${primaryGreen} 50%, ${accentOrange} 100%);"></td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding: 40px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 24px 0; color: ${textSecondary}; font-size: 15px; line-height: 1.6;">
                      Se ha recibido una nueva solicitud con la siguiente información:
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Tabla de datos -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid ${borderColor}; border-radius: 8px; overflow: hidden; margin-top: 20px;">
                ${rows}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: ${lightGreen}; text-align: center; border-top: 2px solid ${borderColor};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <div style="display: inline-block; padding: 10px 20px; background-color: ${accentOrange}; border-radius: 6px;">
                      <span style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                        📧 Correo Automático
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 12px 0 0 0; color: ${textSecondary}; font-size: 13px; line-height: 1.5;">
                      Este correo fue generado automáticamente por el sistema de trámites en línea.<br/>
                      <strong>No responder a este mensaje.</strong>
                    </p>
                    <p style="margin: 16px 0 0 0; color: ${textPrimary}; font-size: 12px; font-weight: 600;">
                      Universidad Tecnológica de Tecámac<br/>
                      Servicios Escolares
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
`;

  return html;
}
