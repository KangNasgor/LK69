'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
}

export default function MoviePagination({ movies }: { movies: Movie[] }, error: String) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(movies.length / itemsPerPage); // math ceil to round the number

  // Get current movies based on the page
  const currentMovies = movies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {
        error ? (<p className="text-black">{error}</p>)
          :
          currentMovies && currentMovies.length > 0 ? (
            currentMovies.map((movie: Movie) => (
              <div key={movie.imdbID} className="w-10/12 mx-auto">
                <div className="text-black flex gap-2 items-start">
                  {
                    movie.Poster === "N/A" ? <p>No poster available.</p> : <Image src={movie.Poster} width={120} height={120} alt="poster" className="object-cover" />
                  }
                  <div className="w-full">
                    <h1 className="w-full truncate">{movie.Title}</h1>
                    <p className="w-fit">Released in {movie.Year}</p>
                  </div>
                </div>
                <div className="h-px w-9/12 bg-black my-5 opacity-50"></div>
              </div>
            ))
          ) : (<p className="text-black">{error}</p>)
      }
      <div className="pagination-controls text-black flex gap-5 w-10/12 mx-auto">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div >
  );
}
