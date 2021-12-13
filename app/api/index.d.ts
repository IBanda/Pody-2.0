declare module 'podcast-api' {
  type Config = {
    apiKey: string | null;
  };

  type FetchBestPodcastsParams = {
    genre_id?: number;
    page?: number;
    region?: number;
    sort?:
      | 'recent_added_first'
      | 'oldest_added_first'
      | 'recent_published_first'
      | 'oldest_published_first'
      | 'listen_score';
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
    total: number;
    has_next: boolean;
    has_previous: boolean;
    page_number: number;
    previous_page_number: number;
    next_page_number: number;
  };

  type FetchPodcastByIdParams = {
    id: string;
    sort?: 'recent_first' | 'oldest_first';
    next_episode_pub_date?: number;
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
    next_episode_pub_date: number;
    latest_pub_date_ms: number;
    earliest_pub_date_ms: number;
  };

  type Genre = {
    id: number;
    name: string;
  };

  type FetchPodcastGenresPayload = {
    genres: Genre[];
  };

  type SearchParams = {
    q: string;
    type: 'episode' | 'podcast';
    offset?: number;
  };

  type SearchResult = {
    description_highlighted: string;
    title_highlighted: string;
    title_original: string;
    publisher_highlighted: string;
    image: string;
    thumbnail: string;
    id: string;
    total_episodes: number;
    explicit_content: true;
  };
  type SearchPayload = {
    count: number;
    total: number;
    results: SearchResult[];
    next_offset: number;
  };

  type ClientInstance = {
    fetchBestPodcasts: (
      params?: FetchBestPodcastsParams
    ) => Promise<{ data: FetchBestPodcastsPayload }>;
    fetchPodcastById: (
      params: FetchPodcastByIdParams
    ) => Promise<{ data: FetchPodcastByIdPayload }>;
    fetchPodcastGenres: () => Promise<{
      data: FetchPodcastGenresPayload;
    }>;
    search: (
      params: SearchParams
    ) => Promise<{ data: SearchPayload }>;
  };

  type client = (config: Config) => ClientInstance;
  export const Client: client;
}
