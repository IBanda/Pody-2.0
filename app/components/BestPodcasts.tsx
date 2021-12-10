import type { BestPodcast } from 'podcast-api';
import { motion } from 'framer-motion';
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
  return (
    <section>
      <div className="flex items-center">
        <h2 className="text-white font-bold text-5xl tracking-tighter mb-8">
          Best Podcasts
        </h2>
        <img
          className="w-14 -mt-4 transform rotate-45"
          src="/trophy-front-gradient.png"
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
              className=" podcast_card p-3 bg-gray-700 rounded-lg bg-opacity-10 shadow-lg cursor-pointer relative"
            >
              <motion.img
                src={podcast.thumbnail}
                alt={podcast.title}
              />
              <Link
                className="podcast_link w-12 h-12 bg-gradient-to-r from-red-900 to-blue-600 absolute rounded-full flex items-center justify-center shadow-lg top-1 "
                to={`/podcasts/${podcast.id}`}
              >
                <img
                  className="w-8 h-8"
                  src="/link-front-clay.png"
                  alt="link"
                />
              </Link>
              <motion.h3 className="text-white mt-4 tracking-tighter lg:truncate">
                {podcast.title}
              </motion.h3>
            </motion.div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
