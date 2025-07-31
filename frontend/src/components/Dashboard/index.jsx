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
import { useAuth } from "@context/AuthContext";
import { motion } from "framer-motion";

const DashboardComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [datesToShow, setDatesToShow] = useState([]);
  const [mapHackathons, setMapHackathons] = useState({});
  const [activeTagId, setActiveTagId] = useState("all");
  const { allHackathons } = useApp();
  const { user } = useAuth();

  const cardData = [
    {
      icon: Trophy,
      title: "Estás en el puesto #3",
      description: "Ranking general del hackathon",
      buttonText: "Ver clasificación entera",
      href: "/leaderboard",
      color: "warning",
    },
    {
      icon: Activity,
      title: "Likes recientes",
      description: "Un Usuario te dejó un like",
      buttonText: "Ver historial",
      href: `/profile/${user?.id}?tab=followers`,
      color: "success",
    },
    {
      icon: Users,
      title: "Tus posiciones",
      description: "Esta semana participaste en un hackathon",
      buttonText: "Ver resultados",
      href: `/profile/${user?.id}?tab=hackathons`,
      color: "info",
    },
  ];

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <motion.div
        className="w-full lg:flex-[5] pt-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <DashboardCards cardData={cardData} />

        <motion.div
          className="bg-base-200 rounded-box mt-2 mb-2"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TagsComponent
            tags={tags}
            activeTagId={activeTagId}
            setActiveTagId={setActiveTagId}
            extraClasses={"bg-base-200 border border-info/20 "}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <HackathonsTable
            hackathons={hackathonsToShow}
            formatoFecha={formatoFecha}
            calcularHoras={calcularHoras}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="lg:flex-[1] p-4 space-y-6"
      >
        <HackathonsCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          datesToShow={datesToShow}
          mapHackathons={mapHackathons}
        />
      </motion.div>
    </div>
  );
};

export default DashboardComponent;
