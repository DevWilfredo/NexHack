import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTheme } from "@context/ThemeContext";
import { formatoFecha, formatDateToISOShort } from "@utilities/dateUtils";
import { motion } from "framer-motion";
import { CalendarDays, Trophy } from "lucide-react";
import { Link } from "react-router";

const HackathonsCalendar = ({
  selectedDate,
  setSelectedDate,
  datesToShow,
  mapHackathons,
}) => {
  const { isDark } = useTheme();
  const selectedKey = selectedDate ? formatDateToISOShort(selectedDate) : null;

  // Solo los hackathones que inician ese día
  const eventosEseDia = selectedKey
    ? (mapHackathons[selectedKey] || []).filter(
        (hack) => formatDateToISOShort(hack.start_date) === selectedKey
      )
    : [];

  return (
    <div className="w-full lg:flex-[1] p-4 space-y-6">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-primary" />
        Selecciona una fecha
      </h2>

      <div
        className={`flex justify-center ${
          isDark ? "bg-slate-900/80" : "bg-base-200"
        } rounded-xl p-6 shadow-xl transition-colors duration-300 w-fit mx-auto`}
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
            table: "w-full border-separate",
            cell: "w-10 h-10",
            day: `text-sm ${
              isDark
                ? "hover:bg-gray-600"
                : "hover:bg-gray-400 hover:text-white"
            } rounded-full transition-all duration-200`,
          }}
        />
      </div>

      {selectedDate && (
        <motion.div
          key={selectedKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="bg-base-200 rounded-lg shadow-xl shadow-primary/30 p-4"
        >
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Hackathones para {formatoFecha(selectedDate)}
          </h2>

          <div className="space-y-3">
            {eventosEseDia.length > 0 ? (
              eventosEseDia.map((hack) => (
                <Link
                  to={`/hackathons/${hack.id}`}
                  key={hack.id}
                  className="block bg-primary/10 px-4 py-3 rounded-lg shadow-sm hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span className="font-semibold truncate block">
                    {hack.title}
                  </span>
                  <div className="text-sm flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {formatoFecha(hack.start_date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {formatoFecha(hack.end_date)}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground italic">
                No hay hackathones ese día.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HackathonsCalendar;
