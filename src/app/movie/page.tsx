"use client"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Plot: string;
  }
export default function MovieDetail(){
    const params = useSearchParams();
    const query = params.get("query");

    const [movie, setMovie] = useState<Movie[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchMovieDetail = async () =>{
            try{
                setLoading(true);
                const response = await fetch(`https://www.omdbapi.com/?i=${query}&plot=full&apikey=56419db&`);
                const data = await response.json();
                if(data.Response === "Too many results."){
                    setError("Too many results.");
                }
                else if(data.Error === "Movie not found!"){
                    setError("Movie not found.");
                }
                else{
                    setMovie([data]);
                }
            }
            catch (error){
                setError("Error while fetching data.");
            }
            finally{
                setLoading(true);
            }
        }
        fetchMovieDetail();
    },[query]);

    const handleSearchMovie = () => {
        router.push(`/search?query=${encodeURIComponent(search)}&page=1`);
      }

    return(
        <>
            <div className="w-full bg-slate-700 flex justify-start items-center pl-5 md:pl-10 md:py-10 mb-10 gap-10 h-24 mx-auto">
                <Link href={"/"}>
                <h1 className="text-white text-xl font-semibold">LK<span className="text-sky-700">6</span><span className="text-sky-600">9</span></h1>
                </Link>
                <div className="flex md:items-center gap-1 md:gap-4 md:w-3/12">
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="text-black px-3 md:py-4 rounded-md" placeholder="Search for movies" />
                <button className="w-6/12 bg-sky-950 px-2 py-1 md:p-4 rounded-md text-white mx-auto" onClick={handleSearchMovie}>Search</button>
                </div>
            </div>
            <div className="text-black pb-36 w-10/12 mx-auto">
                {
                    movie && movie.length > 0 ?
                    movie.map((mov) => (
                        <div key={mov.imdbID} className="flex flex-col md:flex-row gap-5 justify-center items-center pt-14">
                            <div className="w-fit">
                                {
                                    mov.Poster === "N/A" ? <p className="text-white">Poster isn't available</p> : <Image src={mov.Poster} height={300} width={300} alt="img"/>
                                }
                            </div>
                            <div className="md:w-6/12 py-5 px-4 text-white rounded-md bg-slate-700">
                                <h1 className="font-semibold mb-2 text-2xl">{mov.Title}</h1>
                                <p className="text-md mb-5">Released in : {mov.Year}</p>
                                {mov.Plot === "N/A" ? <p className="text-sm">N/A</p> : <p className="text-sm">{mov.Plot}</p>}
                            </div>
                        </div>
                    ))
                    :
                    loading ? 
                    <div className='w-10/12 mx-auto'>
                        <h1 className="text-white font-medium text-xl ml-3 mt-10">Loading..</h1>
                    </div>
                    :
                    <p>{error}</p>
                }
            </div>
        </>
    );
}