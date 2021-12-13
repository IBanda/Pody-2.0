import { useState } from 'react';
import { Form } from 'remix';

type Props = {
  value?: string;
};

export default function SearchForm({ value }: Props) {
  const [query, setQuery] = useState(value || '');
  return (
    <Form method="get" action="/search">
      <div className="">
        <label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            name="q"
            placeholder="Search podcasts"
            className="mt-4 text-black p-4  rounded-l w-52 lg:w-72 "
            type="text"
          />
        </label>
        <button
          type="submit"
          className="p-4 bg-gradient-to-r from-red-900 to-blue-600 rounded-r"
        >
          Search
        </button>
      </div>
    </Form>
  );
}
