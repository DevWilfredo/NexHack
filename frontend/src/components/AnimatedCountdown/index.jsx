import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import logo from "@assets/nexhack.png"

// NOTE: Change this date to whatever date you want to countdown to :)
const COUNTDOWN_FROM = "2025-08-08";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

 // Asegúrate de que el logo esté en public/

const ShiftingCountdown = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-[#010515]">
      <img src={logo} alt="NexHack Logo" className="w-auto h-20 mb-4 drop-shadow-lg" />
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">Proximamente</h1>
      <p className="mb-8 text-white text-lg md:text-xl">¡Estamos preparando algo increíble!</p>
      <div className="w-full max-w-3xl flex items-center justify-center bg-[#9a031e] rounded-xl shadow-xl p-4">
        <CountdownItem unit="Day" text="días" />
        <CountdownItem unit="Hour" text="horas" />
        <CountdownItem unit="Minute" text="minutos" />
        <CountdownItem unit="Second" text="segundos" />
      </div>
    </section>
  );
};

const CountdownItem = ({ unit, text }) => {
  const { ref, time } = useTimer(unit);

  return (
    <div className="flex h-24 w-1/4 flex-col items-center justify-center gap-1 border-r-[1px] border-base-300 font-mono md:h-36 md:gap-2">
      <div className="relative w-full overflow-hidden text-center">
        <span
          ref={ref}
          className="block text-2xl font-bold text-white md:text-4xl lg:text-6xl xl:text-7xl drop-shadow"
        >
          {time}
        </span>
      </div>
      <span className="text-xs font-light text-base-content/70 md:text-sm lg:text-base">
        {text}
      </span>
    </div>
  );
};

export default ShiftingCountdown;

// NOTE: Framer motion exit animations can be a bit buggy when repeating
// keys and tabbing between windows. Instead of using them, we've opted here
// to build our own custom hook for handling the entrance and exit animations
const useTimer = (unit) => {
  const [ref, animate] = useAnimate();

  const intervalRef = useRef(null);
  const timeRef = useRef(0);

  const [time, setTime] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => clearInterval(intervalRef.current || undefined);
  }, []);

  const handleCountdown = async () => {
    const end = new Date(COUNTDOWN_FROM);
    const now = new Date();
    const distance = +end - +now;

    let newTime = 0;

    if (unit === "Day") {
      newTime = Math.floor(distance / DAY);
    } else if (unit === "Hour") {
      newTime = Math.floor((distance % DAY) / HOUR);
    } else if (unit === "Minute") {
      newTime = Math.floor((distance % HOUR) / MINUTE);
    } else {
      newTime = Math.floor((distance % MINUTE) / SECOND);
    }

    if (newTime !== timeRef.current) {
      // Exit animation
      await animate(
        ref.current,
        { y: ["0%", "-50%"], opacity: [1, 0] },
        { duration: 0.35 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      // Enter animation
      await animate(
        ref.current,
        { y: ["50%", "0%"], opacity: [0, 1] },
        { duration: 0.35 }
      );
    }
  };

  return { ref, time };
};