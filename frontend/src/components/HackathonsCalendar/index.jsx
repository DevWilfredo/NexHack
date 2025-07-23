import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTheme } from "@context/ThemeContext";
import { formatoFecha, formatDateToISOShort } from "@utilities/dateUtils";

const HackathonsCalendar = ({
  selectedDate,
  setSelectedDate,
  datesToShow,
  mapHackathons,
}) => {
  const { isDark } = useTheme();

  const selectedKey = formatDateToISOShort(selectedDate);

  const eventosEseDia = mapHackathons[selectedKey] || [];

  return (
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
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Hackathones para {formatoFecha(selectedDate)}
          </h2>

          {eventosEseDia.length > 0 ? (
            <ul className="list-disc ml-4">
              {eventosEseDia.map((hack) => (
                <li key={hack.id}>
                  <strong>{hack.title}</strong> —{" "}
                  {formatoFecha(hack.start_date)} a {formatoFecha(hack.end_date)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay hackathones ese día.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HackathonsCalendar;
