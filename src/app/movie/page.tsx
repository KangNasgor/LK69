"use client"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";


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

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovieDetail = async () =>{
            try{
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
        }
        fetchMovieDetail();
    },[query]);
    return(
        <div className="text-black w-10/12 mx-auto">
            {
                movie && movie.length > 0 ?
                movie.map((mov) => (
                    <div key={mov.imdbID} className="flex gap-5 justify-center items-center pt-14">
                        <div className="w-fit">
                            <Image src={mov.Poster} height={300} width={300} alt="img"/>
                        </div>
                        <div className="w-6/12 py-5 px-4 rounded-md bg-yellow-300">
                            <h1 className="font-semibold mb-2 text-2xl">{mov.Title}</h1>
                            <p className="text-md mb-5">Released in : {mov.Year}</p>
                            <p className="text-sm">{mov.Plot}</p>
                        </div>
                    </div>
                ))
                :
                <p>{error}</p>
            }
        </div>
    );
}