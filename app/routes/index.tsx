import { Form, MetaFunction, useLoaderData } from 'remix';
import type { LoaderFunction } from 'remix';
import { client } from '~/api/client';
import BestPodcasts from '~/components/BestPodcasts';
import { FetchBestPodcastsPayload } from 'podcast-api';

export const loader: LoaderFunction = async () => {
  const response = await client.fetchBestPodcasts();
  const { data } = response;
  return data;
};

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const data = useLoaderData<FetchBestPodcastsPayload>();
  return (
    <>
      <div className="grid md:grid-cols-2 py-8">
        <div className="col-span-1 flex items-center text-white">
          <div>
            <h1 className="text-6xl  font-bold tracking-tighter">
              Best podcasts for curious minds
            </h1>
            <h2 className="mt-8">
              Our pick of the best podcasts on Spotify, Apple Podcasts
              and more covering technology, culture, science, politics
              and new ideas
            </h2>
            <Form>
              <div className="">
                <label>
                  <input
                    className="mt-4 text-black p-4  rounded-l "
                    type="text"
                  />
                </label>
                <button className="p-4 bg-gradient-to-r from-pink-700  to-yellow-600 rounded-r">
                  Search
                </button>
              </div>
            </Form>
          </div>
        </div>
        <div className="col-span-1 flex justify-center overflow-hidden ">
          <img
            className=" xl:max-w-xl transform rotate-45 md:-mr-28 xl:-mr-44"
            src="/mic-front-premium.png"
          />
        </div>
      </div>
      <BestPodcasts podcasts={data.podcasts} />
    </>
  );
}
