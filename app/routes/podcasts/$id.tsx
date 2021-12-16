import { MetaFunction, useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import { client } from '~/api/client.server';
import invariant from 'tiny-invariant';
import { motion } from 'framer-motion';
import { Episode, FetchPodcastByIdPayload } from 'podcast-api';
import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeList as List } from 'react-window';
import { useState } from 'react';
import { usePlayer } from '~/components/PlayerContext';

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const nextEpisodePubDate = url.searchParams.get(
    'next_episode_pub_date'
  );
  invariant(params.id, 'ID expected');
  const response = await client.fetchPodcastById({
    id: params.id,
    sort: 'recent_first',
    ...(nextEpisodePubDate
      ? { next_episode_pub_date: Number(nextEpisodePubDate) }
      : null),
  });
  const { data } = response;
  return data;
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data.title,
  };
};

type ChildRenderFnProps = {
  index: number;
  style: React.CSSProperties;
};

type EpisodePayload = {
  status: 'idle' | 'loading' | 'rejected' | 'resolved';
  episodes: Episode[];
  next_episode_pub_date: number;
};

export default function Podcast() {
  const podcast = useLoaderData<FetchPodcastByIdPayload>();
  const [{ status, episodes, next_episode_pub_date }, setEpisodes] =
    useState<EpisodePayload>({
      status: 'idle',
      episodes: podcast.episodes,
      next_episode_pub_date: podcast.next_episode_pub_date,
    });

  const itemCount = next_episode_pub_date
    ? episodes.length + 1
    : episodes.length;

  const isItemLoaded = (index: number) =>
    !next_episode_pub_date || index < episodes.length;

  const loadMoreItems =
    status === 'loading' || !next_episode_pub_date
      ? // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      : async () => {
          try {
            setEpisodes((prev) => ({
              ...prev,
              status: 'loading',
            }));
            const response = await fetch(
              `/podcasts/${podcast.id}/${next_episode_pub_date}`
            );
            const data = await response.json();
            setEpisodes((prev) => ({
              status: 'resolved',
              episodes: [...prev.episodes, ...data.episodes],
              next_episode_pub_date: data.next_episode_pub_date,
            }));
          } catch (error) {
            throw new Error(error as string);
          } finally {
            setEpisodes((prev) => ({
              ...prev,
              status: 'idle',
            }));
          }
        };

  const Episode = ({ index, style }: ChildRenderFnProps) => {
    const { play, status, id } = usePlayer();
    const episode = episodes[index];

    const onClick = () => {
      if (
        status === 'paused' ||
        status === 'error' ||
        id !== episode.id
      ) {
        play({
          id: episode.id,
          title: episode.title,
          playing: episode.audio,
          status: 'playing',
        });
      } else {
        play((prev) => ({
          ...prev,
          status: 'paused',
        }));
      }
    };

    return (
      <div
        style={{ ...style, marginBottom: 10 }}
        className={`cursor-pointer episode_item relative flex items-center  p-2 bg-opacity-10 mb-4 ${
          (index + 1) % 2 === 0 ? 'bg-gray-700' : 'bg-black'
        }`}
      >
        {!isItemLoaded(index) ? (
          <div className="loader" />
        ) : (
          <>
            <div className="w-10 h-10 mr-2 ">
              <button className="w-10 h-10" onClick={onClick}>
                <img
                  className="w-8 "
                  src={`${
                    status === 'playing' && id === episode.id
                      ? '/pause-front-gradient.png'
                      : '/play-front-gradient.png'
                  }`}
                  alt="play"
                />
              </button>
            </div>
            <p className="text-xs truncate">{episode.title}</p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 text-white ">
      <div className="col-span-1 ">
        <motion.img
          className="max-w-md w-full rounded-sm"
          src={podcast.image}
          alt={podcast.title}
        />
        <motion.span className="text-xs ">
          Publisher: {podcast.publisher}
        </motion.span>
      </div>
      <div className="col-span-2">
        <motion.h1 className="text-xl font-medium tracking-tighter mb-4">
          {podcast.title}
        </motion.h1>
        <motion.div
          className="mb-4 text-sm"
          dangerouslySetInnerHTML={{
            __html: podcast.description,
          }}
        />
        <InfiniteLoader
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          isItemLoaded={isItemLoaded}
        >
          {({ onItemsRendered, ref }) => (
            <List
              itemCount={itemCount}
              height={500}
              itemSize={70}
              width={'100%'}
              ref={ref}
              onItemsRendered={onItemsRendered}
            >
              {Episode}
            </List>
          )}
        </InfiniteLoader>
      </div>
    </div>
  );
}
