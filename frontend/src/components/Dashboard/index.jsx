import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { GetHackathons, GetTags } from "@services/";
import TagsComponent from "@components/TagsComponent";
import { useTheme } from "@context/ThemeContext";
import {
  calcularHoras,
  formatDateToISOShort,
  formatoFecha,
  mapFechasAHackathones,
  todasLasFechas,
} from "@utilities/dateUtils";
import ModalUserUpdateComponent from "../ModalUserUpdate";
import DashboardCards from "../DashboardCards";
import HackathonsTable from "../HackathonsTable";

const DashboardComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [datesToShow, setDatesToShow] = useState([]);
  const [mapHackathons, setMapHackathons] = useState({});
  const [activeTagId, setActiveTagId] = useState("all");
  const { isDark } = useTheme();

  useEffect(() => {
    // Simulate fetching tags data from an API
    GetTags().then((data) => {
      setTags(data);
    });

    GetHackathons().then((data) => {
      setHackathons(data);
      const fechas = todasLasFechas(data);
      setDatesToShow(fechas);
      const mapa = mapFechasAHackathones(data);
      setMapHackathons(mapa);
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar izquierda (20%) */}
      <div className="flex-[2] p-2 ">
        <div
          className={`collapse collapse-plus menu ${
            isDark ? "bg-slate-900/80" : "bg-base-200"
          } rounded-box h-full w-full`}
        >
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Esto será una lista
            <ModalUserUpdateComponent />
          </div>
          <div className="collapse-content text-sm">
            Esto será nuevo contenido en la lista
          </div>
        </div>
      </div>

      {/* Zona central (60%) */}
      <div className="w-full lg:flex-[5] pt-4">
        {/* Zona superior con imágenes (como leetcode) */}
        <DashboardCards />
        {/* Tags */}
        <div className="bg-base-200 rounded-box mt-2 mb-2 ">
          <TagsComponent
            tags={tags}
            activeTagId={activeTagId}
            setActiveTagId={setActiveTagId}
          />
        </div>
        {/* Lista de hackatones */}
        <HackathonsTable
          hackathons={
            activeTagId === "all"
              ? hackathons
              : hackathons.filter((h) =>
                  h.tags?.some((t) => t.id === activeTagId)
                )
          }
          formatoFecha={formatoFecha}
          calcularHoras={calcularHoras}
        />
      </div>

      {/* Zona derecha (20%) */}
      <div className="w-full lg:flex-[1] p-4">
        <h2 className="text-lg font-semibold mb-4">Selecciona una fecha:</h2>
        <div
          className={`flex justify-center ${
            isDark ? "bg-slate-900/80" : "bg-base-200"
          } rounded-xl p-4 shadow-lg w-fit`}
        >
          <DayPicker
            animate
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              occupied: datesToShow,
            }}
            modifiersClassNames={{
              occupied: `${
                isDark ? "bg-accent" : "bg-primary"
              } text-white rounded-full scale-90`,
              selected: "bg-primary text-primary-content rounded-full",
            }}
            classNames={{
              table: "w-full border-separate", // espaciado entre días
              cell: "w-10 h-10", // tamaño de cada celda (ajustable)
              day: `text-sm ${
                isDark
                  ? "hover:bg-gray-600"
                  : "hover:bg-gray-400 hover:text-white"
              } rounded-full transition-all duration-200`,
            }}
          />
        </div>
        {selectedDate && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Hackathones para {formatoFecha(selectedDate)}
            </h2>
            {(mapHackathons[formatDateToISOShort(selectedDate)] || []).length >
            0 ? (
              <ul className="list-disc ml-4">
                {mapHackathons[formatDateToISOShort(selectedDate)].map(
                  (hack) => (
                    <li key={hack.id}>
                      <strong>{hack.title}</strong> —{" "}
                      {formatoFecha(hack.start_date)} a{" "}
                      {formatoFecha(hack.end_date)}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>No hay hackathones ese día.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
