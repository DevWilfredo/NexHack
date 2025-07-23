import { useState, useEffect } from "react";
import { GetHackathons, GetTags } from "@services/";
import TagsComponent from "@components/TagsComponent";
import {
  calcularHoras,
  formatoFecha,
  mapFechasAHackathones,
  todasLasFechas,
} from "@utilities/dateUtils";
import DashboardCards from "../DashboardCards";
import HackathonsTable from "../HackathonsTable";
import HackathonsCalendar from "../HackathonsCalendar";

const DashboardComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [datesToShow, setDatesToShow] = useState([]);
  const [mapHackathons, setMapHackathons] = useState({});
  const [activeTagId, setActiveTagId] = useState("all");

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
      <HackathonsCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        datesToShow={datesToShow}
        mapHackathons={mapHackathons}
      />
    </div>
  );
};

export default DashboardComponent;
