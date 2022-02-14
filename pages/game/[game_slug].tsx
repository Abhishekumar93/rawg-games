/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import loader from '../../components/loader'

const SingleGameDetail: NextPage = () => {

  const router = useRouter()
  const { game_slug } = router.query

  const [gameDetailFetched, setGameDetailFetched] = useState(false)
  const [gameDetail, setGameDetail] = useState<any>({})

  useEffect(() => {
    if (game_slug) {
      fetchGameDetail()
    }
  }, [game_slug])
  
 async function fetchGameDetail() {
  axios.get(`https://api.rawg.io/api/games/${game_slug}?key=e648abe0c449445c8b7373607e545a31`).then(res => {
    setGameDetailFetched(true);setGameDetail(res.data)
  }).catch(err => {
    setGameDetailFetched(false);setGameDetail({})
    console.log(err,'rrrtet');
    
  });
 }

 const displayGameDetail = () => {
    return (
      <div className='w-full px-2 md:px-4'>
        <Image src={gameDetail.background_image} width={1} height={0.5} alt={`${game_slug}`} layout={`responsive`} objectFit={'contain'} priority={true} />
        <div className='px-2 md:pl-6 lg:pl-12 2xl:pl-16'>
          <p className='text-base font-light mt-8 mb-2'><span className='font-semibold'>Rating: </span>{`${gameDetail.rating} / ${gameDetail.rating_top}`}</p>
          <p className='text-base font-light mb-2'><span className='font-semibold'>Genres: </span>{`${displayGameGenresAndDevelopers(gameDetail.genres)}`}</p>
          <p className='text-base font-light mb-2'><span className='font-semibold'>Website: </span><a href={gameDetail.website} target={'_blank'} rel="noreferrer" className='text-blue-600' >{`${gameDetail.website}`}</a></p>
          <p className='text-base font-light mb-2'><span className='font-semibold'>{`Developer${gameDetail.developers.length === 1 ? '' : 's'}: `}</span>{`${displayGameGenresAndDevelopers(gameDetail.developers)}`}</p>
          <p className='text-base font-light'>{gameDetail.description_raw}</p>
        </div>
      </div>
    )
  }
  const displayGameGenresAndDevelopers = (genres_or_developers: []) => {
    let genre_or_developers_name: string = ''
    for (let i = 0; i < genres_or_developers.length; i++) {
      let genre_object: any = genres_or_developers[i]
      genre_or_developers_name += `${genre_object.name}, `
    }
    return genre_or_developers_name.slice(0, -2)
  }

  if (gameDetailFetched && Object.keys(gameDetail).length > 0) {
    return (
      <>
        <Link href={'/'}>
          <a><FontAwesomeIcon icon={faArrowLeft} size="3x" className='text-2xl cursor-pointer' style={{width: '1.5rem'}} /></a>
        </Link>
        <div className='w-9.5/10 mx-auto md:w-3/4 rounded-md shadow-inner py-8 shadow-gray-500'>
          <h1 className="text-3xl md:text-4xl mb-8 text-center font-bold">{gameDetail.name}</h1>
          {displayGameDetail()}
        </div>
      </>
    )
  } else {
    return loader.loader()
  }
}

export default SingleGameDetail