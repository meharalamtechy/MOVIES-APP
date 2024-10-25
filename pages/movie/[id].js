// /pages/movie/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MovieForm from '../../components/MovieForm';
import axios from 'axios';

export default function EditMovie() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchMovie = async () => {
        const response = await axios.get(`/api/movies/${id}`);
        setMovie(response.data.data);
      };
      fetchMovie();
    }
  }, [id]);

  return (
    <div>
      {movie && <MovieForm movie={movie} onSave={() => router.push('/movies')} />}
    </div>
  );
}
