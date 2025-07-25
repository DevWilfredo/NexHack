import React from "react";
import { ExternalLink, Rocket, Github, CalendarDays } from "lucide-react";

function HackathonHistory({ hackathons, search, setSearch }) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por hackathon o equipo..."
          className="input bg-base-200  w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {hackathons.map((hack, index) => (
          <li key={index} className="rounded-xl bg-base-200 p-4 shadow-lg/20 shadow-accent hover:scale-105 transition-all">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">{hack.name}</h3>
              <span className="badge badge-accent text-sm">#{hack.ranking}</span>
            </div>

            <p className="text-sm text-gray-400 mb-2">
              <span className="font-semibold">Equipo:</span> {hack.teamName}
            </p>

            <p className="text-sm mb-2">{hack.description}</p>

            <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
              <CalendarDays />
              {new Date(hack.date).toLocaleDateString()}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {hack.projectLink && (
                <a
                  href={hack.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm border border-gray-600"
                >
                  <Github size={16} /> Proyecto
                </a>
              )}
              {hack.deployLink && (
                <a
                  href={hack.deployLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-accent"
                >
                  <Rocket size={16} /> Deploy
                </a>
              )}
              {hack.hackathonLink && (
                <a
                  href={hack.hackathonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-info text-gray-700"
                >
                  <ExternalLink size={16} /> Hackathon
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default HackathonHistory;
