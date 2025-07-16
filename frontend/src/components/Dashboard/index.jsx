import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { GetHackathons, GetTags } from "../../services";
import TagsComponent from "../TagsComponent";

const formatoFecha = (fechaString) => {
  const fecha = new Date(fechaString);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();

  return `${dia}-${mes}-${año}`;
};

// Función para calcular la duración en horas entre dos fechas
// Asumiendo que las fechas están en formato ISO 8601 (YYYY-MM-DDTH
const calcularHoras = (inicio, fin) => {
  const fechaInicioDate = new Date(inicio);
  const fechaFinDate = new Date(fin);

  // Diferencia en milisegundos
  const diffMs = fechaFinDate - fechaInicioDate;

  // Convertir milisegundos a horas (1 hora = 3600000 ms)
  const diffHoras = diffMs / (1000 * 60 * 60);

  return diffHoras;
};

const DashboardComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  useEffect(() => {
    // Simulate fetching tags data from an API
    GetTags().then((data) => {
      setTags(data);
    });

    GetHackathons().then((data) => {
      setHackathons(data);
    });
  }, []);

  return (
    <div className="flex">
      {/* Sidebar izquierda (20%) */}
      <div className="flex-[2] p-2 ">
        <div className="collapse collapse-plus menu bg-base-200 rounded-box h-full w-full">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Esto será una lista
          </div>
          <div className="collapse-content text-sm">
            Esto será nuevo contenido en la lista
          </div>
        </div>
      </div>

      {/* Zona central (60%) */}
      <div className="flex-[5] pt-4 w-70">
        {/* Zona superior con imágenes (como leetcode) */}
        <div className="overflow-x-auto mb-4">
          <div className="flex gap-4 ">
            {Array.from({ length: 10 }).map((_, idx) => (
              <img
                key={idx}
                className="w-30 h-30 rounded-box shadow-md shadow-success"
                src="https://pm1.aminoapps.com/6820/0ea8bb6561df2724541eb2797e09c2fda1ee6baev2_hq.jpg"
                alt={`img-${idx}`}
              />
            ))}
          </div>
        </div>
        {/* Tags */}
        <div className="bg-base-200 rounded-box mt-2 mb-2 ">
          <TagsComponent tags={tags} />
        </div>
        {/* Lista de hackatones */}
        <div className="bg-base-200 rounded-box p-4 ">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Hackathon</th>
                <th className="text-left">Creador</th>

                <th className="text-left">Status</th>
                <th className="text-left">Fecha</th>
                <th className="text-left">Duracion</th>
              </tr>
            </thead>
            <tbody>
              {hackathons.map((hackathons, idx) => {
                return (
                  <tr
                    key={hackathons.id}
                    className={
                      idx % 2 === 0
                        ? "bg-primary text-primary-content rounded-box"
                        : ""
                    }
                  >
                    <td>{hackathons.title}</td>
                    <td>Personas</td>

                    <td>{formatoFecha(hackathons.start_date)}</td>
                    <td>
                      {calcularHoras(
                        hackathons.start_date,
                        hackathons.end_date
                      )}
                      horas
                    </td>
                    <td className="py-1">
                      <button
                        className={`btn btn-xs btn-outline ${
                          hackathons.status === "pending"
                            ? "btn-warning"
                            : hackathons.status === "closed"
                            ? "btn-error"
                            : "btn-success"
                        }`}
                      >
                        {hackathons.status}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zona derecha (20%) */}
      <div className="flex-[2] p-4">
        <h2 className="text-lg font-semibold mb-4">Selecciona una fecha:</h2>
        <div className="border rounded-box p-4 flex justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>
        {selectedDate && (
          <p className="mt-4">
            Fecha seleccionada:{" "}
            <span className="font-medium">
              {selectedDate.toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
