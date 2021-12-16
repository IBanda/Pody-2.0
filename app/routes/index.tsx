import { Link, MetaFunction, useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import { client } from '~/api/client.server';
import BestPodcasts from '~/components/BestPodcasts';
import { FetchBestPodcastsPayload } from 'podcast-api';
import SearchForm from '~/components/SearchForm';

export const loader: LoaderFunction = async () => {
  const response = await client.fetchBestPodcasts({
    page: 1,
  });
  const { data } = response;
  return data;
};

export const meta: MetaFunction = () => {
  return {
    title: 'Pody',
    description: 'Best podcasts for curious minds',
  };
};

export default function Index() {
  const { podcasts } = useLoaderData<FetchBestPodcastsPayload>();
  return (
    <>
      <div className="grid md:grid-cols-2 pb-4">
        <div className="col-span-1 flex items-center text-white text-center md:text-left">
          <div>
            <h1 className="text-4xl md:text-6xl  font-bold tracking-tighter">
              Best{' '}
              <span className="gradient_text bg-gradient-to-r from-red-900 to-blue-600">
                podcasts
              </span>{' '}
              for curious minds
            </h1>
            <h2 className="mt-8">
              Our pick of the best podcasts on Spotify, Apple Podcasts
              and more covering technology, culture, science, politics
              and new ideas
            </h2>
            <SearchForm />
          </div>
        </div>
        <div className="col-span-1 md:flex  hidden justify-center overflow-hidden  ">
          <img
            className=" xl:max-w-xl transform rotate-45 md:-mr-14 xl:-mr-20"
            src="/headphone-front-gradient.png"
            alt="headphone"
          />
        </div>
      </div>
      <BestPodcasts podcasts={podcasts} />
      <div className="text-center mt-8">
        <Link
          to="/podcasts?page=2"
          className="bg-gradient-to-r from-red-900 to-blue-600 text-white px-4 py-2 rounded-full"
        >
          More Podcasts
        </Link>
      </div>
    </>
  );
}
