import { useEffect, useRef, useState, FocusEvent } from 'react';
import PlayerInternals from './PlayerInternals';

type Props = {
  src: string;
};

export default function Player({ src }: Props) {
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
        className={`fixed left-4 bottom-12 shadow-lg p-4 bg-indigo-600 rounded-full opacity-100 transition transform-gpu duration-200 ${
          isVisible ? '-translate-x-full opacity-0' : 'translate-x-0'
        }`}
      >
        <img
          className="w-8"
          src="/headphone-front-clay.png"
          alt="headphone"
        />
      </button>

      <div
        tabIndex={0}
        ref={ref}
        className={` bg-gradient-to-r from-red-900 to-blue-600 py-4 px-2 bg-opacity-95 w-full fixed bottom-0 left-0 shadow-lg transition transform-gpu duration-200 delay-75 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        onBlur={onBlur}
      >
        <PlayerInternals src={src} />
      </div>
    </>
  );
}
