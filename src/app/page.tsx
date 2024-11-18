'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import Form from "next/form";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function Home() {

  interface Movie {
    id: string,
    title: string,
    overview: string,
    poster_path: string,
    release_date: string,
    vote_average: string,
  }

  const [topRatedMovie, setTopRatedMovie] = useState<Movie[]>([]);
  const [popularMovie, setPopularMovie] = useState<Movie[]>([]);
  const [nowPlayingMovie, setNowPlayingMovie] = useState<Movie[]>([]);
  const [upcomingMovie, setUpcomingMovie] = useState<Movie[]>([]);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchMovie = () => {
    router.push(`/search?query=${encodeURIComponent(search)}&page=1`);
  }

  const api_key : string = '43b032927de963bba17b5cee20299443';

  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0M2IwMzI5MjdkZTk2M2JiYTE3YjVjZWUyMDI5OTQ0MyIsIm5iZiI6MTczMTkwOTMzMS4zNjYzMTI1LCJzdWIiOiI2NzM0MGFmNWM5NzI3ODFiOGQ3M2I5ZGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Kspz9DKEW11tMtTa3s0wcKLYoZeE6BJg5zWQGKaYf0g',
          }
        });
        const data = response.json();
      }
      catch (error) {
        console.error(error);
      }
    }
    const topRatedMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0M2IwMzI5MjdkZTk2M2JiYTE3YjVjZWUyMDI5OTQ0MyIsIm5iZiI6MTczMTkwOTMzMS4zNjYzMTI1LCJzdWIiOiI2NzM0MGFmNWM5NzI3ODFiOGQ3M2I5ZGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Kspz9DKEW11tMtTa3s0wcKLYoZeE6BJg5zWQGKaYf0g',
          }
        });
        const data = await response.json();
        const extractedMovies = data.results.map((movie: Movie) => ({
          id: movie.id || null,
          title: movie.title || null,
          release_date: movie.release_date || null,
          poster_path: movie.poster_path || null,
        }));
        setTopRatedMovie(extractedMovies);
      }
      catch (error) {
        setError("Error while fetching data.");
      }
      finally {
        setLoading(false);
      }
    }
    const popularMovies = async () => {
      try{
        setLoading(true);
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}`);
        const data = await response.json();
        const extractedMovies = data.results.map((movie : Movie) => ({
          id: movie.id || null,
          title: movie.title || null,
          release_date: movie.release_date || null,
          poster_path: movie.poster_path || null,
        }));
        setPopularMovie(extractedMovies);
      }
      catch(error){
        setError("Error while fetching data.");
      }
      finally{
        setLoading(false);
      }
    }
    const nowPlayingMovies = async () => {
      try{
        setLoading(true);
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}`);
        const data = await response.json();
        const extractedMovies = data.results.map((movie: Movie) => ({
          id: movie.id || null,
          title: movie.title || null,
          release_date: movie.release_date || null,
          poster_path: movie.poster_path || null,
        }));
        setNowPlayingMovie(extractedMovies);
      }
      catch(error){
        setError("Error while fetching data");
      }
      finally{
        setLoading(false);
      }
    }
    const upcomingMovies = async () => {
      try{
        setLoading(true);
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}`);
        const data = await response.json();
        const extractedMovies = data.results.map((movie: Movie) => ({
          id: movie.id || null,
          title: movie.title || null,
          release_date : movie.release_date || null,
          poster_path : movie.poster_path || null,
        }));
        setUpcomingMovie(extractedMovies);
      }
      catch(error){
        setError("Error while fetching data.");
      }
      finally{
        setLoading(false);
      }
    }
    createSession();
    topRatedMovies();
    popularMovies();
    nowPlayingMovies();
    upcomingMovies();
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="h-fit">
        <div className="w-full bg-slate-700 flex justify-start gap-10 items-center pl-5 md:pl-10 md:py-10 mb-10 h-24 mx-auto">
          <div>
            <h1 className="text-white text-xl font-semibold">LK<span className="text-sky-700">6</span><span className="text-sky-600">9</span></h1>
          </div>
          <div className="flex md:items-center gap-1 md:gap-4 md:w-3/12">
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="text-black px-3 h-10 rounded-md" placeholder="Search for movies" />
            <button className="w-6/12 bg-sky-950 px-2 py-1 md:p-4 rounded-md text-white mx-auto" onClick={() => { search ? searchMovie() : '' }}>Search</button>
          </div>
        </div>
        <div className="pb-36">
          <div className="bg-slate-700 pt-5 mb-10">
            <h1 className="bg-sky-950 w-fit px-2 py-1 rounded-md text-white font-medium text-md ml-3 mb-1">Top Rated Movies</h1>
            <div className="h-px w-3/12 bg-white mt-3 ml-3"></div>
            <div className="flex gap-5 overflow-x-auto whitespace-nowrap px-4 py-5">
              {
                topRatedMovie && topRatedMovie.length > 0 && loading === false ?
                  topRatedMovie.map((movie: Movie) => (
                    <div key={movie.id} className="min-w-32 flex flex-col">
                      <div className="">
                        {movie.poster_path ? (<Image src={'https://image.tmdb.org/t/p/w1280' + movie.poster_path} width={500} height={500} alt="img" className="object-cover w-36 h-40 cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }} />) : (<p>No poster available</p>)}
                      </div>
                      <div className="w-full">
                        <h1 className="text-white w-full truncate text-center hover:underline cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }}>{movie.title}</h1>
                      </div>
                    </div>
                  ))
                  :
                  loading ? <h1 className="text-white font-medium text-xl ml-3 mt-10">Loading..</h1>
                  :
                  <p className="text-white">{error}</p>
              }
            </div>
          </div>
          <div className="bg-slate-700 pt-5 mb-10">
            <h1 className="bg-sky-950 w-fit px-2 py-1 rounded-md text-white font-medium text-md ml-3 mb-1">Popular Movies</h1>
            <div className="h-px w-3/12 bg-white mt-3 ml-3"></div>
            <div className="flex gap-5 overflow-x-auto whitespace-nowrap px-4 py-5">
              {
                popularMovie && popularMovie.length > 0 && loading === false ?
                  popularMovie.map((movie: Movie) => (
                    <div key={movie.id} className="min-w-32 flex flex-col">
                      <div className="">
                        {movie.poster_path ? (<Image src={'https://image.tmdb.org/t/p/w1280' + movie.poster_path} width={500} height={500} alt="img" className="object-cover w-36 h-40 cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }} />) : (<p>No poster available</p>)}
                      </div>
                      <div className="w-full">
                        <h1 className="text-white w-full truncate text-center hover:underline cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }}>{movie.title}</h1>
                      </div>
                    </div>
                  ))
                  :
                  loading ? <h1 className="text-white font-medium text-xl ml-3 mt-10">Loading..</h1>
                  :
                  <p className="text-white">{error}</p>
              }
            </div>
          </div>
          <div className="bg-slate-700 pt-5 mb-10">
            <h1 className="bg-sky-950 w-fit px-2 py-1 rounded-md text-white font-medium text-md ml-3 mb-1">Now Playing</h1>
            <div className="h-px w-3/12 bg-white mt-3 ml-3"></div>
            <div className="flex gap-5 overflow-x-auto whitespace-nowrap px-4 py-5">
              {
                nowPlayingMovie && nowPlayingMovie.length > 0 && loading === false ?
                  nowPlayingMovie.map((movie: Movie) => (
                    <div key={movie.id} className="min-w-32 flex flex-col">
                      <div className="">
                        {movie.poster_path ? (<Image src={'https://image.tmdb.org/t/p/w1280' + movie.poster_path} width={500} height={500} alt="img" className="object-cover w-36 h-40 cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }} />) : (<p>No poster available</p>)}
                      </div>
                      <div className="w-full">
                        <h1 className="text-white w-full truncate text-center hover:underline cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }}>{movie.title}</h1>
                      </div>
                    </div>
                  ))
                  :
                  loading ? <h1 className="text-white font-medium text-xl ml-3 mt-10">Loading..</h1>
                  :
                  <p className="text-white">{error}</p>
              }
            </div>
          </div>
          <div className="bg-slate-700 pt-5 mb-10">
            <h1 className="bg-sky-950 w-fit px-2 py-1 rounded-md text-white font-medium text-md ml-3 mb-1">Upcoming Movie</h1>
            <div className="h-px w-3/12 bg-white mt-3 ml-3"></div>
            <div className="flex gap-5 overflow-x-auto whitespace-nowrap px-4 py-5">
              {
                upcomingMovie && upcomingMovie.length > 0 && loading === false ?
                  upcomingMovie.map((movie: Movie) => (
                    <div key={movie.id} className="min-w-32 flex flex-col">
                      <div className="">
                        {movie.poster_path ? (<Image src={'https://image.tmdb.org/t/p/w1280' + movie.poster_path} width={500} height={500} alt="img" className="object-cover w-36 h-40 cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }} />) : (<p>No poster available</p>)}
                      </div>
                      <div className="w-full">
                        <h1 className="text-white w-full truncate text-center hover:underline cursor-pointer" onClick={() => { router.push(`/movie?query=${encodeURIComponent(movie.id)}`) }}>{movie.title}</h1>
                      </div>
                    </div>
                  ))
                  :
                  loading ? <h1 className="text-white font-medium text-xl ml-3 mt-10">Loading..</h1>
                  :
                  <p className="text-white">{error}</p>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}