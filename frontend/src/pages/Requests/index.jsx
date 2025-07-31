import { useState, useEffect } from "react";
import { useApp } from "@context/AppContext";
import { mapFechasAHackathones, todasLasFechas } from "@utilities/dateUtils";
import HackathonsCalendar from "@components/HackathonsCalendar";
import RequestsTable from "@components/RequestsTable";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { GetHackathons } from "@services";
import RequestsCards from "../../components/RequestsCards";
import { motion } from "framer-motion";

const requestCardData = [
  {
    icon: Clock,
    title: "2 solicitudes pendientes",
    description: "Tus equipos aún esperan aprobación",
    buttonText: "Ver solicitudes pendientes",
    status: "pending",
    color: "warning",
  },
  {
    icon: CheckCircle,
    title: "5 solicitudes aprobadas",
    description: "Ya puedes participar con tus equipos",
    buttonText: "Ver equipos aprobados",
    status: "accepted",
    color: "success",
  },
  {
    icon: XCircle,
    title: "1 solicitud rechazada",
    description: "Revisa los motivos de rechazo",
    buttonText: "Ver rechazos",
    status: "rejected",
    color: "error",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: 0.1 },
  },
};

const RequestsPage = () => {
  const { requests, loadingRequests } = useApp();

  const [selectedDate, setSelectedDate] = useState(null);
  const [hackathons, setHackathons] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [datesToShow, setDatesToShow] = useState([]);
  const [mapHackathons, setMapHackathons] = useState({});

  useEffect(() => {
    GetHackathons().then((data) => {
      setHackathons(data);
      const fechas = todasLasFechas(data);
      const mapa = mapFechasAHackathones(data);
      setDatesToShow(fechas);
      setMapHackathons(mapa);
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Zona central (60%) */}
      <motion.div
        className="w-full lg:flex-[5] pt-4 px-2"
        initial="hidden"
        animate="show"
        variants={fadeInUp}
      >
        <RequestsCards
          cardData={requestCardData}
          onCardClick={(status) => setStatusFilter(status)}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <RequestsTable
            requests={requests}
            loading={loadingRequests}
            statusFilter={statusFilter}
          />
        </motion.div>
      </motion.div>

      {/* Zona derecha (40%) */}
      <motion.div
        className="w-full lg:flex-[2] px-2 pt-4"
        initial="hidden"
        animate="show"
        variants={fadeInRight}
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

export default RequestsPage;
