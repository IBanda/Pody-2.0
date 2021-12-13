import { motion } from 'framer-motion';
import type { SearchPayload } from 'podcast-api';
import {
  Link,
  LoaderFunction,
  useLoaderData,
  MetaFunction,
} from 'remix';
import { client } from '~/api/client.server';
import SearchForm from '~/components/SearchForm';
import { container, item } from '../../utils/transitionSettings';
import useFilter from '../../utils/useFilter';

type EnhancedSearchPayload = SearchPayload & {
  no_query: boolean;
  query: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const params = Object.fromEntries(url.searchParams.entries());

  if (!params.q) {
    return {
      no_query: true,
      count: 0,
      total: 0,
      results: [],
      next_offset: 0,
    };
  }

  // invariant(params.q, 'A query string is required');
  const response = await client.search({
    q: params.q,
    type: 'podcast',
    ...(params.offset ? { offset: Number(params.offset) } : null),
  });

  const { data } = response;

  return { ...data, no_query: false, query: params.q };
};

export const meta: MetaFunction = ({ data }) => {
  const suffix = 'Pody Search';
  return {
    title: data.no_query ? suffix : `${data.query} - ${suffix}`,
  };
};

export default function Search() {
  const { total, results, no_query, query } =
    useLoaderData<EnhancedSearchPayload>();

  const filter = useFilter();

  // The free plan only allows a maximum of 30 results
  // Hence we paginate only for 30 results in batches of 10
  const pages = total > 20 ? 3 : total > 10 && total < 20 ? 2 : 1;

  return (
    <div className="text-white">
      <SearchForm value={query} />
      <div className="mt-8">
        {total === 0 || no_query ? (
          <>
            <h2 className="text-2xl font-bold tracking-tighter">
              Opps !! No podcasts match your search
            </h2>
            <h3 className="text-sm tracking-tighter">
              Please try again
            </h3>
          </>
        ) : (
          <>
            <motion.ul variants={container}>
              {results.map((result) => (
                <motion.li
                  className="mb-6"
                  key={result.id}
                  variants={item}
                >
                  <motion.div>
                    <div>
                      <img
                        className="w-16 h-16 float-left mr-1 "
                        src={result.thumbnail}
                        alt={result.title_original}
                      />
                      <Link to={`/podcasts/${result.id}`}>
                        <div
                          className="mb-2"
                          dangerouslySetInnerHTML={{
                            __html: result.title_highlighted,
                          }}
                        />
                      </Link>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: result.description_highlighted,
                        }}
                      />
                    </div>
                    {result.explicit_content && (
                      <div className="text-xs text-red-600">
                        Explicit Content
                      </div>
                    )}
                    {!!result.publisher_highlighted && (
                      <div className="my-2 text-xs">
                        Publisher:{' '}
                        <div
                          className="inline-block"
                          dangerouslySetInnerHTML={{
                            __html: result.publisher_highlighted,
                          }}
                        />
                      </div>
                    )}
                    {!!result.total_episodes && (
                      <div className="text-xs">
                        Total Episodes: {result.total_episodes}
                      </div>
                    )}
                  </motion.div>
                </motion.li>
              ))}
            </motion.ul>
            <ul className="flex mt-8 gap-3">
              {!(pages === 1) &&
                total > 0 &&
                Array(pages)
                  .fill(0)
                  .map((page, index) => (
                    <li key={index}>
                      <button
                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-blue-500 text-white font-medium rounded-md"
                        onClick={() => filter('offset', index * 10)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
