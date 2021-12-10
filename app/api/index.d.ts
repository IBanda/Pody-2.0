declare module 'podcast-api' {
  type Config = {
    apiKey: string | null;
  };

  type FetchBestPodcastsParams = {
    page?: number;
    region?: number;
    sort?: string;
    safe_mode?: 1 | 0;
  };

  type BestPodcast = {
    id: string;
    image: string;
    title: string;
    thumbnail: string;
    description: string;
  };

  type FetchBestPodcastsPayload = {
    id: string;
    name: string;
    podcasts: BestPodcast[];
  };

  type FetchPodcastByIdParams = {
    id: string;
  };

  type Episode = {
    id: string;
    link: string;
    audio: string;
    image: string;
    title: string;
    thumbnail: string;
    description: string;
    audio_length_sec: number;
  };

  type FetchPodcastByIdPayload = {
    id: string;
    image: string;
    description: string;
    thumbnail: string;
    title: string;
    publisher: string;
    episodes: Episode[];
  };

  type ClientInstance = {
    fetchBestPodcasts: (
      params?: FetchBestPodcastsParams
    ) => Promise<{ data: FetchBestPodcastsPayload }>;
    fetchPodcastById: (
      params: FetchPodcastByIdParams
    ) => Promise<{ data: FetchPodcastByIdPayload }>;
  };

  type client = (config: Config) => ClientInstance;
  export const Client: client;
}
