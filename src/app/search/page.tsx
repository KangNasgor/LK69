'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Router, { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Movie {
  id: string,
  title: string,
  overview: string,
  poster_path: string,
  release_date: string,
  vote_average: string,
}

export default function MovieSearch() {
  const [error, setError] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");

  const router = useRouter();
  const params = useSearchParams();

  // fetch the keyword from the URL parameter
  const query = params.get("query");
  const page = params.get("page") || "1"; // get parameter from url

  const [currentPage, setCurrentPage] = useState(parseInt(page, 10)); 

  const [loading, setLoading] = useState(false);

  const api_key : string = '43b032927de963bba17b5cee20299443';

  const handleSearchMovie = () => {
    router.push(`/search?query=${encodeURIComponent(search)}&page=1`);
  }
  useEffect(() => {
    const searchMovie = async () => {
      setMovies([]);
      setError("");
      let page : number = 1;
      setLoading(true);
      try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=Transformers&api_key=43b032927de963bba17b5cee20299443`); // fetch movies data
        const data = await response.json(); // assign movies data
        const extractedMovies = data.results.map((movie: Movie) => ({
          id: movie.id || null,
          title: movie.title || null,
          release_date : movie.release_date || null,
          poster_path : movie.poster_path || null,
        }));
        setMovies(extractedMovies);
      }
      catch(error){
        setError("Error");
      }
      setLoading(false);
    }
    searchMovie();
  }, [query]);
  const itemsPerPage = 10; // set how many items should be displayed in 1 page

  const totalPages = Math.ceil(movies.length / itemsPerPage); // math ceil is to round the number of total pages

  // Get current movies based on the page
  const currentMovies = movies.slice(
    (currentPage - 1) * itemsPerPage, // tracks which items should be displayed first, example : if the currentPage is 2 then subtracted by 1 and then multiplied by itemsPerPage which is 10 the first item would be index 10
    currentPage * itemsPerPage
  );

  const updatePage = (newPage : any) => {
    let updatedPage; // to keep track of the page
    if (newPage === totalPages + 1) {
      updatedPage = 1;
    }
    else if (newPage === 0) { 
      updatedPage = totalPages;
    }
    else {
      updatedPage = newPage; // execute function normally
    }
    setCurrentPage(updatedPage);
    router.push(`/search?query=${query}&${new URLSearchParams({ page: updatedPage.toString() }).toString()}`); // router pushing so that parameter page inside the url also change
  }

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
              <div key={movie.id} className="w-10/12 mx-auto">
                <div className="text-black flex gap-2 items-start">
                  {
                    movie.poster_path === null ? <p className='text-white'>No poster available.</p> : <Image src={`https://image.tmdb.org/t/p/w1280/${movie.poster_path}`} width={120} height={120} alt="poster" className="object-cover cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }}/>
                  }
                  <div className="w-full">
                    <h1 className="w-full text-white cursor-pointer hover:underline hover:decoration-solid" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }}>
                      {movie.title}
                    </h1>
                    {movie.release_date === null ? <p className="text-white text-md mb-5">Upcoming</p> : <p className="text-white text-md mb-5">Released in : {movie.release_date}</p>}
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
              <button onClick={() => updatePage(currentPage - 1)}>
                Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => updatePage(currentPage + 1)}>
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
