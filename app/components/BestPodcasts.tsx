import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import type { BestPodcast } from 'podcast-api';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'remix';

type Props = {
  podcasts: BestPodcast[];
};

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function BestPodcasts({ podcasts }: Props) {
  const [selectedPodcast, setSelectedPodcast] =
    useState<BestPodcast | null>(null);
  const elRef = useRef<HTMLDivElement | null>(null);

  const onEnter = (e: KeyboardEvent, podcast: BestPodcast) => {
    if (e.key === 'Enter') {
      setSelectedPodcast(podcast);
    }
  };

  useEffect(() => {
    if (selectedPodcast && elRef.current) {
      elRef.current.focus();
    }
  }, [selectedPodcast]);

  return (
    <section>
      <div className="flex items-center">
        <h2 className="text-white font-bold text-5xl tracking-tighter mb-8">
          Best Podcasts
        </h2>
        <img
          className="w-14 -mt-4 transform rotate-45"
          src="/trophy-front-premium.png"
          alt="trophy"
        />
      </div>
      <motion.ul
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {podcasts.map((podcast) => (
          <motion.li key={podcast.id} variants={item}>
            <motion.div
              tabIndex={0}
              onKeyDown={(e) => onEnter(e, podcast)}
              layoutId={podcast.id}
              className=" p-3 bg-gray-700 rounded-lg bg-opacity-10 shadow-lg cursor-pointer"
              onClick={() => setSelectedPodcast(podcast)}
            >
              <motion.img
                src={podcast.thumbnail}
                alt={podcast.title}
              />
              <motion.h3 className="text-white mt-4 tracking-tighter lg:truncate">
                {podcast.title}
              </motion.h3>
            </motion.div>
          </motion.li>
        ))}
      </motion.ul>
      <AnimatePresence>
        {selectedPodcast && (
          <motion.div
            className="fixed bg-pink-600 bg-opacity-10 left-0 w-full top-0 h-full flex justify-center items-center p-3"
            layoutId={selectedPodcast.id}
          >
            <motion.div
              tabIndex={0}
              ref={elRef}
              className="relative p-3  bg-gray-700 text-white rounded-lg w-96 max-h-96 overflow-y-auto shadow-lg cursor-pointer "
            >
              <div className="flex items-center justify-between mb-4">
                <Link
                  to=""
                  className=" w-12 h-12  flex items-center justify-center bg-gradient-to-r from-pink-700  to-yellow-600  p-1 rounded-full shadow-lg"
                >
                  <img
                    src="/headphone-front-premium.png"
                    className="w-8"
                  />
                </Link>
                <motion.button
                  className=" text-white  w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-pink-700  to-yellow-600 "
                  onClick={() => setSelectedPodcast(null)}
                >
                  {'\u2715'}
                </motion.button>
              </div>
              <motion.img
                className="w-28 m-1 -mb-1 ml-0 shadow-lg float-left"
                src={selectedPodcast.thumbnail}
                alt={selectedPodcast.title}
              />
              <motion.h2 className="font-medium tracking-tighter text-lg mb-2">
                {selectedPodcast.title}
              </motion.h2>
              <motion.div
                className="tracking-tighter text-sm"
                dangerouslySetInnerHTML={{
                  __html: selectedPodcast.description,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
