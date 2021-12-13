import { Outlet, MetaFunction } from 'remix';

export const meta: MetaFunction = () => {
  return {
    title: 'Podcasts',
    description: 'Best podcasts for curious minds',
  };
};

export default function Podcast() {
  return <Outlet />;
}
