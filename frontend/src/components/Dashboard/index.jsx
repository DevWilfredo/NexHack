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
import { Activity, Trophy, Users } from "lucide-react";


const cardData = [
  {
    icon: Trophy,
    title: "Estás en el puesto #3",
    description: "Ranking general del hackathon",
    buttonText: "Ver clasificación entera",
  },
  {
    icon: Activity,
    title: "Actividad reciente",
    description: "Tu equipo subió un nuevo commit hace 2 horas",
    buttonText: "Ver historial",
  },
  {
    icon: Users,
    title: "231 participantes",
    description: "Aumentó un 8% esta semana",
    buttonText: "Ver estadísticas",
  },
];

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

        fetchHackathons();
  }, []);

  const fetchHackathons = () => {
    GetHackathons().then((data) => {
      setHackathons(data);
      const fechas = todasLasFechas(data);
      setDatesToShow(fechas);
      const mapa = mapFechasAHackathones(data);
      setMapHackathons(mapa);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Zona central (60%) */}
      <div className="w-full lg:flex-[5] pt-4">
        {/* Zona superior con imágenes (como leetcode) */}
        <DashboardCards cardData={cardData} />
        {/* Tags */}
        <div className="bg-base-200 rounded-box mt-2 mb-2 ">
          <TagsComponent
            tags={tags}
            activeTagId={activeTagId}
            setActiveTagId={setActiveTagId}
            extraClasses={"bg-base-200  border border-info/20 "}
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
