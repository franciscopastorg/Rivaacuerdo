# Acuerdo Comercial de Administración

Aplicación web simple para generar y registrar la aceptación digital tipo clickwrap del Acuerdo Comercial de Administración Comercial para Riva Living / Playa Serena.

La app usa HTML, CSS y JavaScript vanilla. No usa React, Vite, Netlify Functions, Google Cloud Service Account ni Google Sheets API directa desde el frontend.

## Archivos

- `index.html`: estructura de la landing, formulario, revisión y confirmación.
- `styles.css`: diseño responsive y estilos visuales.
- `script.js`: validación, generación del acuerdo, envío por `fetch` y estados de pantalla.
- `google-apps-script.gs`: backend para pegar en Google Apps Script.
- `README.md`: instrucciones de configuración y despliegue.

## 1. Crear Google Sheet

1. Crea un nuevo Google Sheet.
2. Crea una pestaña llamada `Respuestas`.
3. Agrega estos encabezados en la primera fila:

```text
Fecha y hora
Estado
Nombre completo
RUT
Calle domicilio
Número domicilio
Departamento domicilio
Comuna
Región
Departamento Playa Serena
Estacionamiento(s)
Email
Teléfono
Versión del documento
Texto completo del acuerdo generado
User Agent
Timestamp técnico
```

## 2. Configurar Google Apps Script

1. En el Google Sheet, entra a `Extensiones > Apps Script`.
2. Borra el contenido inicial del editor.
3. Pega el contenido completo de `google-apps-script.gs`.
4. Reemplaza esta constante:

```js
const SHEET_ID = "PEGAR_AQUI_EL_ID_DEL_GOOGLE_SHEET";
```

por el ID real del Google Sheet. El ID está en la URL:

```text
https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
```

5. Guarda el proyecto.

## 3. Implementar como Web App

1. En Apps Script, haz clic en `Implementar > Nueva implementación`.
2. Selecciona el tipo `Aplicación web`.
3. Configura:
   - Ejecutar como: `Yo`
   - Quién tiene acceso: `Cualquier usuario`
4. Haz clic en `Implementar`.
5. Autoriza los permisos solicitados.
6. Copia la URL del Web App.

## 4. Conectar el frontend

1. Abre `script.js`.
2. Reemplaza:

```js
const GOOGLE_SCRIPT_URL = "PEGAR_AQUI_URL_DEL_WEB_APP";
```

por la URL real del Web App de Google Apps Script.

## 5. Subir a Netlify

1. Sube estos archivos a Netlify:
   - `index.html`
   - `styles.css`
   - `script.js`
2. No necesitas configurar build command.
3. No necesitas configurar publish directory si subes los archivos directamente.
4. Si conectas un repositorio, usa la carpeta que contiene esos tres archivos como carpeta publicada.

## 6. Probar

1. Abre la URL publicada en Netlify.
2. Completa el formulario con datos reales de prueba.
3. Haz clic en `Generar acuerdo`.
4. Revisa el documento generado.
5. Haz clic en `Acepto` o `No acepto`.
6. Verifica que se haya creado una nueva fila en la pestaña `Respuestas`.

## Notas importantes

- El contrato se mantiene textual en `script.js`.
- La función `generateAgreement(data)` reemplaza los campos `[●]` en orden de aparición.
- Si el departamento de domicilio está vacío, se usa `no informado`.
- Si el estacionamiento está vacío, se usa `no informado`.
- El frontend envía el POST al Web App de Apps Script usando `fetch`.
- El payload incluye el texto completo del acuerdo generado, versión del documento, user agent y timestamp técnico.
