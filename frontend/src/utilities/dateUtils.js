//  Formatea una fecha a "DD-MM-YYYY"
export const formatoFecha = (fechaString) => {
  const fecha = new Date(fechaString);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();

  return `${dia}-${mes}-${año}`;
};

//  Formatea una fecha a "YYYY-MM-DD" (ISO corto)
//  Útil para comparar fechas y evitar problemas de zona horaria
export const formatDateToISOShort = (date) => {
  const d = new Date(date);
  if (isNaN(d)) throw new Error("Fecha inválida: " + date);
  return d.toLocaleDateString("sv-SE");
};


//  Calcula diferencia en horas
export const calcularHoras = (inicio, fin) => {
  const fechaInicioDate = new Date(inicio);
  const fechaFinDate = new Date(fin);
  const diffMs = fechaFinDate - fechaInicioDate;
  const diffHoras = diffMs / (1000 * 60 * 60);
  return diffHoras;
};

// Crea array de fechas entre dos fechas (incluyendo ambos extremos)
export const crearArrayFechas = (inicio, fin) => {
  const fechaInicio = new Date(inicio);
  const fechaFin = new Date(fin);
  const fechas = [];

  const current = new Date(fechaInicio); // para no mutar fecha original

  while (current <= fechaFin) {
    fechas.push(new Date(current));
    current.setDate(current.getDate() + 1); // suma un día
  }

  return fechas;
};

// Solo fechas de inicio únicas de hackathons
export const todasLasFechas = (hackathones) => {
  const fechasInicio = hackathones.map(h => formatDateToISOShort(h.start_date));

  const fechasUnicas = [...new Set(fechasInicio)];

  return fechasUnicas.map(fechaStr => new Date(fechaStr));
};

// Mapear solo por fecha de inicio (no todo el rango)
export const mapFechasAHackathones = (hackathones) => {
  const mapa = {};

  hackathones.forEach((hackathon) => {
    const clave = formatDateToISOShort(hackathon.start_date);
    if (!mapa[clave]) mapa[clave] = [];
    mapa[clave].push(hackathon);
  });

  return mapa;
};
