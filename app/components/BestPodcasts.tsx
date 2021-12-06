import type { BestPodcast } from 'podcast-api';

type Props = {
  podcasts: BestPodcast[];
};

export default function BestPodcasts({ podcasts }: Props) {
  return (
    <div>
      <h2 className="text-white font-bold text-5xl tracking-tighter mb-8">
        Best Podcasts
      </h2>
      <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {podcasts.map((podcast) => (
          <li key={podcast.id}>
            <div className="  p-3 bg-gray-700 rounded-lg bg-opacity-10 shadow-lg">
              <img src={podcast.thumbnail} alt={podcast.title} />
              <h3 className="text-white mt-4 tracking-tighter lg:truncate">
                {podcast.title}
              </h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
