const SHEET_ID = "PEGAR_AQUI_EL_ID_DEL_GOOGLE_SHEET";
const SHEET_NAME = "Respuestas";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.status || !data.fullName || !data.rut || !data.street || !data.streetNumber || !data.commune || !data.region || !data.playaSerenaApartment || !data.email || !data.phone || !data.documentVersion || !data.generatedAgreementText) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: "Faltan campos obligatorios" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: "No existe la hoja Respuestas" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      new Date(),
      data.status,
      data.fullName,
      data.rut,
      data.street,
      data.streetNumber,
      data.homeApartment || "no informado",
      data.commune,
      data.region,
      data.playaSerenaApartment,
      data.parking || "no informado",
      data.email,
      data.phone,
      data.documentVersion,
      data.generatedAgreementText,
      data.userAgent || "",
      data.technicalTimestamp || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
