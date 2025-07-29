import React from "react";
import { ChevronRight, Newspaper } from "lucide-react";
import { useTheme } from "@context/ThemeContext";
import ButtonPrimary from "@components/ButtonPrimary";
import ButtonSecondary from "@components/ButtonSecondary";
import { motion } from "framer-motion";
import AnimatedSection from "@components/AnimatedSection";
import nexhackDark from "@assets/nexhackDark.webp";
import nexhackBlueDashboard from "@assets/nexhackBlueDashboard.webp";

const Hero = () => {
  const { isDark } = useTheme();

  return (
    <section className="pt-10">
      <div className="px-12 mx-auto max-w-7xl">
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center"
          >
            <h1
              className={`mb-8 text-4xl font-extrabold leading-none tracking-normal ${
                isDark ? "text-accent" : "text-primary"
              } md:text-6xl md:tracking-tight`}
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
          </motion.div>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full mx-auto mt-20 text-center md:w-10/12"
          >
            <div className="relative z-0 w-full mt-8">
              <div className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg border border-base-200">
                {/* Barra del navegador */}
                <div className="flex items-center justify-between px-4 py-2 bg-primary border-b border-base-200 space-x-4 rounded-t-xl">
                  {/* Botones estilo navegador */}
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  {/* Botón de recarga */}
                  <button className="text-white hover:text-gray-700 text-sm cursor-pointer">
                    ⟳
                  </button>
                </div>

                {/* Contenido del navegador */}
                <img src={isDark ? nexhackDark : nexhackBlueDashboard} alt="dashboard" className="w-full" />
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Hero;
