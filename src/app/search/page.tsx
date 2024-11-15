'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Router, { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

  const [loading, setLoading] = useState(false);

  const handleSearchMovie = () => {
    router.push(`/search?query=${encodeURIComponent(search)}`);
  }
  useEffect(() => {
    const searchMovie = async () => {
      setMovies([]);
      setError("");
      let page = 1;
      const fetchedMovies = [];
      while (true) {
        setLoading(true);
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
            break;
          }
          if (fetchedMovies.length === 100) {
            break;
          }
          page++
        }
        catch (error) {
          setError("Error while fetching movies.")
          break;
        }
      }
      setLoading(false);
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

  const handlePageChange = (page: number) => {
    if (page === totalPages + 1) {
      setCurrentPage(1);
    }
    else if (page === 0) {
      setCurrentPage(totalPages);
    }
    else {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="w-full bg-slate-700 flex justify-start items-center pl-5 md:pl-10 md:py-10 mb-10 gap-10 h-24 mx-auto">
        <Link href={"/"}>
          <h1 className="text-white text-xl font-semibold">LK<span className="text-sky-700">6</span><span className="text-sky-600">9</span></h1>
        </Link>
        <div className="flex md:items-center gap-1 md:gap-4 md:w-3/12">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="text-black px-3 md:py-4 rounded-md" placeholder="Search for movies" />
          <button className="w-6/12 bg-sky-950 px-2 py-1 md:p-4 rounded-md text-white mx-auto" onClick={handleSearchMovie}>Search</button>
        </div>
      </div>
      <div className='pb-36'>
        {
          currentMovies && currentMovies.length > 0 ? (
            currentMovies.map((movie: Movie) => (
              <div key={movie.imdbID} className="w-10/12 mx-auto">
                <div className="text-black flex gap-2 items-start">
                  {
                    movie.Poster === "N/A" ? <p className='text-white'>No poster available.</p> : <Image src={movie.Poster} width={120} height={120} alt="poster" className="object-cover cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.imdbID)}`) }}/>
                  }
                  <div className="w-full">
                    <h1 className="w-full text-white cursor-pointer hover:underline hover:decoration-solid" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.imdbID)}`) }}>
                      {movie.Title}
                    </h1>
                    <p className="w-fit text-white">Released in {movie.Year}</p>
                  </div>
                </div>
                <div className="h-px w-9/12 bg-white my-5 opacity-50"></div>
              </div>
            ))
          )
            :
            loading ?
              <div className='w-10/12 mx-auto'>
                <h1 className="text-white font-medium text-xl ml-3 mt-10">Loading..</h1>
              </div>
              :
              (<p className="text-white">{error}</p>)
        }
        {
          currentMovies && currentMovies.length > 0 ?
            <div className="text-white flex gap-5 w-10/12 mx-auto">
              <button onClick={() => handlePageChange(currentPage - 1)}>
                Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            </div>
            :
            null
        }
      </div>
    </div >
  );
}
