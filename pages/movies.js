// /pages/movies.js
import { useState } from 'react';
import MovieList from '../components/MovieList';
import MovieForm from '../components/MovieForm';

export default function Movies() {
    const [isAddingNewMovie, setIsAddingNewMovie] = useState(false); 
    const [movieID, setMovieID] = useState(""); 
  
    const refreshMovies = () => {
      setIsAddingNewMovie(false);
      setMovieID(""); 
    };
  
    return (
      <div style={{ backgroundColor: "#093545",}}>
        {isAddingNewMovie || movieID ? (  
          <MovieForm onSave={refreshMovies} movieID={movieID} />
        ) : (  
          <MovieList onAddNewMovie={() => setIsAddingNewMovie(true)} onUpdateCurrentMovie={(movieId) => setMovieID(movieId)} />
        )}
      </div>
    );
  }
