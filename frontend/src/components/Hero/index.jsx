import React from "react";
import { ChevronRight, Newspaper } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ButtonPrimary from "../ButtonPrimary";
import ButtonSecondary from "../ButtonSecondary";

const Hero = () => {
  const { isDark } = useTheme();
  return (
    <section className="pt-10">
      <div className="px-12 mx-auto max-w-7xl">
        <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
          <h1
            className={`mb-8 text-4xl font-extrabold leading-none tracking-normal text-${isDark ? 'accent' : 'primary'} md:text-6xl md:tracking-tight`}
          >
            <span>¿Listo para</span>{" "}
            <span
              className={`block w-full py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r ${
                isDark
                  ? "from-accent to-secondary"
                  : "from-primary to-secondary"
              } lg:inline`}
            >
              programar, competir y colaborar
            </span>{" "}
            <span>en hackatones reales?</span>
          </h1>

          <p>
            Deja atrás los ejercicios aislados. Enfrenta desafíos reales, con
            personas reales, en tiempo real.
          </p>

          <div className="mb-4 space-x-0 md:space-x-2 md:mb-8 mt-4">
            <ButtonPrimary
              title="Empieza Ahora"
              icon={ChevronRight}
              className="w-full sm:w-auto mb-2 sm:mb-0"
            />
            <ButtonSecondary
              title="Saber Mas"
              icon={Newspaper}
              className="w-full sm:w-auto mb-2 sm:mb-0"
            />
          </div>
        </div>

        <div className="w-full mx-auto mt-20 text-center md:w-10/12">
          <div className="relative z-0 w-full mt-8">
            <div className="relative overflow-hidden shadow-2xl">
              <div className="flex items-center flex-none px-4 bg-primary rounded-b-none h-11 rounded-xl">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 border-2 border-base-100 rounded-full"></div>
                  <div className="w-3 h-3 border-2 border-base-100 rounded-full"></div>
                  <div className="w-3 h-3 border-2 border-base-100 rounded-full"></div>
                </div>
              </div>
              <img
                src="https://cdn.devdojo.com/images/march2021/green-dashboard.jpg"
                alt="dashboard"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
