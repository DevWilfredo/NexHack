import { useState, useEffect } from "react";
import { useApp } from "@context/AppContext";
import {
  mapFechasAHackathones,
  todasLasFechas,
} from "@utilities/dateUtils";
import DashboardCards from "@components/DashboardCards";
import HackathonsCalendar from "@components/HackathonsCalendar";
import RequestsTable from "@components/RequestsTable";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { GetHackathons } from "@services";

const requestCardData = [
  {
    icon: Clock,
    title: "2 solicitudes pendientes",
    description: "Tus equipos aún esperan aprobación",
    buttonText: "Ver solicitudes pendientes",
    status: "pending",
  },
  {
    icon: CheckCircle,
    title: "5 solicitudes aprobadas",
    description: "Ya puedes participar con tus equipos",
    buttonText: "Ver equipos aprobados",
    status: "approved",
  },
  {
    icon: XCircle,
    title: "1 solicitud rechazada",
    description: "Revisa los motivos de rechazo",
    buttonText: "Ver rechazos",
    status: "rejected",
  },
];

const RequestsPage = () => {
  const { requests, loadingRequests } = useApp();

  const [selectedDate, setSelectedDate] = useState(null);
  const [hackathons, setHackathons] = useState([]);
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

  const handleAccept = async (request) => {
    console.log("Aceptar solicitud", request.id);
    // Aquí puedes llamar a tu servicio de aprobación
  };

  const handleReject = async (request) => {
    console.log("Rechazar solicitud", request.id);
    // Aquí puedes llamar a tu servicio de rechazo
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Zona central (60%) */}
      <div className="w-full lg:flex-[5] pt-4 px-2">
        <DashboardCards cardData={requestCardData} />

        <RequestsTable
          requests={requests}
          loading={loadingRequests}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div>

      {/* Zona derecha (40%) */}
      <HackathonsCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        datesToShow={datesToShow}
        mapHackathons={mapHackathons}
      />
    </div>
  );
};

export default RequestsPage;
