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

  type ClientInstance = {
    fetchBestPodcasts: (
      params?: FetchBestPodcastsParams
    ) => Promise<{ data: FetchBestPodcastsPayload }>;
  };

  type client = (config: Config) => ClientInstance;
  export const Client: client;
}
