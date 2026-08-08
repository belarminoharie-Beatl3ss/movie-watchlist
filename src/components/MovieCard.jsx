export default function MovieCard({ title, poster, year, genre, rating, watched }) {
  // TODO: destructure props — title, poster, year, genre, rating, watched

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <img
          src={poster}
          alt={title}
          className="w-full h-80 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {title}
          {rating >= 8 && (
            <span className="badge badge-warning ml-2">Top Rated</span>
          )}
        </h2>
        <p className="text-sm opacity-70">
          {genre} • {year}
        </p>
        <p className="text-sm">
          ⭐ {rating}
        </p>
        <div className="card-actions justify-end mt-2">
          {watched ? (
            <span className="badge badge-success">Watched ✓</span>
          ) : (
            <span className="badge badge-ghost">Unwatched</span>
          )}
        </div>
      </div>
    </div>
  );
}
