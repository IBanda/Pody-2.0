import { ChangeEvent, useState } from 'react';
import { useLocation } from 'remix';
import { InputLabel, NativeSelect } from '@mui/material';
import { Genre } from 'podcast-api';
import useFilter from '../../utils/useFilter';

type Props = {
  genres: Genre[];
};

export default function Genres({ genres }: Props) {
  const location = useLocation();
  const genreID =
    new URLSearchParams(location.search).get('genre_id') ?? '';
  const [genre, setGenre] = useState(genreID);
  const filter = useFilter();

  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setGenre(e.target.value);
    filter('genre_id', e.target.value);
  };

  return (
    <div>
      <InputLabel
        sx={{ color: '#fff', marginBottom: 1, fontSize: 14 }}
        variant="standard"
        htmlFor="uncontrolled-native"
      >
        Genres
      </InputLabel>
      <NativeSelect
        disableUnderline
        value={genre}
        IconComponent={() => (
          <span className="text-xs">&#x25BC;</span>
        )}
        onChange={onSelect}
        variant="filled"
        inputProps={{
          name: 'genres',
          id: 'genres',
        }}
        sx={{
          bgcolor: '#292a2c',
          color: '#fff',
          borderRadius: 1,
          padding: 1,
          width: '100%',
        }}
      >
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}
