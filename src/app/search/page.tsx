'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Router, { useRouter, useSearchParams } from 'next/navigation';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
}

export default function MovieSearch() {
  const [error, setError] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");

  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("query"); // fetch the keyword from the URL parameter

  const handleSearchMovie = () => {
    router.push(`/search?query=${encodeURIComponent(search)}`); 
    console.log(query);
  }

  useEffect( () => {
    const searchMovie = async () => {
      setMovies([]);
      setError("");
      let page = 1;
      const fetchedMovies = [];
      while (true) {
        try {
          const response = await fetch(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=56419db&`); // fetch movies data
          const data = await response.json(); // assign movies data

          if (data.Error === "Too many results.") { // If too many results fetched
            setError("Too many results.");
            break;
          }
          else if (data.Result === "Movie not found!") { // If movie's not found
            setError("Movie not found.");
            break;
          }
          fetchedMovies.push(...data.Search); // Inserting all movies data
          if (data.Search.length < 10) { // If movies data is below 10, then stop the search
            console.log("last page");
            break;
          }
          if(fetchedMovies.length === 100){
            console.log(data.Search.length)
            break;
          }
          page++
        }
        catch (error) {
          setError("Error while fetching movies.")
          break;
        }
      }
      setMovies(fetchedMovies);
    }
    searchMovie();
  }, [query]);

  const [currentPage, setCurrentPage] = useState(1); // tracks which page is user on
  const itemsPerPage = 10; // set how many items should be displayed in 1 page

  const totalPages = Math.ceil(movies.length / itemsPerPage); // math ceil is to round the number of total pages

  // Get current movies based on the page
  const currentMovies = movies.slice(
    (currentPage - 1) * itemsPerPage, // tracks which items should be displayed first, example : if the currentPage is 2 then subtracted by 1 and then multiplied by itemsPerPage which is 10 the first item would be index 10
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) { // if it is more/equal to 1 and is below/equal with totalPages
      setCurrentPage(page);
    }
  };

  return (
    <div>
        <div className="w-full bg-yellow-300 flex flex-col justify-center items-center py-10 mb-10 h-24 mx-auto">
          <div className="flex gap-4 w-3/12">
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="text-black px-3 rounded-md" placeholder="Search for movies"/>
            <button className="w-6/12 bg-blue-500 p-4 rounded-md text-black mx-auto" onClick={handleSearchMovie}>Search</button>
          </div>
        </div>
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