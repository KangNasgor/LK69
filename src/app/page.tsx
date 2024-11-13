'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import Form from "next/form";
import MoviePagination from "./search/search";

export default function Home() {
  interface Movie {
    Title: string,
    Year: string,
    imdbID: string,
    Poster: string,
    Plot: string,
  };

  interface UpcomingMovies {
    title: string,
    year: string,
    id: string,
    poster: string,

  };
  const [latestMovie, setLatestMovie] = useState<UpcomingMovies[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("upcoming");
  const [loading, setLoading] = useState(false);

  const searchMovie = async () => {
    setMovies([]);
    setError("");
    const fetchedMovies = [];
    let page = 1;
    setLoading(true);

    while (true) {
      try {
        const response = await fetch(`https://www.omdbapi.com/?s=${search}&page=${page}&apikey=56419db&`);
        const data = await response.json();

        if (data.Error === "Too many results.") {
          setError("Too many results.");
          break;
        }
        else if(data.Result === "Movie not found!") {
          setError("Movie not found.");
          break;  
        }
        fetchedMovies.push(...data.Search);
        if (data.Search.length < 10){
          break;
        }
        page++
      }
      catch(error){
        setError("Error while fetching movies.")
        break;
      }
      finally{
        setLoading(false);
      }
    }
    setMovies(fetchedMovies);
    setResult("search");
  }

  useEffect(() => {
    const latestMovies = async () => {
      try {
        const response = await fetch('https://moviesdatabase.p.rapidapi.com/titles/x/upcoming', {
          headers: {
            'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com',
            'x-rapidapi-key': '72e1b9285cmsh7ffda093016cda1p1ed879jsn518e5f7b04a5'
          }
        });
        const data = await response.json();
        const extractedMovies = data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.titleText.text,
          year: movie.releaseYear.year,
          poster: movie.primaryImage.url,
        }));
        setLatestMovie(extractedMovies);
        setResult("upcoming");
      }
      catch (error) {
        console.error(error);
      }
    }
    latestMovies();
  }, []);
  return (
    <div className="h-fit">
      <div className="w-full bg-yellow-300 flex flex-col justify-center items-center py-10 h-24 mx-auto">
        <Form action={searchMovie} className="flex gap-4 w-3/12">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="text-black px-3 rounded-md" placeholder="Search for movies"/>
          <button className="w-6/12 bg-blue-500 p-4 rounded-md text-black mx-auto">Search</button>
        </Form>
      </div>
      <div style={{ display: result === "search" ? "block" : "none" }}>
        <h1 className="text-black font-medium text-xl mb-5">Search Result :</h1>
        <div className="flex gap-5 flex-col pb-36">
          <MoviePagination movies={movies}/>
        </div>
      </div>
      <div style={{ display: result === "upcoming" ? "block" : "none" }} className="pb-36">
        <h1 className="text-black font-medium text-xl mb-5">Upcoming movies :</h1>
        <div className="flex gap-3 overflow-x-auto whitespace-nowrap px-5">
          { 
            error ?
            <p className="text-black">{error}</p>
            :
            latestMovie && latestMovie.length > 0 ?
              latestMovie.map((movie: UpcomingMovies) => (
                <div key={movie.id} className="min-w-56 flex flex-col">
                  <div className="">
                    {movie.poster ? (<Image src={movie.poster} width={500} height={500} alt="img" className="object-cover" />) : (<p>No poster available</p>)}
                  </div>
                  <div className="w-full">
                    <h1 className="text-black w-full truncate">{movie.title}</h1>
                  </div>
                </div>
              ))
              :
              <p className="text-black">{error}</p>
          }
        </div>
      </div>
    </div>
  );
}