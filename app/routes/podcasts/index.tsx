import {
  FetchBestPodcastsPayload,
  FetchPodcastGenresPayload,
} from 'podcast-api';
import { useState } from 'react';
import { LoaderFunction, useLoaderData } from 'remix';
import { client } from '~/api/client.server';
import Genres from '~/components/Genres';
import PodcastList from '~/components/PodcastList';
import useFilter from '../../../utils/useFilter';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const response = await Promise.all([
    client.fetchBestPodcasts({
      ...(Object.keys(params).length ? params : null),
    }),
    ...(params.no_fetch_genre ? [] : [client.fetchPodcastGenres()]),
  ]);

  const { data: podcasts } = response[0];
  const { data: genres } = response[1];
  return {
    podcasts,
    genres,
  };
};

const PODCAST_LIMIT = 20;

export default function Index() {
  const {
    podcasts: { podcasts, page_number, total },
    genres,
  } = useLoaderData<{
    podcasts: FetchBestPodcastsPayload;
    genres: FetchPodcastGenresPayload;
  }>();
  const [fetchedGenres] = useState(genres);

  const pages = createPages(Math.floor(total / PODCAST_LIMIT));

  const filter = useFilter();

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <Genres genres={fetchedGenres.genres} />
      </div>
      <div className="col-span-3">
        <PodcastList podcasts={podcasts} />
        <ul className="flex mt-8 gap-3">
          {pages.length > 1 &&
            pages
              .filter((page) => Math.abs(page_number - page) <= 2)
              .map((page) => (
                <li key={page}>
                  <button
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-blue-500 text-white font-medium rounded-md"
                    onClick={() => filter('page', page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}

function createPages(totalPages: number) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return pages;
}
