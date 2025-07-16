import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const DashboardComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Simulate fetching tags data from an API
    fetch("http://127.0.0.1:5000/api/v1/tags")
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
      })

      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar izquierda (20%) */}
      <div className="basis-1/5 p-2">
        <div className="collapse collapse-plus menu bg-base-200 rounded-box h-full">
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
      <div className="basis-3/5 pt-4 flexgap-4">
        {/* Zona superior con imágenes (como leetcode) */}
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 ">
            {Array.from({ length: 10 }).map((_, idx) => (
              <img
                key={idx}
                className="w-50 h-30 rounded-box shadow-md shadow-success"
                src="https://pm1.aminoapps.com/6820/0ea8bb6561df2724541eb2797e09c2fda1ee6baev2_hq.jpg"
                alt={`img-${idx}`}
              />
            ))}
          </div>
        </div>
        {/* Tags */}
        <div className=" h-20">
          <div className="flex gap-2 pt-2 collapse">
            {tags.map((tag) => (
              <button
                key={tag.id}
                className="btn  btn-primary text-success shadow-sm shadow-accent"
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        {/* Lista de hackatones */}
        <div className="bg-base-200 rounded-box p-4 flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold">Lista de Hackatones</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {[
              "Hack the Future",
              "CodeStorm 2025",
              "Dev Clash",
              "ByteHack Nights",
              "ReactRush",
              "Moonshot Labs",
              "NeoHack",
              "StackShift Summit",
            ].map((hackathon, idx) => (
              <li
                key={hackathon}
                className={`p-2 text-sm ${
                  idx % 2 === 0
                    ? "bg-primary text-primary-content rounded-box"
                    : ""
                }`}
              >
                {hackathon}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Zona derecha (20%) */}
      <div className="basis-1/5 p-4">
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
