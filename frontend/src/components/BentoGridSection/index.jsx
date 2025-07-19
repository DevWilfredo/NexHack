import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

import { useTheme } from "@context/ThemeContext";

const BentoGridSection = () => {
  const { isDark } = useTheme();

  const cardBg = isDark ? "bg-slate-900/80" : "bg-base-100";

  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  // Variantes para contenedor con stagger
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Variantes para cada card
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="py-16 sm:py-24"
    >
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-base-content sm:text-5xl">
          Todo lo que necesitas para destacar en tecnología
        </p>

        <motion.div
          variants={containerVariants}
          className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2"
        >
          {/* CARD 1 */}
          <motion.div variants={cardVariants} className="relative lg:row-span-2">
            <div
              className={`absolute inset-px rounded-lg ${cardBg} border-primary border lg:rounded-l-4xl`}
            ></div>
            <div
              className={`relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]`}
            >
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p className="mt-2 text-lg font-medium tracking-tight text-base-content max-lg:text-center">
                  Adaptado a móviles
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-base-content/70 max-lg:text-center">
                  Nuestra plataforma está optimizada para que aprendas desde cualquier dispositivo, sin perder calidad ni rendimiento.
                </p>
              </div>
              <div className="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-base-content/20 bg-base-200 shadow-2xl">
                  <img
                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png"
                    alt=""
                    className="size-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl"></div>
          </motion.div>

          {/* CARD 2 */}
          <motion.div variants={cardVariants} className="relative max-lg:row-start-1">
            <div
              className={`absolute inset-px rounded-lg ${cardBg} border-primary border max-lg:rounded-t-4xl`}
            ></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-base-content max-lg:text-center">
                  Alto rendimiento
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-base-content/70 max-lg:text-center">
                  Aprende y construye de forma rápida con herramientas modernas diseñadas para ofrecer resultados reales.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <img
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                  alt=""
                  className="w-full max-lg:max-w-xs"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl"></div>
          </motion.div>

          {/* CARD 3 */}
          <motion.div
            variants={cardVariants}
            className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2"
          >
            <div
              className={`absolute inset-px rounded-lg ${cardBg} border-primary border`}
            ></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-base-content max-lg:text-center">
                  Seguridad y privacidad
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-base-content/70 max-lg:text-center">
                  Protegemos tus datos y proyectos con tecnología de primer nivel para que te enfoques en lo que importa: aprender y crecer.
                </p>
              </div>
              <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                <img
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                  alt=""
                  className="h-[min(152px,40cqw)] object-cover"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5"></div>
          </motion.div>

          {/* CARD 4 */}
          <motion.div variants={cardVariants} className="relative lg:row-span-2">
            <div
              className={`absolute inset-px rounded-lg ${cardBg} border-primary border max-lg:rounded-b-4xl lg:rounded-r-4xl`}
            ></div>
            <div
              className={`relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]`}
            >
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p className="mt-2 text-lg font-medium tracking-tight text-base-content max-lg:text-center">
                  APIs y herramientas integradas
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-base-content/70 max-lg:text-center">
                  Accede a integraciones potentes que te permiten conectar, desplegar y mostrar tus proyectos sin complicaciones.
                </p>
              </div>
              <div className="relative min-h-120 w-full grow">
                <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-base-200 shadow-2xl outline outline-white/10">
                  <img
                    src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
                    alt=""
                    className="w-3xl max-w-none rounded-xl bg-base-200 shadow-xl ring-1 ring-base-300 sm:w-228"
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BentoGridSection;