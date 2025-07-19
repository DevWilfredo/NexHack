import React from "react";
import { NavLink, useParams } from "react-router";

const hackathon = {
  created_at: "2025-07-16T19:25:01.404113",
  creator_id: 1,
  description:
    "Construye algo increíble en solo 48 horas.Construye algo increíble en solo 48 horas.Construye algo increíble en solo 48 horas.Construye algo increíble en solo 48 horas.",
  end_date: "2025-09-01T00:00:00",
  id: 1,
  max_team_members: 5,
  max_teams: 10,
  rules: [
    {
      hackathon_id: 1,
      id: 1,
      rule_text: "Tiempo límite de entrega: 48h",
    },
    {
      hackathon_id: 1,
      id: 2,
      rule_text: "Tiempo límite de entrega: 48h",
    },
    {
      hackathon_id: 1,
      id: 3,
      rule_text: "Presentación obligatoria en video",
    },
    {
      hackathon_id: 1,
      id: 4,
      rule_text: "Uso de Tailwind recomendado",
    },
  ],
  start_date: "2025-08-01T00:00:00",
  status: "closed",
  tags: [
    {
      id: 1,
      name: "React",
    },
    {
      id: 2,
      name: "React",
    },
    {
      id: 3,
      name: "React",
    },
    {
      id: 4,
      name: "React",
    },
    {
      id: 5,
      name: "React",
    },
    {
      id: 6,
      name: "React",
    },
    {
      id: 7,
      name: "React",
    },
    {
      id: 8,
      name: "React",
    },
    {
      id: 9,
      name: "React",
    },
    {
      id: 10,
      name: "React",
    },
  ],
  title: "Open Source Push #1",
  updated_at: "2025-07-16T19:25:01.404115",
};

const equipos = [
  {
    id: 1,
    name: "Equipo A",
    members: ["Alice", "Bob"],
  },
  {
    id: 2,
    name: "Equipo B",
    members: ["Charlie", "David"],
  },
  {
    id: 3,
    name: "Equipo C",
    members: ["Eve", "Frank"],
  },
  {
    id: 4,
    name: "Equipo D",
    members: ["Grace", "Heidi"],
  },
  {
    id: 5,
    name: "Equipo E",
    members: ["Ivan", "Judy"],
  },
];
function HackathonsPage() {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className=" mx-auto mt-10 p-6 bg-base-100 rounded-xl shadow-xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{hackathon.title}</h1>
        <button className="btn btn-error btn-outline no-animation hover:bg-transparent hover:border-error hover:text-error mr-10">
          {hackathon.status}
        </button>
      </div>
      <div>
        <p className="text-lg">{hackathon.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {hackathon.tags.map((tag) => (
          <div key={tag.id} className="badge badge-accent badge-lg">
            #{tag.name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title">Fecha de inicio</h2>
            <p>{formatDate(hackathon.start_date)}</p>
          </div>
        </div>
        <div className="card bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title">Fecha de finalización</h2>
            <p>{formatDate(hackathon.end_date)}</p>
          </div>
        </div>
      </div>
      <div
        className=" grid grid-cols-1 sm:grid-cols-3 gap-4
      "
      >
        <div className="flex card bg-neutral text-neutral-content p-5">
          <h2 className="text-2xl font-semibold mb-2">Reglas</h2>
          <ul className="list-disc list-inside space-y-1">
            {hackathon.rules.map((rule) => (
              <li key={rule.id}>{rule.rule_text}</li>
            ))}
          </ul>
          <div className="mt-5">
            <h2 className="text-2xl font-semibold mb-2">Limite de equipos</h2>
            <p>Cantidad de equipos: {hackathon.max_teams}</p>
            <p>Participantes por equipo: {hackathon.max_team_members}</p>
          </div>
        </div>
        <div className="card bg-neutral text-neutral-content p-5">
          <h2 className="text-2xl font-semibold mb-4">Equipos</h2>
          <div className="space-y-2">
            {equipos.map((equipo) => (
              <div
                key={equipo.id}
                className="collapse collapse-plus bg-base-200 rounded-box"
              >
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium">
                  {equipo.name}
                </div>
                <div className="collapse-content">
                  <ul className="list-disc list-inside ">
                    {equipo.members.map((member, index) => (
                      <li key={`${equipo.id}-${member}`}>{member}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral text-neutral-content p-5 card">
          <h2 className="text-2xl font-semibold mb-4">Jurados</h2>

          <div className="carousel w-full">
            <div id="slide1" className="carousel-item relative w-full ">
              <div className="card card-side bg-base-100 shadow-sm">
                <figure>
                  <img
                    src="https://e7.pngegg.com/pngimages/815/502/png-clipart-chibi-anime-junjo-romantica-pure-romance-neko-atsume-natsu-dragneel-chibi-mammal-black-hair-thumbnail.png"
                    alt="Movie"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Pepe</h2>
                  <p>See more information... </p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-accent">See profile</button>
                  </div>
                </div>
              </div>
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide4" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide2" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
              <div className="card card-side bg-base-100 shadow-sm">
                <figure>
                  <img
                    src="https://stickershop.line-scdn.net/stickershop/v1/product/22336629/LINEStorePC/main.png?v=1"
                    alt="Movie"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Super Harcoding</h2>
                  <p>See more information... </p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-accent">See profile</button>
                  </div>
                </div>
              </div>
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide1" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide3" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
              <div className="card card-side bg-base-100 shadow-sm">
                <figure>
                  <img
                    src="https://png.pngitem.com/pimgs/s/573-5733455_neko-disguise-chibi-ftestickers-remix-ftedit-cat-hd.png"
                    alt="Movie"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Mr Hardcoded</h2>
                  <p>See more information... </p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-accent">See profile</button>
                  </div>
                </div>
              </div>
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide2" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide4" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
            <div id="slide4" className="carousel-item relative w-full">
              <div className="card card-side bg-base-100 shadow-sm">
                <figure>
                  <img
                    src="https://stickershop.line-scdn.net/stickershop/v1/product/24007132/LINEStorePC/main.png?v=1"
                    alt="Movie"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Jazmin</h2>
                  <p>See more information... </p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-accent">See profile</button>
                  </div>
                </div>
              </div>
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide3" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide1" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end ">
        <div
          className="dropdown dropdown-top dropdown-left
         "
        >
          <label
            tabIndex={0}
            className="btn btn-accent btn-outline  text-accent-content"
          >
            Participar
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow-2xl  bg-accent rounded-box w-52"
          >
            <li>
              <a>Unirte como jurado</a>
            </li>
            <li>
              <a>Crear un equipo</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HackathonsPage;
