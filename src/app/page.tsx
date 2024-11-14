'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import Form from "next/form";
import { useRouter } from "next/navigation";

export default function Home() {
  interface UpcomingMovies {
    title: string,
    year: string,
    id: string,
    poster: string,

  };

  const [latestMovie, setLatestMovie] = useState<UpcomingMovies[]>([]);
  const [latestActionMovie, setLatestActionMovie] = useState<UpcomingMovies[]>([]);
  const [latestDramaMovie, setLatestDramaMovie] = useState<UpcomingMovies[]>([]);
  const [latestHorrorMovie, setLatestHorrorMovie] = useState<UpcomingMovies[]>([]);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchMovie = () => {
    router.push(`/search?query=${encodeURIComponent(search)}`); 
  }

  useEffect(() => {
    const latestMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://moviesdatabase.p.rapidapi.com/titles/x/upcoming', {
          headers: {
            'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com',
            'x-rapidapi-key': '72e1b9285cmsh7ffda093016cda1p1ed879jsn518e5f7b04a5'
          }
        });
        const data = await response.json();
        const extractedMovies = data.results.map((movie: any) => ({
          id: movie.id || null,
          title: movie.titleText.text || null,
          year: movie.releaseYear.year || null,
          poster: movie.primaryImage.url || null,
        }));
        setLatestMovie(extractedMovies);
      }
      catch (error) {
        setError("Error while fetching movies.");
      }
      finally{
        setLoading(false);
      }
    }
    const latestActionMovies = async () => {
      try {
        const response = await fetch('https://moviesdatabase.p.rapidapi.com/titles/x/upcoming?genre=Action&page=2', {
          headers: {
            'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com',
            'x-rapidapi-key': '72e1b9285cmsh7ffda093016cda1p1ed879jsn518e5f7b04a5'
          }
        });
        const data = await response.json();
        const extractedMovies = data.results.map((movie: any) => ({
          id: movie.id || null,
          title: movie.titleText.text || null,
          year: movie.releaseYear.year || null,
          poster: movie.primaryImage.url || null,
        }));
        setLatestActionMovie(extractedMovies);
      }
      catch (error) {
        setError("Error while fetching movies.");
      }
    }
    const latestDramaMovies = async () => {
      try {
        const response = await fetch('https://moviesdatabase.p.rapidapi.com/titles/x/upcoming?genre=Drama', {
          headers: {
            'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com',
            'x-rapidapi-key': '72e1b9285cmsh7ffda093016cda1p1ed879jsn518e5f7b04a5'
          }
        });
        const data = await response.json();
        const extractedMovies = data.results.map((movie: any) => ({
          id: movie.id || null,
          title: movie.titleText.text || null,
          year: movie.releaseYear.year || null,
          poster: movie.primaryImage.url || null,
        }));
        setLatestDramaMovie(extractedMovies);
      }
      catch (error) {
        setError(`Error while fetching movies.}`);
      }
    }
    const latestHorrorMovies = async () => {
      try {
        const response = await fetch('https://moviesdatabase.p.rapidapi.com/titles/x/upcoming?genre=Horror&page=2', {
          headers: {
            'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com',
            'x-rapidapi-key': '72e1b9285cmsh7ffda093016cda1p1ed879jsn518e5f7b04a5'
          }
        });
        const data = await response.json();
        const extractedMovies = data.results.map((movie: any) => ({
          id: movie.id || null,
          title: movie.titleText.text || null,
          year: movie.releaseYear.year || null,
          poster: movie.primaryImage?.url || null,
        }));
        setLatestHorrorMovie(extractedMovies);
      }
      catch (error) {
        setError(`Error while fetching movies. ${error}`);
      }
    }
    latestMovies();
    latestActionMovies();
    latestDramaMovies();
    latestHorrorMovies();

  }, []);
  return (
    <div className="h-fit">
      <div className="w-full bg-yellow-300 flex flex-col justify-center items-center py-10 h-24 mx-auto">
        <div className="flex gap-4 w-3/12">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="text-black px-3 rounded-md" placeholder="Search for movies"/>
          <button className="w-6/12 bg-blue-500 p-4 rounded-md text-black mx-auto" onClick={searchMovie}>Search</button>
        </div>
      </div>
      <div className="pb-36">
        <h1 className="text-black font-medium text-xl ml-3 mt-10">Upcoming movies :</h1>
        <div className="flex gap-5 overflow-x-auto whitespace-nowrap px-5 bg-yellow-300 py-5">
          { 
            latestMovie && latestMovie.length > 0 && loading === false ?
              latestMovie.map((movie: UpcomingMovies) => (
                <div key={movie.id} className="min-w-32 flex flex-col">
                  <div className="">
                    {movie.poster ? (<Image src={movie.poster} width={500} height={500} alt="img" className="object-cover w-36 h-40" />) : (<p>No poster available</p>)}
                  </div>
                  <div className="w-full">
                    <h1 className="text-black w-full truncate text-center hover:underline cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }}>{movie.title}</h1>
                  </div>
                </div>
              ))
              :
              loading ? <h1 className="text-black font-medium text-xl ml-3 mt-10">Loading..</h1> :
              <p className="text-black">{error}</p>
          }
        </div>
        <h1 className="text-black font-medium text-xl ml-3 mt-10">Upcoming Action movies :</h1>
        <div className="flex gap-5 overflow-x-auto whitespace-nowrap bg-yellow-300 py-5 px-5">
          {
            latestActionMovie && latestActionMovie.length > 0 && loading === false ?
              latestActionMovie.map((movie : UpcomingMovies) => (
                <div key={movie.id} className="min-w-32 flex flex-col">
                  {movie.poster ? <Image src={movie.poster} width={300} height={300} alt="img" className="object-cover w-36 h-40"/> : <p>Poster isn't available</p>}
                  <div className="w-full">
                    <h1 className="text-black w-full truncate text-center hover:underline cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }}>{movie.title}</h1>
                  </div>
                </div>
              ))
            : loading ? <h1 className="text-black font-medium text-xl ml-3 mt-10">Loading..</h1> :
            <p className="text-black font-medium">{error}</p>
          }
        </div>
        <h1 className="text-black font-medium text-xl ml-3 mt-10">Upcoming Drama movies :</h1>
        <div className="flex gap-5 overflow-x-auto whitespace-nowrap bg-yellow-300 py-5 px-5">
          {
            latestDramaMovie && latestDramaMovie.length > 0 && loading === false ?
              latestDramaMovie.map((movie : UpcomingMovies) => (
                <div key={movie.id} className="min-w-32 flex flex-col">
                  {movie.poster ? <Image src={movie.poster} width={300} height={300} alt="img" className="object-cover w-36 h-40"/> : <p>Poster isn't available</p>}
                  <div className="w-full">
                    <h1 className="text-black w-full truncate text-center hover:underline cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }}>{movie.title}</h1>
                  </div>
                </div>
              ))
            : loading ? <h1 className="text-black font-medium text-xl ml-3 mt-10">Loading..</h1> :
            <p className="text-black font-medium">{error}</p>
          }
        </div>
        <h1 className="text-black font-medium text-xl ml-3 mt-10">Upcoming Horror movies :</h1>
        <div className="flex gap-5 overflow-x-auto whitespace-nowrap bg-yellow-300 py-5 px-5">
          {
            latestHorrorMovie && latestHorrorMovie.length > 0 && loading === false ?
              latestHorrorMovie.map((movie : UpcomingMovies) => (
                <div key={movie.id} className="min-w-32 flex flex-col">
                  {movie.poster ? <Image src={movie.poster} width={300} height={300} alt="img" className="object-cover w-36 h-40"/> : <p>Poster isn't available</p>}
                  <div className="w-full">
                    <h1 className="text-black w-full truncate text-center hover:underline cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }}>{movie.title}</h1>
                  </div>
                </div>
              ))
            : loading ? <h1 className="text-black font-medium text-xl ml-3 mt-10">Loading..</h1> :
            <p className="text-black font-medium">{error}</p>
          }
        </div>
      </div>
    </div>
  );
}