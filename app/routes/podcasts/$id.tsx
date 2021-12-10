import { useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import { client } from '~/api/client';
import invariant from 'tiny-invariant';
import { motion } from 'framer-motion';
import { FetchPodcastByIdPayload } from 'podcast-api';

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, 'ID expected');
  const response = await client.fetchPodcastById({
    id: params.id,
  });
  const { data } = response;
  return data;
};

export default function Podcast() {
  const podcast = useLoaderData<FetchPodcastByIdPayload>();
  return (
    <div className="grid grid-cols-3 gap-4 text-white mt-8">
      <div className="col-span-1 sticky top-4">
        <motion.img
          className="max-w-md w-full rounded-sm"
          src={podcast.image}
          alt={podcast.title}
        />
        <motion.h1 className="text-xl font-medium tracking-tighter my-4">
          {podcast.title}
        </motion.h1>
        <motion.div
          className="mb-4 text-sm"
          dangerouslySetInnerHTML={{ __html: podcast.description }}
        />
        <motion.span className="text-xs ">
          Publisher: {podcast.publisher}
        </motion.span>
      </div>
      <div className="col-span-2">
        <motion.div className="col-span-2">
          <motion.ul>
            {podcast.episodes.map((episode) => (
              <motion.li className="mb-4" key={episode.id}>
                <div className="cursor-pointer episode_item relative flex items-center bg-gray-700 p-2 bg-opacity-10">
                  <button className="mr-4">
                    <img
                      className="w-8 "
                      src="/play-front-gradient.png"
                      alt="play"
                    />
                  </button>
                  <p className="text-xs truncate">{episode.title}</p>
                  <button className="episode_save bg-gradient-to-r from-red-900 to-blue-600 rounded-full w-6 h-6 flex items-center justify-center absolute -right-2 -top-2">
                    <img
                      className="w-3"
                      src="/plus-front-clay.png"
                      alt="add to my playlist"
                    />
                  </button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
}
