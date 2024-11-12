'use client'
import { useState } from "react";
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

  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const searchMovie = async (event: any) => {

    const response = await fetch(`https://www.omdbapi.com/?s=${search}&plot=full&apikey=56419db&`);
    const data: any = await response.json();
    if (data.Response === "True") {
      setMovies(data.Search);
    }
    else {
      setError("Movie not found");
    }
    console.log("Berhasil");
  }
  return (
    <div className="h-screen">
      <div className="w-6/12 bg-yellow-300 flex justify-center items-center py-10 mx-auto">
        <Form action={searchMovie} className="flex flex-col gap-4 w-6/12">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="text-black px-3 rounded-md" />
          <button className="bg-blue-500 p-4 rounded-md">Submit</button>
        </Form>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {
          movies && movies.length > 0 ? (
            movies.map((movie: Movie) => (
              <div key={movie.imdbID} className="w-8/12 mx-auto">
                {movie.Poster ? (
                  <img src={movie.Poster} />
                ) :
                  (
                    <p>No poster avalailable.</p>
                  )
                }
                <div>
                  <h1>{movie.Title}</h1>
                  <p>Released in {movie.Year}</p>
                </div>
              </div>
            ))
          ) :
            (<p>{error}</p>)
        }
      </div>
    </div>
  );
}