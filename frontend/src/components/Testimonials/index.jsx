import { useTheme } from "@context/ThemeContext";
import { testimonials } from "@data/testimonials";

const Testimonials = () => {
  const { isDark } = useTheme();
  return (
    <section id="testimonios" className="py-20">
      <div className="max-w-6xl mx-6 lg:mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mt-4 mb-4 text-4xl font-bold text-base-content">
            No lo decimos solo nosotros.
          </h2>
          <p className="text-lg text-base-content">
            Mira lo que dicen quienes ya usaron nuestra plataforma.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonio, index) => (
            <div
              key={index}
              className={`relative group card overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.025]
    ${isDark ? "bg-slate-900/80" : "bg-primary/20"} shadow-xl`}
            >
              {/* Glow pseudo-elemento */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${
                  isDark ? "from-accent to-accent" : "from-primary to-secondary"
                } opacity-0 blur-lg transition duration-500 group-hover:opacity-50 pointer-events-none z-0`}
              />

              {/* Card Content */}
              <div className="card-body relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonio.avatar}
                    alt={testimonio.nombre}
                    className="w-12 h-12 rounded-full border border-primary"
                  />
                  <div>
                    <h3 className="text-base-content font-semibold">
                      {testimonio.nombre}
                    </h3>
                    <p className="text-sm text-base-content">
                      {testimonio.rol}
                    </p>
                  </div>
                </div>
                <p className="text-base-content text-sm leading-relaxed">
                  {testimonio.mensaje}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
