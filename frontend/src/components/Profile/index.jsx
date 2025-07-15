import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const ProfileComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="grid grid-cols-7 grid-rows-5 gap-1 h-screen">
      <div className="col-span-2 row-span-5 h-full">
        <ul className="menu bg-base-200 rounded-box h-full w-full ">
          <li>
            <a>Enabled item</a>
          </li>
          <li className="menu-disabled">
            <a>disabled item</a>
          </li>
          <li className="menu-disabled">
            <a>disabled item</a>
          </li>
        </ul>
      </div>
      <div className="col-span-3 row-span-4 col-start-3 row-start-2">
        <ul className="list bg-base-100 rounded-box shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            Most played songs this week
          </li>

          <li className="list-row">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
              />
            </div>
            <div>
              <div>Dio Lupa</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Remaining Reason
              </div>
            </div>
            <p className="list-col-wrap text-xs">
              "Remaining Reason" became an instant hit, praised for its haunting
              sound and emotional depth. A viral performance brought it
              widespread recognition, making it one of Dio Lupa’s most iconic
              tracks.
            </p>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li>

          <li className="list-row">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/4@94.webp"
              />
            </div>
            <div>
              <div>Ellie Beilish</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Bears of a fever
              </div>
            </div>
            <p className="list-col-wrap text-xs">
              "Bears of a Fever" captivated audiences with its intense energy
              and mysterious lyrics. Its popularity skyrocketed after fans
              shared it widely online, earning Ellie critical acclaim.
            </p>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li>

          <li className="list-row">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/3@94.webp"
              />
            </div>
            <div>
              <div>Sabrino Gardener</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Cappuccino
              </div>
            </div>
            <p className="list-col-wrap text-xs">
              "Cappuccino" quickly gained attention for its smooth melody and
              relatable themes. The song’s success propelled Sabrino into the
              spotlight, solidifying their status as a rising star.
            </p>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg
                className="size-[1.2em]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li>
        </ul>
      </div>
      <div className="col-span-2 row-span-5 col-start-6 row-start-1">
        <div className="col-span-2 row-span-5 col-start-6 max-w-md mx-auto p-4">
          <h2 className="text-lg font-semibold mb-4">Selecciona una fecha:</h2>

          <div className="border rounded-box p-4 flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>

          {selectedDate && (
            <p className="mt-4">
              Fecha seleccionada:{" "}
              <span className="font-medium">
                {selectedDate.toLocaleDateString()}
              </span>
            </p>
          )}
        </div>
      </div>
      <div className="col-span-3 col-start-3 row-start-1 overflow-x-auto">
        <div className="flex gap-4">
          <div>
            <img src="https://pm1.aminoapps.com/6820/0ea8bb6561df2724541eb2797e09c2fda1ee6baev2_hq.jpg" />
          </div>
          <div>
            <img src="https://pm1.aminoapps.com/6820/0ea8bb6561df2724541eb2797e09c2fda1ee6baev2_hq.jpg" />
          </div>
          <div>
            <img src="https://pm1.aminoapps.com/6820/0ea8bb6561df2724541eb2797e09c2fda1ee6baev2_hq.jpg" />
          </div>
          <div>
            <img src="https://pm1.aminoapps.com/6820/0ea8bb6561df2724541eb2797e09c2fda1ee6baev2_hq.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
