/* eslint-disable react-hooks/exhaustive-deps */
import {
  useEffect,
  useState,
  MouseEvent,
  useCallback,
  ChangeEvent,
  EffectCallback,
} from "react";
import axios from "axios";
import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import loader from "../components/loader";

const Home = () => {
  const GAME_URL = `${process.env.NEXT_PUBLIC_API_GATEWAY_HOST}games?page_size=12`;

  const [gamesListFetched, setGamesListFetched] = useState(false);
  const [gamesList, setGamesList] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [previousUrl, setPreviousUrl] = useState("");
  const [fetchType, setFetchType] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const debounce_query = useCallback(
    _.debounce((value) => fetchGamesList(value), 2000),
    []
  );

  useEffect((): ReturnType<EffectCallback> => {
    if (!gamesListFetched) {
      fetchGamesList();
    }
    return (): void => {};
  }, [gamesListFetched]);

  async function fetchGamesList(value = "") {
    axios
      .get(
        fetchType === ""
          ? `${GAME_URL}${value === "" ? "" : `&search=${value}`}`
          : fetchType === "nextUrl"
          ? nextUrl
          : previousUrl
      )
      .then((res) => {
        let response = res.data.body;
        setGamesListFetched(true);
        setGamesList(response.results);
        if (response.next === null) {
          setNextUrl("");
        } else {
          getNextPreviousUrl(response.next, "nextUrl");
        }
        if (response.previous === null) {
          setPreviousUrl("");
        } else {
          getNextPreviousUrl(response.previous, "previousUrl");
        }
      })
      .catch((err) => {
        setGamesListFetched(false);
        setGamesList([]);
        setPreviousUrl("");
        setNextUrl("");
      });
  }

  const getNextPreviousUrl = (url: string, type: string) => {
    let query_string = new URL(url);
    let page_number = query_string.searchParams.get("page");
    if (type === "nextUrl") {
      setNextUrl(
        `${GAME_URL}${searchValue === "" ? "" : `&search=${searchValue}`}${
          page_number === null ? "" : `&page=${page_number}`
        }`
      );
    } else {
      setPreviousUrl(
        `${GAME_URL}${searchValue === "" ? "" : `&search=${searchValue}`}${
          page_number === null ? "" : `&page=${page_number}`
        }`
      );
    }
  };
  const fetchNextPreviousData = (e: MouseEvent, type: string) => {
    e.preventDefault();
    setGamesListFetched(false);
    setFetchType(type);
    let main_div = document.getElementById("main_div");
    if (main_div) {
      main_div.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };
  const searchGame = (e: ChangeEvent, value: string) => {
    e.preventDefault();
    setSearchValue(value);
    setGamesListFetched(false);
  };

  const displayGameGenres = (genres: []) => {
    let genre_name: string = "";
    for (let i = 0; i < genres.length; i++) {
      let genre_object: any = genres[i];
      genre_name += `${genre_object.name}, `;
    }
    return genre_name.slice(0, -2);
  };
  const displayGamesList = () => {
    return gamesList.map((games: any, index) => {
      return (
        <Link
          href={`/game/${games.slug}`}
          key={games.name.toLowerCase().split(" ").join("-")}
        >
          <div className="md:w-9.5/10 cursor-pointer shadow-md bg-gray-200 hover:shadow-gray-500 shadow-gray-400 rounded hover:transform hover:scale-105 hover:ease-linear hover:duration-300">
            <div className="w-full p-1 bg-white rounded-t">
              {games && games.background_image && (
                <Image
                  src={games.background_image}
                  width={400}
                  height={200}
                  alt={games.name}
                  priority={index < 10 ? true : false}
                  style={{
                    height: "200px",
                  }}
                />
              )}
            </div>
            <div className="pt-1 pb-3 px-2">
              <h2 className="font-bold text-xl 2xl:text-2xl truncate">
                {games.name}
              </h2>
              <p className="text-sm font-light">
                <span className="font-semibold">Rating: </span>
                {`${games.rating} / ${games.rating_top}`}
              </p>
              <p className="text-sm italic font-light">
                <span className="font-semibold not-italic">Genres: </span>
                {`${displayGameGenres(games.genres)}`}
              </p>
              <p className="font-light text-sm">
                <span className="font-semibold">Released: </span>
                {`${new Date(games.released).toLocaleDateString()}`}
              </p>
            </div>
          </div>
        </Link>
      );
    });
  };

  return (
    <div className="px-1 md:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <h1 className="text-3xl mb-2 md:mb-0">All Games</h1>
        <div className="flex items-center text-gray-600 p-2 rounded-2xl shadow-md shadow-gray-400 border border-white md:w-1/3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className={`w-full text-black bg-transparent text-sm pl-2 pr-1.5 focus:outline-none`}
            id="search"
            name="search"
            placeholder="search"
            defaultValue={searchValue}
            onChange={(e) => {
              searchGame(e, e.target.value);
              debounce_query(e.target.value);
            }}
          />
        </div>
      </div>
      {!gamesListFetched ? (
        loader.loader()
      ) : gamesList.length > 0 ? (
        <>
          <div className="mb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-flow-row gap-x-8 gap-y-12 auto-rows-auto">
            {displayGamesList()}
          </div>
          <div className="w-full flex my-6 justify-end pr-6 text-sm text-gray-500">
            {previousUrl === "" ? null : (
              <p
                className="cursor-pointer underline"
                onClick={(e) => fetchNextPreviousData(e, "previousUrl")}
              >
                Previous
              </p>
            )}
            {nextUrl === "" || previousUrl === "" ? null : <p>&nbsp;|&nbsp;</p>}
            {nextUrl === "" ? null : (
              <p
                className="cursor-pointer underline"
                onClick={(e) => fetchNextPreviousData(e, "nextUrl")}
              >
                Next
              </p>
            )}
          </div>
        </>
      ) : (
        <h2 className="text-3xl mb-2 md:mb-0 font-light">
          No games found for&nbsp;
          <span className="font-bold">{searchValue}</span>
        </h2>
      )}
    </div>
  );
};

export default Home;
