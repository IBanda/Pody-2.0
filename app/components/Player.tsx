import { useEffect, useRef, useState, FocusEvent } from 'react';
import PlayerInternals from './PlayerInternals';

export default function Player() {
  const [isVisible, setVisibility] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible && ref.current) ref.current.focus();
  }, [isVisible]);

  const onBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setVisibility(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setVisibility((p) => !p)}
        className={`fixed z-20 left-4 bottom-12 shadow-lg p-4 bg-indigo-600 rounded-full opacity-100 transition transform-gpu duration-200 ${
          isVisible ? '-translate-x-full opacity-0' : 'translate-x-0'
        }`}
      >
        <img
          className="w-8"
          src="/headphone-front-clay.webp"
          alt="headphone"
          width={40}
          height={40}
        />
      </button>

      <div
        tabIndex={0}
        ref={ref}
        className={` bg-pink-800 py-4 px-2  w-full fixed z-20 bottom-0 left-0 shadow-lg transition transform-gpu duration-200 delay-75 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        onBlur={onBlur}
      >
        <PlayerInternals />
      </div>
    </>
  );
}
