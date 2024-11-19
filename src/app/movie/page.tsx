"use client"
import { useSearchParams } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface Movie {
    id: string,
    title: string,
    release_date: string,
    poster_path: string,
    overview: string,
    vote_average: number,
    production_countries: any,
}
function MovieDetailPage() {
    const params = useSearchParams();
    const query = params.get("query");

    const [movie, setMovie] = useState<Movie[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://api.themoviedb.org/3/movie/${query}?api_key=43b032927de963bba17b5cee20299443`);
                const data = await response.json();
                if (data.Response === "Too many results.") {
                    setError("Too many results.");
                }
                else if (data.Error === "Movie not found!") {
                    setError("Movie not found.");
                }
                else {
                    setMovie([data]);
                }
            }
            catch (error) {
                setError(`Error while fetching data. (${error})`);
            }
            finally {
                setLoading(true);
            }
        }
        fetchMovieDetail();
    }, [query]);

    const handleSearchMovie = () => {
        router.push(`/search?query=${encodeURIComponent(search)}&page=1`);
    }
    function Movie() {
        return (
            <>
                {
                    movie && movie.length > 0 ?
                        movie.map((mov) => (
                            <div key={mov.id} className="flex flex-col md:flex-row gap-5 justify-center items-center pt-14">
                                <div className="w-fit">
                                    {
                                        mov.poster_path === null ? <p className="text-white">Poster isn't available</p> : <Image src={'https://image.tmdb.org/t/p/w1280' + mov.poster_path} height={300} width={300} alt="img" />
                                    }
                                </div>
                                <div className="md:w-6/12 py-5 px-4 text-white rounded-md bg-slate-700">
                                    <h1 className="font-semibold mb-2 text-2xl">{mov.title}</h1>
                                    {mov.release_date === null ? <p className="text-md mb-2">Upcoming</p> : <p className="text-md mb-2">Released in : {mov.release_date}</p>}
                                    {mov.vote_average === null ? <p className="text-md mb-5">N/A</p>
                                        :
                                        <div className="flex gap-2 items-center mb-2">
                                            <FontAwesomeIcon icon={faStar} className="text-yellow-300" />
                                            <p className="text-md h-fit">Rating : {mov.vote_average.toString().slice(0, 3)}</p>
                                        </div>
                                    }
                                    <p className="text-md mb-5">Produced in : {mov.production_countries[0].name}</p>
                                    {mov.overview === null ? <p className="text-sm">N/A</p> : <p className="text-sm">{mov.overview}</p>}
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
            </>
        );
    }
    return (
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
                <Movie />
            </div>
        </>
    );
}

export default function MovieDetail(){
    return(
        <Suspense fallback={<p className="text-white">Loading...</p>}>
            <MovieDetailPage/>
        </Suspense>
    );
}