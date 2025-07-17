import { frameworks } from "../../data/Tech";
import { useTheme } from "@context/ThemeContext";
import AstroLight from "@components/Icons/Astro";
import AstroDark from "@components/Icons/AstroDark";
import ExpressLight from "@components/Icons/ExpressLight";
import ExpressDark from "@components/Icons/ExpressDark";
import FlaskLight from "@components/Icons/FlaskLight";
import FlaskDark from "@components/Icons/FlaskDark";

const TechGridSection = () => {
  const { isDark } = useTheme();
  const themedFrameworks = frameworks.map((fw) => {
    let icon = fw.icon;
    let neon = fw.neon;

    if (fw.name === "Astro") icon = isDark ? AstroLight : AstroDark;
    if (fw.name === "Express.js") icon = isDark ? ExpressLight : ExpressDark;
    if (fw.name === "Flask") icon = isDark ? FlaskLight : FlaskDark;
    if (fw.name === "Next.js") neon = isDark ? "#ffffff" : "#000000";
    if (fw.name === "Express.js") neon = isDark ? "#ffffff" : "#000000";
    if (fw.name === "Flask") neon = isDark ? "#ffffff" : "#000000";

    return { ...fw, icon, neon };
  });

  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">
        Domina las tecnologías que impulsan los proyectos reales
      </h2>
      <p className="max-w-2xl mx-auto mb-3 text-lg text-gray-500 dark:text-gray-400">
        Aprende construyendo proyectos completos en equipo. Enfréntate a
        desafíos grupales reales usando los frameworks y lenguajes más
        demandados, como lo harías en un hackatón profesional.
      </p>
      <div className="flex justify-center">
            <div
              className={`w-16 h-1 rounded-full ${
                isDark ? "bg-accent" : "bg-primary"
              } inline-flex `}
            ></div>
          </div>
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {themedFrameworks.map(({ name, icon: Icon, neon }) => (
          <div
            key={name}
            className="group p-4 rounded-xl transition duration-[300ms]"
            style={{ "--neon": neon }}
          >
            <div
              className="
                rounded-lg p-4 transition duration-[300ms]
                group-hover:ring-2 group-hover:ring-[var(--neon)]
                group-hover:shadow-[0_0_40px_var(--neon)]
                drop-shadow
                cursor-pointer
                hover:scale-105
              "
            >
              <Icon className="w-12 h-12" />
            </div>
            <span className="sr-only">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechGridSection;
