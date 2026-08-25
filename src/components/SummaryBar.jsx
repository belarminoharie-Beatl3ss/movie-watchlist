export default function SummaryBar({ movies }) {
  const total = movies.length;
  const watched = movies.filter((movie) => movie.watched).length;
  const unwatched = movies.filter((movie) => !movie.watched).length;

  return (
    <div className="flex gap-4 mb-6">
      <div className="badge badge-neutral">
        Total: {total}
      </div>

      <div className="badge badge-success">
        Watched: {watched}
      </div>

      <div className="badge badge-ghost">
        Unwatched: {unwatched}
      </div>
    </div>
  );
}
