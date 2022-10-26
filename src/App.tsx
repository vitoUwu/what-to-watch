import { Button } from "./components/Button";
import axios from 'axios';
import { useEffect, useReducer, useState } from "react";
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

interface PageState {
  error: string
  isCoverLoaded: boolean
  areMoviesLoaded: boolean
}

export function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie>();
  const [page, setPage] = useState<number>(Math.floor(Math.random() * 499) + 1);
  const [genres, setGenres] = useState<{ id: number, name: string }[]>([]);
  const [states, setStates] = useReducer(
    (oldState: PageState, newState: Partial<PageState>) => {
      return {
        ...oldState,
        ...newState
      }
    },
    {
      error: "",
      isCoverLoaded: false,
      areMoviesLoaded: true
    },
  )

  useEffect(() => {
    axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=f1820d75f0a73c9a22f84278d6ec54fa&language=pt-BR")
      .then((res) => setGenres(res.data.genres))
      .catch((err) => {
        console.log(err)
        setStates({ error: "Ocorreu um erro ao carregar os gêneros" })
      })
  }, [])

  function handleClick() {
    setStates({ isCoverLoaded: false, areMoviesLoaded: false });
    if (movies.length) {
      setSelectedMovie(movies[0])
      setMovies(movies => movies.slice(1))
      setStates({ areMoviesLoaded: true })
      return
    }
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=f1820d75f0a73c9a22f84278d6ec54fa&language=pt-BR&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`)
      .then(res => {
        const results = res.data.results.filter((movie: Movie) => !!movie.overview)
        setMovies(results.slice(1))
        setSelectedMovie(results[0])
        setPage(page => page >= 1000 ? 1 : page += 1)
        setStates({ areMoviesLoaded: true })
      })
      .catch(err => {
        console.log(err)
        setStates({ error: "Ocorreu um erro ao carregar os gêneros" })
      });
  }

  useEffect(() => {
    if (states.error) alert(states.error)
    setStates({ error: "" })
  }, [states.error])

  return (
    <main className="w-full flex justify-start items-center text-zinc-200 flex-col px-10">
      <header className="py-10 text-center gap-2 flex flex-col">
        <h1 className="font-bold text-3xl">What To Watch?</h1>
        <div className="text-lg">
          <p className="inline-block">
            What To Watch é um site onde você pode descobrir novos filmes para
            assistir junto com a <GradientText className="font-bold">família</GradientText>,
            com os <GradientText className="font-bold">amigos</GradientText> ou com
            aquela <GradientText className="font-bold">pessoa especial</GradientText>
          </p>
        </div>
      </header>
      <section id='movie' className='flex flex-col justify-center items-center gap-2 h-full'>
        <div className="mb-4 md:mb-0">  
          <Button onClick={handleClick}>
            { states.areMoviesLoaded ? "O que Assistir?" : <Spinner size={24} className="animate-spin"/> }
          </Button>
        </div>
        { selectedMovie && 
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
            <div className="flex justify-center">
              <GradientBorder>
                { !states.isCoverLoaded && 
                  <div className="w-52 h-[312px] bg-zinc-900 flex justify-center items-center rounded">
                    <Spinner size={32} className="animate-spin"/>
                  </div>
                }
                <img width='208px' height='312px' className={`${states.isCoverLoaded ? "block" : "hidden"} rounded`} src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`} onLoad={() => setStates({ isCoverLoaded: true })}/>
              </GradientBorder>
            </div>
            <div className="flex flex-col gap-2 md:max-w-[50%] divide-y divide-zinc-700">
              <div className="flex flex-col items-start md:gap-2 md:flex-row md:items-end">  
                <h2 className='font-bold text-xl'>{selectedMovie.title}</h2>
                <h3 className='font-bold text-base text-zinc-400'>{selectedMovie.original_title}</h3>
              </div>
              <p className="text-zinc-300">{selectedMovie.overview}</p>
              <div className="font-bold bg-zinc-900">
                <p>Gênero: <GradientText>{selectedMovie.genre_ids.map(id => genres.find(genre => genre.id === id)?.name).join(", ")}</GradientText></p>
                <p>Data de Lançamento: <GradientText>{new Date(selectedMovie.release_date).toLocaleDateString("pt-BR")}</GradientText></p>
              </div>
            </div>
          </div>
        }
      </section>
    </main>
  )
}