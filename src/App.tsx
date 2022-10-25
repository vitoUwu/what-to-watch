import { Button } from "./components/Button";
import axios from 'axios';
import { useEffect, useState } from "react";
import { GradientBorder } from "./components/GradientBorder";
import {Spinner} from 'phosphor-react';
import { GradientText } from "./components/GradientText";

interface Movie {
  adult: boolean
  backgrop_path?: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path?: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie>();
  const [error, setError] = useState<string>();
  const [page, setPage] = useState<number>(Math.floor(Math.random() * 499) + 1);
  const [isCoverLoaded, setCoverLoaded] = useState<boolean>(false);
  const [areMoviesLoaded, setMoviesLoaded] = useState<boolean>(true);
  const [genres, setGenres] = useState<{ id: number, name: string }[]>([]);

  useEffect(() => {
    axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=f1820d75f0a73c9a22f84278d6ec54fa&language=pt-BR")
      .then((res) => setGenres(res.data.genres))
      .catch((err) => {
        console.log(err)
        setError("Ocorreu um erro ao carregar os gêneros")
      })
  }, [])

  function handleClick() {
    setCoverLoaded(false)
    setMoviesLoaded(false)
    if (movies.length) {
      setSelectedMovie(movies[0])
      setMovies(movies => movies.slice(1))
      setMoviesLoaded(true)
      return
    }
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=f1820d75f0a73c9a22f84278d6ec54fa&language=pt-BR&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`)
      .then(res => {
        const results = res.data.results.filter((movie: Movie) => !!movie.overview)
        setMovies(results.slice(1))
        setSelectedMovie(results[0])
        setPage(page => page >= 1000 ? 1 : page += 1)
        setMoviesLoaded(true)
      })
      .catch(err => {
        console.log(err)
        setError("Ocorreu um erro ao carregar mais filmes.")
      });
  }

  useEffect(() => {
    if (error) alert(error)
    setError("")
  }, [error])

  return (
    <div className="w-full h-screen flex justify-start items-center text-zinc-200 flex-col">
      <header className="py-10 text-center gap-2 flex flex-col">
        <h1 className="font-bold text-3xl">What To Watch?</h1>
        <div className="flex gap-1 text-lg">
          <p>
            What To Watch é um site onde você pode descobrir novos filmes
            para assistir junto com a <span className="font-bold bg-gradient-to-r from-sky-500 to-violet-700 bg-clip-text text-transparent">família</span>
          </p>
        </div>
      </header>
      <section id='movie' className='flex flex-col justify-center items-center gap-2'>
        <Button onClick={handleClick}>
          { areMoviesLoaded ? "O que Assistir?" : <Spinner size={24} className="animate-spin"/> }
        </Button>
        { selectedMovie && 
          <div className="flex justify-center gap-4">
            <GradientBorder>
              { !isCoverLoaded && 
                <div className="w-52 h-[312px] bg-zinc-900 flex justify-center items-center">
                  <Spinner size={32} className="animate-spin"/>
                </div>
              }
              <img width='208px' height='312px' className={`${isCoverLoaded ? "block" : "hidden"} rounded`} src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`} onLoad={() => setCoverLoaded(true)}/>
            </GradientBorder>
            <div className="flex flex-col gap-2 max-w-[50%] divide-y divide-zinc-700">
              <div className="flex gap-2 items-end">  
                <h2 className='font-bold text-xl'>{selectedMovie.title}</h2>
                <h3 className='font-bold text-base text-zinc-400'>{selectedMovie.original_title}</h3>
              </div>
              <p>{selectedMovie.overview}</p>
              <div className="font-bold bg-zinc-900">
                <p>Gênero: <GradientText>{selectedMovie.genre_ids.map(id => genres.find(genre => genre.id === id)?.name).join(", ")}</GradientText></p>
                <p>Data de Lançamento: <GradientText>{new Date(selectedMovie.release_date).toLocaleDateString("pt-BR")}</GradientText></p>
              </div>
            </div>
          </div>
        }
      </section>
    </div>
  )
}