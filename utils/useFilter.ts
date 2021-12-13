import { useLocation, useNavigate } from 'remix';

export default function useFilter() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  function filter(param: string, value: number | string) {
    if (params.get(param) == value) return;
    params.set(param, String(value));
    navigate(`${location.pathname}?${params.toString()}`);
  }

  return filter;
}
