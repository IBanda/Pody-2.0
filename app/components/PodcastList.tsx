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
          <Link to={`/podcasts/${podcast.id}`} prefetch="intent">
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

              <motion.h3 className="text-white mt-4 tracking-tighter lg:truncate">
                {podcast.title}
              </motion.h3>
            </motion.div>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
