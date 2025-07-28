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

//  Junta todas las fechas ocupadas de todos los hackathones
export const todasLasFechas = (hackathones) => {
  const fechasOcupadas = [];

  hackathones.forEach((hackathon) => {
    const fechas = crearArrayFechas(hackathon.start_date, hackathon.end_date);
    fechasOcupadas.push(...fechas);
  });

  //Convertimos a string (solo el día), usamos Set para quitar duplicados y volvemos a Date
  const fechasUnicas = [
    ...new Set(fechasOcupadas.map((fecha) => formatDateToISOShort(fecha))),
  ].map((fechaStr) => new Date(fechaStr));

  return fechasUnicas;

};

// Devuelve un objeto { "YYYY-MM-DD": [hackathon, hackathon] }
export const mapFechasAHackathones = (hackathones) => {
  const mapa = {};

  hackathones.forEach((hackathon) => {
    const fechas = crearArrayFechas(hackathon.start_date, hackathon.end_date);

    fechas.forEach((fecha) => {
      const clave = formatDateToISOShort(fecha); // ej. "2025-08-01"
      if (!mapa[clave]) mapa[clave] = [];
      mapa[clave].push(hackathon);
    });
  });

  return mapa;
};