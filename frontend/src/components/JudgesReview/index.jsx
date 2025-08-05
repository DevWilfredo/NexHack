import { Trophy } from "lucide-react";
import StaticStarsComponent from "../StaticStars";

function JudgesReviewComponent({ name, points, image, quote, score }) {
  return (
    <div className="flex w-full p-4 max-w-full md:max-w-lg flex-col rounded-xl bg-base-200 shadow-lg/30 shadow-primary">
      {/* Encabezado: Imagen + Nombre + Estrellas */}
      <div className="flex md:flex-row flex-col items-start md:items-center gap-4 text-base-content">
        <div className="flex items-center gap-4">
          <img
            src={image}
            alt={name}
            className="h-[58px] w-[58px] rounded-full object-cover object-center"
          />

          {/* Estrellas debajo del nombre (solo en móviles) */}
          <div className="md:hidden flex flex-col">
            <h5 className="text-lg font-semibold">{name}</h5>
            <div className="mt-1">
              <StaticStarsComponent value={10} small />
            </div>
            <label className="badge bg-primary mt-2 w-fit">
              <Trophy className="text-warning" />
              {points ? points : 0}pts
            </label>
          </div>
        </div>

        {/* En desktop: nombre y estrellas alineados horizontalmente */}
        <div className="hidden md:flex flex-col w-full">
          <div className="flex items-center justify-between">
            <h5 className="text-lg font-semibold">{name}</h5>
            <div className="flex gap-0.5">
              <StaticStarsComponent value={score} />
            </div>
          </div>
          <label className="badge bg-primary mt-1 w-fit">
            <Trophy className="text-warning" />
            {points ? points : 0}pts
          </label>
        </div>
      </div>

      {/* Comentario */}
      <div className="mt-6">
        <p className="text-base text-base-content leading-relaxed">{quote}</p>
      </div>
    </div>
  );
}

export default JudgesReviewComponent;
