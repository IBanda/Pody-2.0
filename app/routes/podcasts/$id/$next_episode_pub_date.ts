import type { LoaderFunction } from 'remix';
import invariant from 'tiny-invariant';
import { client } from '~/api/client.server';

export const loader: LoaderFunction = async ({ params }) => {
  const { id, next_episode_pub_date } = params;

  invariant(id, 'ID is required');
  invariant(
    next_episode_pub_date,
    'next_episode_pub_date is required'
  );

  const response = await client.fetchPodcastById({
    id,
    next_episode_pub_date: +next_episode_pub_date,
    sort: 'oldest_first',
  });
  const { data } = response;
  return data;
};
