'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import Form from "next/form";

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

  const searchMovie = async () => {
    const response = await fetch(`https://www.omdbapi.com/?s=${search}&apikey=56419db&`);
    const data = await response.json();
    if (data.Response === "True") {
      setMovies(data.Search);
      setResult("search");
    }
    else if (data.Error === "Too many results.") {
      setError("Too many results.");
    }
    else {
      setError("Movie not found.");
    }
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
      <div className="w-6/12 bg-yellow-300 flex flex-col justify-center items-center py-10 mx-auto">
        <h1 className="text-black">Search movie</h1>
        <Form action={searchMovie} className="flex flex-col gap-4 w-6/12">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="text-black px-3 rounded-md" />
          <button className="w-6/12 bg-blue-500 p-4 rounded-md text-black mx-auto">Search</button>
        </Form>
      </div>
      <div className="">
        <h1 className="text-black font-medium text-xl">Upcoming movies :</h1>
        <div className="flex gap-3 overflow-x-auto whitespace-nowrap px-5">
          {
            movies && movies.length > 0 ? (
              movies.map((movie: Movie) => (
                <div key={movie.imdbID} className=" min-w-56 mx-auto text-black flex flex-col gap-2 items-center">
                  {movie.Poster ? (
                    <Image src={movie.Poster} width={500} height={500} alt="poster" className="object-cover" />
                  ) :
                    (
                      <p>No poster available.</p>
                    )
                  }
                  <div className="w-full">
                    <h1 className="w-full truncate">{movie.Title}</h1>
                    <p className="w-fit">Released in {movie.Year}</p>
                  </div>
                </div>
              ))
            ) :
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
                (<p className="text-black">{error}</p>)
          }
        </div>
      </div>
    </div>
  );
}