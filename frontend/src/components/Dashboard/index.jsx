import { useState, useEffect } from "react";
import { useApp } from "@context/AppContext";
import { GetTags } from "@services/";
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
    description: "Un juez te dejo su feedback",
    buttonText: "Ver historial",
  },
  {
    icon: Users,
    title: "Tus posiciones",
    description: "Esta semana participaste en un hackathon",
    buttonText: "Ver resultados",
  },
];

const DashboardComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [datesToShow, setDatesToShow] = useState([]);
  const [mapHackathons, setMapHackathons] = useState({});
  const [activeTagId, setActiveTagId] = useState("all");

  const { allHackathons } = useApp();

  useEffect(() => {
    GetTags().then((data) => {
      setTags(data);
    });
  }, []);

  useEffect(() => {
    if (allHackathons.length > 0) {
      setDatesToShow(todasLasFechas(allHackathons));
      setMapHackathons(mapFechasAHackathones(allHackathons));
    }
  }, [allHackathons]);

  const hackathonsToShow =
    activeTagId === "all"
      ? allHackathons
      : allHackathons.filter((h) => h.tags?.some((t) => t.id === activeTagId));

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="w-full lg:flex-[5] pt-4">
        <DashboardCards cardData={cardData} />
        <div className="bg-base-200 rounded-box mt-2 mb-2 ">
          <TagsComponent
            tags={tags}
            activeTagId={activeTagId}
            setActiveTagId={setActiveTagId}
            extraClasses={"bg-base-200 border border-info/20 "}
          />
        </div>
        <HackathonsTable
          hackathons={hackathonsToShow}
          formatoFecha={formatoFecha}
          calcularHoras={calcularHoras}
        />
      </div>
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
