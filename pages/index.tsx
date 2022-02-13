/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, MouseEvent } from 'react'
import axios from 'axios'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import loader from '../components/loader'

const Home: NextPage = () => {

  const [gamesListFetched, setGamesListFetched] = useState(false)
  const [gamesList, setGamesList] = useState([])
  const [seoTitle, setSeoTitle] = useState('')
  const [nextUrl, setNextUrl] = useState('')
  const [previousUrl, setPreviousUrl] = useState('')
  const [fetchType, setFetchType] = useState('')

  useEffect(() => {
    if (!gamesListFetched) {
      fetchGamesList()
    }
  }, [gamesListFetched])

  async function fetchGamesList() {
    axios.get(fetchType === '' ? `https://api.rawg.io/api/games?page_size=24&key=e648abe0c449445c8b7373607e545a31` : fetchType === 'nextUrl' ? nextUrl : previousUrl).then(res => {
      setGamesListFetched(true);setGamesList(res.data.results)
      setSeoTitle(res.data.seo_title);setNextUrl(res.data.next === null ? '' : res.data.next)
      setPreviousUrl(res.data.previous === null ? '' : res.data.previous)
    }).catch(err => {
      setGamesListFetched(false);setGamesList([]);setPreviousUrl('')
      setSeoTitle('');setNextUrl('')
    });
  }

  const fetchNextPreviousData = (e: MouseEvent, type: string) => {
    e.preventDefault()
    setGamesListFetched(false);setFetchType(type)
    let main_div = document.getElementById('main_div')
    if (main_div) {
      main_div.scrollTo({top: 0, left: 0, behavior: 'smooth'}) 
    }
  }

  const displayGameGenres = (genres: []) => {
    let genre_name: string = ''
    for (let i = 0; i < genres.length; i++) {
      let genre_object: any = genres[i]
      genre_name += `${genre_object.name}, `
    }
    return genre_name.slice(0, -2)
  }
  const displayGamesList = () => {
    return (
      gamesList.map((games: any, index) => {
        return (
          <Link href={`/game/${games.slug}`} key={games.name.toLowerCase().split(' ').join('-')}>
            <a>
              <div className='md:w-9.5/10 cursor-pointer shadow-md hover:shadow-inner hover:shadow-gray-500 shadow-gray-400 rounded'>
                <div className='w-full p-1 bg-gray-400 rounded-t'>
                  <Image src={games.background_image} width={16} height={9} layout={'responsive'} objectFit="fill" alt={games.name} priority={index < 10 ? true : false} />
                </div>
                <div className='pt-1 pb-3 px-2'>
                  <h2 className='font-bold text-xl 2xl:text-2xl truncate'>{games.name}</h2>
                  <p className='text-sm font-light'><span className='font-semibold'>Rating: </span>{`${games.rating} / ${games.rating_top}`}</p>
                  <p className='text-sm italic font-light'><span className='font-semibold not-italic'>Genres: </span>{`${displayGameGenres(games.genres)}`}</p>
                  <p className='font-light text-sm'><span className='font-semibold'>Released: </span>{`${new Date(games.released).toLocaleDateString()}`}</p>
                </div>
              </div>
            </a>
          </Link>
        )
      })
    )
  }

  if (gamesListFetched) {
    return (
      <div className='px-1 md:px-8'>
        <h1 className='text-3xl mb-8'>All Games</h1>
        <div className='mb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-flow-row gap-x-8 gap-y-12 auto-rows-auto'>
          {displayGamesList()}
        </div>
        <div className='w-full flex mb-6 justify-end pr-6 text-sm text-gray-500'>
          {previousUrl === '' ? null : <p className='cursor-pointer underline' onClick={(e) => fetchNextPreviousData(e, 'previousUrl')} >Previous</p>}
          {nextUrl === '' || previousUrl === '' ? null : <p>&nbsp;|&nbsp;</p>}
          {nextUrl === '' ? null : <p className='cursor-pointer underline' onClick={(e) => fetchNextPreviousData(e, 'nextUrl')} >Next</p>}
        </div>
      </div>
    )
  } else {
    return loader.loader()
  }
}

export default Home

