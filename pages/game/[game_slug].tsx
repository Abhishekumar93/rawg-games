/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import DOMPurify from "dompurify";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import loader from "../../components/loader";

const SingleGameDetail = () => {
  const router = useRouter();
  const { game_slug } = router.query;

  const [gameDetailFetched, setGameDetailFetched] = useState(false);
  const [gameDetail, setGameDetail] = useState<any>({});

  useEffect(() => {
    if (game_slug) {
      fetchGameDetail();
    }
  }, [game_slug]);

  async function fetchGameDetail() {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_GATEWAY_HOST}${game_slug}`)
      .then((res) => {
        setGameDetailFetched(true);
        setGameDetail(res.data);
      })
      .catch((err) => {
        setGameDetailFetched(false);
        setGameDetail({});
      });
  }

  const displayGameDetail = () => {
    return (
      <div className="w-full px-2 md:px-4">
        <Image
          src={gameDetail.background_image}
          width={2000}
          height={250}
          alt={`${game_slug}`}
          priority={true}
          className="rounded-md shadow-lg"
          style={{ height: "600px" }}
        />
        <>
          <p className="text-base font-light mt-8 mb-2">
            <span className="font-semibold">Rating: </span>
            {`${gameDetail.rating} / ${gameDetail.rating_top}`}
          </p>
          <p className="text-base font-light mb-2">
            <span className="font-semibold">Genres: </span>
            {`${displayGameGenresAndDevelopers(gameDetail.genres)}`}
          </p>
          <p className="text-base font-light mb-2">
            <span className="font-semibold">Website: </span>
            <a
              href={gameDetail.website}
              target={"_blank"}
              rel="noreferrer"
              className="text-blue-600"
            >{`${gameDetail.website}`}</a>
          </p>
          <p className="text-base font-light mb-2">
            <span className="font-semibold">{`Developer${
              gameDetail.developers.length === 1 ? "" : "s"
            }: `}</span>
            {`${displayGameGenresAndDevelopers(gameDetail.developers)}`}
          </p>
          <p
            className="text-base font-light"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(gameDetail.description),
            }}
          />
        </>
      </div>
    );
  };
  const displayGameGenresAndDevelopers = (genres_or_developers: []) => {
    let genre_or_developers_name: string = "";
    for (let i = 0; i < genres_or_developers.length; i++) {
      let genre_object: any = genres_or_developers[i];
      genre_or_developers_name += `${genre_object.name}, `;
    }
    return genre_or_developers_name.slice(0, -2);
  };

  if (gameDetailFetched && gameDetail && Object.keys(gameDetail).length > 0) {
    return (
      <>
        <Link href={"/"}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="3x"
            className="text-2xl cursor-pointer"
            style={{ width: "1.5rem" }}
          />
        </Link>
        <div className="w-9.5/10 mx-auto md:w-3/4 rounded-md shadow-inner py-8 shadow-gray-500 mt-4 md:mt-0 mb-6 bg-gray-100">
          <h1 className="text-3xl md:text-4xl mb-8 text-center font-bold">
            {gameDetail.name}
          </h1>
          {displayGameDetail()}
        </div>
      </>
    );
  } else {
    return loader.loader();
  }
};

export default SingleGameDetail;
