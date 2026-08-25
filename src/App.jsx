import { useState, useEffect } from "react";
import Layout from "./layouts/Layout";
import MovieList from "./components/MovieList";
import initialMovies from "./data/movies";
import AddMovieForm from "./components/AddMovieForm";
import FilterBar from "./components/FilterBar";
import SummaryBar from "./components/SummaryBar";
import { searchMovies, toWatchlistMovie } from "./api/tmdb";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";

export default function App() {

  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem("movies");

    return saved ? JSON.parse(saved) : initialMovies;
  });

  const [filter, setFilter] = useState(() => {
  return localStorage.getItem("filter") || "all";
  });

    const [results, setResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


  useEffect(() => {
  localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
  document.title = `Movie Watchlist (${movies.length})`;
  }, [movies.length]);

  useEffect(() => {
  localStorage.setItem("filter", filter);
  }, [filter]);

  useEffect(() => {
  if (!searchTerm) return;

  let isCancelled = false;

  const fetchResults = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const movies = await searchMovies(searchTerm);

      if (!isCancelled) {
        setResults(movies);
      }
    } catch (err) {
      if (!isCancelled) {
        setError("Failed to fetch movies. Try again.");
      }
    } finally {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }
  };

  fetchResults();

  return () => {
    isCancelled = true;
  };
  }, [searchTerm]);


  const handleToggleWatched = (id) => {
    setMovies((movies) =>
      movies.map((movie) =>
        movie.id === id
          ? { ...movie, watched: !movie.watched }
          : movie
      )
    );
  };

  const handleAddMovie = (newMovie) => {
    setMovies([...movies, newMovie]);
  };

  const handleAddFromSearch = (tmdbMovie) => {
  if (movies.some((m) => m.id === tmdbMovie.id)) return;

  const watchlistMovie = toWatchlistMovie(tmdbMovie);

  setMovies([...movies, watchlistMovie]);
  };


  const handleClearAll = () => {
  if (confirm("Clear your entire watchlist? This cannot be undone.")) {
    setMovies([]);
  }
  };

  const visibleMovies = movies.filter((movie) => {
    if (filter === "watched") return movie.watched;
    if (filter === "unwatched") return !movie.watched;
    return true;
  });

  return (
  <Layout>

    {/* TMDB Search */}
    <SearchBar onSearch={setSearchTerm} />

    <SearchResults
      results={results}
      onAdd={handleAddFromSearch}
      isLoading={isLoading}
      error={error}
    />

    <hr className="my-6" />

    {/* Existing Watchlist */}
    <div className="flex items-center gap-4 mb-6">
      <SummaryBar movies={movies} />

      <button
        className="btn btn-error btn-sm"
        onClick={handleClearAll}
      >
        Clear All
      </button>
    </div>

    <div className="mb-6">
      <h1 className="text-3xl font-bold">My Watchlist</h1>
      <p className="opacity-70">
        A collection of movies I've watched and want to watch.
      </p>
    </div>

    <AddMovieForm onAddMovie={handleAddMovie} />

    <FilterBar
      currentFilter={filter}
      onChangeFilter={setFilter}
    />

    <MovieList
      movies={visibleMovies}
      onToggleWatched={handleToggleWatched}
    />

  </Layout>
);


}
