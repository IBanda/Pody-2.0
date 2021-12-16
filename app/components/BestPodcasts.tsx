import type { BestPodcast } from 'podcast-api';
import PodcastList from './PodcastList';

type Props = {
  podcasts: BestPodcast[];
};

export default function BestPodcasts({ podcasts }: Props) {
  return (
    <section className="mt-8">
      <div className="flex items-center">
        <h2 className="text-white font-bold text-3xl md:text-5xl tracking-tighter mb-8">
          Best Podcasts
        </h2>
        <img
          className="w-14 -mt-4 transform rotate-45"
          src="/trophy-front-gradient.png"
          alt="trophy"
          width={80}
          height={80}
        />
      </div>
      <PodcastList podcasts={podcasts} />
    </section>
  );
}
