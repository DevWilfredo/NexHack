import { useTheme } from "../../context/ThemeContext";
import { benefits } from "../../data/benefits";
import ButtonPrimary from "../ButtonPrimary";

const BenefitsSection = () => {
  const { isDark } = useTheme();
  return (
    <section className="text-base-content">
      <div className="container px-5 py-24 mx-auto">
        <div className="text-center mb-20">
          <h1 className="sm:text-4xl text-3xl font-bold title-font mb-4">
            ¿Por qué unirte a nuestra plataforma?
          </h1>
          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-base-content/70">
            Más que ejercicios sueltos: desafíos reales, en equipo y con presión
            de tiempo. Practicá como en el mundo real.
          </p>
          <div className="flex mt-6 justify-center">
            <div
              className={`w-16 h-1 rounded-full ${
                isDark ? "bg-accent" : "bg-primary"
              } inline-flex`}
            ></div>
          </div>
        </div>

        <div className="flex flex-wrap -mx-4 -mb-10 -mt-4 space-y-6 md:space-y-0">
          {benefits.map(({ icon: Icon, title, description }, idx) => (
            <div
              key={idx}
              className={`p-4 md:w-1/3 flex flex-col text-center items-center`}
            >
              <div
                className={`w-20 h-20 inline-flex items-center justify-center rounded-full bg-${
                  isDark ? "accent/10" : "primary/30"
                } text-${isDark ? "accent" : "primary"} mb-5`}
              >
                <Icon className="w-10 h-10" />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-semibold mb-3">{title}</h2>
                <p className="leading-relaxed text-base text-base-content/70">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ButtonPrimary
          title="Explorar Desafíos"
          className="flex mx-auto mt-16 px-8 text-lg"
        />
      </div>
    </section>
  );
};

export default BenefitsSection;
