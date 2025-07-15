import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const ProfileComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);

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
      <div className="basis-3/5 p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Zona superior con imágenes (como leetcode) */}
        <div className="overflow-x-auto overflow-y-hidden h-60">
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
        <div className="flex flex-wrap gap-2">
          {[
            "React",
            "Flask",
            "Django",
            "Python",
            "Javascript",
            "C#",
            "C++",
            "Typescript",
            "Vue",
            "Angular",
          ].map((tag) => (
            <button key={tag} className="btn btn-sm btn-outline rounded-full">
              {tag}
            </button>
          ))}
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

export default ProfileComponent;
