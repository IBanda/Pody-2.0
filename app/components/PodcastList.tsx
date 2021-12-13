import { motion } from 'framer-motion';
import type { BestPodcast } from 'podcast-api';
import { Link } from 'remix';
import { Skeleton } from '@mui/material';
import { container, item } from '../../utils/transitionSettings';

type Props = {
  podcasts: BestPodcast[];
};

export default function PodcastList({ podcasts }: Props) {
  return (
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
            className="relative podcast_card p-3 bg-gray-700 rounded-lg bg-opacity-10 shadow-lg cursor-pointer "
          >
            <div style={{ paddingTop: '98%' }} className="relative">
              <img
                className="absolute left-0 top-0 w-full "
                src={podcast.thumbnail}
                alt={podcast.title}
              />

              <Skeleton
                variant="rectangular"
                sx={{
                  padding: '50%',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                }}
              />
            </div>
            <Link
              className="podcast_link w-12 h-12 bg-gradient-to-r from-red-900 to-blue-600 absolute rounded-full flex items-center justify-center shadow-lg top-1 z-10 "
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
  );
}
