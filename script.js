const GOOGLE_SCRIPT_URL = "PEGAR_AQUI_URL_DEL_WEB_APP";

const CITY = "La Serena";
const DOCUMENT_DAY = "14";
const ADMIN_RUT = "[●]";
const DOCUMENT_VERSION = "Acuerdo Comercial Administración Comercial Riva Living v1.0 - Marzo 2026";

const AGREEMENT_TEMPLATE = `ACUERDO COMERCIAL DE ADMINISTRACIÓN COMERCIAL
 
En [●], a [●] de marzo de 2026, comparecen: don(a) [●], cédula de identidad número [●], domiciliado (a) en [●] número [●], departamento [●], comuna de [●], Región [●]; el(la) compareciente mayor de edad, en adelante también el(la) “Mandante”, quien expresa:
 
Don(a) [●] declara contar con facultades suficientes para arrendar el inmueble amoblado correspondiente al departamento número [●] y el estacionamiento(s) número [●] del “Edificio Playa Serena”, ubicado en Avenida del Mar número 3.500, comuna de La Serena, Región de Coquimbo, en adelante el “Inmueble”.
 
Por el presente documento, el Arrendatario manifiesta su voluntad de otorgar un mandato civil de administración de bienes inmuebles a la sociedad Vértice Gestión Inmobiliaria SpA, Rol Único Tributario número [●], con domicilio en Av. Kennedy 7900 Oficina 704, Vitacura, o a la sociedad relacionada que ésta indique, en adelante el “Administrador”, para arrendar y explotar comercialmente el Inmueble bajo la figura de arrendamientos temporales o de corto plazo, facultándola expresamente para:
 
• Publicar el inmueble en plataformas digitales (Airbnb, Booking, etc.) y en sus plataformas propias.
• Fijar y modificar precios según la demanda del mercado.
• Gestionar el calendario de reservas y procesos de check-in/check-out.
• Contratar servicios de limpieza, lavandería, reposición de elementos menores de ropa blanca, menaje y decoración, y mantenimiento menor del Inmueble.
• Administrar y rendir cuentas de los ingresos y gastos del inmueble: Cobranza de arriendos, retención de comisiones y pago de gastos del Mandante a terceros con cargo a los ingresos
 
Para estos efectos, Mandante y Administrador, sujeto al cumplimiento de la condición suspensiva que se expresará más adelante, celebrarán un contrato de mandato civil de administración de bien inmueble, en adelante el “Contrato”, en el que, previo acuerdo de ambas partes, regularán además de las materias ya enunciadas, a lo menos, las siguientes:
 
• Períodos mínimos en los que el Inmueble estará disponible para ser arredrado por períodos de corto plazo y antelación mínima para avisos de bloqueo parcial; normas de ingreso del Mandante durante dichos períodos
• Estándar y requisitos de alhajamiento y mobiliario con los que debe cumplir el Inmueble, incluyendo ropa de cama y baño y menaje; ausencia de objetos de valor monetario y/o sentimental
• Estándar y requisitos de seguros de responsabilidad civil
• Forma y periodicidad de rendición de cuentas, en las que se informarán detalles de ingresos brutos, comisiones de plataformas, gastos de operación y comisión neta del Administrador, la que asciende a un 25% de los ingresos brutos por arriendo.
• Exclusividad.
• Responsabilidades legales que le correspondan al arrendatario y las que le corresponderán al Administrador.
• Plazo de vigencia del Contrato de 12 meses renovables.
• Forma de facturación del arriendo del Inmueble, definiendo si el Administrador facturará o no en representación del Mandante.
• Inventario inicial y recepción del departamento
 
Condición Suspensiva: El Contrato será otorgado sólo en caso que el Administrador celebre un compromiso semejante a este con mandantes con derecho suficiente para arrendar 30 departamentos del “Edificio Playa Serena” dentro de un plazo de 3 meses a contar de esta fecha.
 
 
 
 
 
__________________________
[●]
“Mandante”`;

const form = document.querySelector("#agreementForm");
const formScreen = document.querySelector("#formScreen");
const reviewScreen = document.querySelector("#reviewScreen");
const confirmationScreen = document.querySelector("#confirmationScreen");
const agreementPreview = document.querySelector("#agreementPreview");
const formError = document.querySelector("#formError");
const submitStatus = document.querySelector("#submitStatus");
const confirmationMessage = document.querySelector("#confirmationMessage");
const acceptButton = document.querySelector("#acceptButton");
const rejectButton = document.querySelector("#rejectButton");
const editButton = document.querySelector("#editButton");

let formData = {};
let generatedAgreementText = "";
let isSubmitting = false;

function sanitizeValue(value) {
  return String(value || "").trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getFormData() {
  return {
    fullName: sanitizeValue(form.fullName.value),
    rut: sanitizeValue(form.rut.value),
    street: sanitizeValue(form.street.value),
    streetNumber: sanitizeValue(form.streetNumber.value),
    homeApartment: sanitizeValue(form.homeApartment.value),
    commune: sanitizeValue(form.commune.value),
    region: sanitizeValue(form.region.value),
    playaSerenaApartment: sanitizeValue(form.playaSerenaApartment.value),
    parking: sanitizeValue(form.parking.value),
    email: sanitizeValue(form.email.value),
    phone: sanitizeValue(form.phone.value)
  };
}

function validateForm() {
  const requiredFields = [
    "fullName",
    "rut",
    "street",
    "streetNumber",
    "commune",
    "region",
    "playaSerenaApartment",
    "email",
    "phone"
  ];
  const labels = {
    fullName: "Nombre completo del compareciente / Mandante",
    rut: "Cédula de identidad / RUT",
    street: "Domicilio: calle",
    streetNumber: "Número de domicilio",
    commune: "Comuna",
    region: "Región",
    playaSerenaApartment: "Número de departamento en Edificio Playa Serena",
    email: "Email",
    phone: "Teléfono"
  };
  const missingFields = [];

  form.querySelectorAll("input").forEach((input) => input.classList.remove("invalid"));

  requiredFields.forEach((fieldName) => {
    if (!formData[fieldName]) {
      missingFields.push(labels[fieldName]);
      form[fieldName].classList.add("invalid");
    }
  });

  if (missingFields.length > 0) {
    showError(`Completa los campos obligatorios: ${missingFields.join(", ")}.`);
    return false;
  }

  if (!isValidEmail(formData.email)) {
    form.email.classList.add("invalid");
    showError("Ingresa un email válido.");
    return false;
  }

  showError("");
  return true;
}

function generateAgreement(data) {
  const replacements = [
    CITY,
    DOCUMENT_DAY,
    data.fullName,
    data.rut,
    data.street,
    data.streetNumber,
    data.homeApartment || "no informado",
    data.commune,
    data.region,
    data.fullName,
    data.playaSerenaApartment,
    data.parking || "no informado",
    ADMIN_RUT,
    data.fullName
  ];

  let replacementIndex = 0;

  return AGREEMENT_TEMPLATE.replace(/\[●\]/g, () => {
    const replacement = replacements[replacementIndex];
    replacementIndex += 1;
    return replacement;
  });
}

function setSubmittingState(isActive) {
  isSubmitting = isActive;
  acceptButton.disabled = isActive;
  rejectButton.disabled = isActive;
  editButton.disabled = isActive;
}

async function submitAgreement(status) {
  if (isSubmitting) {
    return;
  }

  setSubmittingState(true);
  submitStatus.textContent = "Registrando...";
  submitStatus.classList.add("visible");

  const payload = {
    status,
    fullName: formData.fullName,
    rut: formData.rut,
    street: formData.street,
    streetNumber: formData.streetNumber,
    homeApartment: formData.homeApartment,
    commune: formData.commune,
    region: formData.region,
    playaSerenaApartment: formData.playaSerenaApartment,
    parking: formData.parking,
    email: formData.email,
    phone: formData.phone,
    documentVersion: DOCUMENT_VERSION,
    generatedAgreementText,
    userAgent: navigator.userAgent,
    technicalTimestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "No se pudo registrar la respuesta.");
    }

    showConfirmation(status);
  } catch (error) {
    showError("No pudimos registrar tu respuesta. Por favor intenta nuevamente.");
    setSubmittingState(false);
  }
}

function showConfirmation(status) {
  reviewScreen.classList.add("hidden");
  confirmationScreen.classList.remove("hidden");

  if (status === "Aceptado") {
    confirmationMessage.textContent = "Gracias. Tu aceptación del Acuerdo Comercial de Administración fue registrada correctamente.";
  } else {
    confirmationMessage.textContent = "Tu respuesta fue registrada correctamente. No se ha generado aceptación del acuerdo.";
  }
}

function showError(message) {
  const target = reviewScreen.classList.contains("hidden") ? formError : submitStatus;

  target.textContent = message;
  target.classList.toggle("visible", Boolean(message));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formData = getFormData();

  if (!validateForm()) {
    return;
  }

  generatedAgreementText = generateAgreement(formData);
  agreementPreview.textContent = generatedAgreementText;
  formScreen.classList.add("hidden");
  reviewScreen.classList.remove("hidden");
  submitStatus.classList.remove("visible");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

acceptButton.addEventListener("click", () => submitAgreement("Aceptado"));
rejectButton.addEventListener("click", () => submitAgreement("No aceptado"));

editButton.addEventListener("click", () => {
  reviewScreen.classList.add("hidden");
  formScreen.classList.remove("hidden");
  submitStatus.classList.remove("visible");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
