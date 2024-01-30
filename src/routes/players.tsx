import { useEffect, useRef, useState } from "react";
import Player from "../components/player";
import Pagination from "../components/pagination";
import { useNavigationType } from "react-router-dom";
// import axios from "axios";
// import * as cheerio from "cheerio";

export interface IPlayerInfo {
  id: number;
  name: string;
}

export interface ISeasonInfo {
  seasonId: number;
  seasonImg: string;
  className: string;
}

export default function Players() {
  const navigationType = useNavigationType();
  const [isLoading, setIsLoading] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  const [isAutoSearch, setIsAutoSearch] = useState(false);
  const [isShowRelated, setIsShowRelated] = useState(false);
  const [players, setPlayers] = useState<IPlayerInfo[]>([]);
  const [seasons, setSeasons] = useState<ISeasonInfo[]>([]);
  const [searchPlayers, setSearchPlayers] = useState<IPlayerInfo[]>([]);
  const [keywords, setKeywords] = useState("");
  const [autoKeywords, setAutoKeywords] = useState("");
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  // const [searchSeasons, setSearchSeasons] = useState<number[]>([]);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 50;
  const offset = (page - 1) * limit;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const focusRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    fetch("https://open.api.nexon.com/static/fconline/meta/spid.json")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching player data: ", error);
      });

    fetch("https://open.api.nexon.com/static/fconline/meta/seasonid.json")
      .then((res) => res.json())
      .then((data) => setSeasons(data))
      .catch((error) => console.error("Error fetching season data", error));

    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (navigationType === "POP") {
      const playerList = sessionStorage.getItem("SearchedPlayers");
      const playerName = sessionStorage.getItem("SearchedKeywords");
      const playerSeasons = sessionStorage.getItem("SearchedSeasons");

      if (playerName) {
        setKeywords(playerName);
      }

      if (playerSeasons) {
        const seaonsJSON = JSON.parse(playerSeasons);

        setCheckedList(seaonsJSON);
      }

      if (playerList) {
        const playerJSON = JSON.parse(playerList);

        setIsSearch(true);
        setSearchPlayers(playerJSON);
        setTotal(playerJSON.length);
        setIsShowRelated(false);
      }
    }

    if (navigationType === "PUSH") {
      setKeywords("");
      setCheckedList([]);
      setSearchPlayers([]);
      setTotal(0);
      setIsShowRelated(false);
      sessionStorage.clear();
    }
  }, [navigationType]);

  const onKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const regEx = /^[a-zA-Z0-9가-힣]+$/;
    const searchKeyword = value
      .toString()
      .toLocaleLowerCase()
      .split(" ")
      .join("");

    if (value.length > 1) {
      const uniqueName = [...new Set(players.map((data) => data.name))]
        .sort()
        .filter((data) => {
          return (
            regEx.test(searchKeyword) &&
            data
              .toString()
              .toLowerCase()
              .split(" ")
              .join("")
              .includes(searchKeyword)
          );
        });

      setRelatedKeywords(uniqueName);
    }

    if (isAutoSearch) {
      const enteredValue =
        (e.nativeEvent as InputEvent).inputType === "deleteContentBackward"
          ? ""
          : (e.nativeEvent as InputEvent).data;

      focusIndex >= 0 && setKeywords(autoKeywords + enteredValue);
      setIsAutoSearch(false);
      setFocusIndex(-1);
      return;
    }

    setIsShowRelated(value.length > 0);
    setKeywords(value);
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const listRefScrollHeight = listRef.current?.scrollHeight;
    console.log(listRefScrollHeight);

    if (e.key === "ArrowDown") {
      if (relatedKeywords.length === 0) return;

      if (!isShowRelated) setIsShowRelated(true);

      if (listRef.current?.childElementCount === focusIndex + 1) {
        setFocusIndex(0);
        setAutoKeywords(relatedKeywords[0]);
        listRef.current?.children[0].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        return;
      }

      if (focusIndex === -1) setIsAutoSearch(true);

      setFocusIndex((index) => index + 1);
      setAutoKeywords(relatedKeywords[focusIndex + 1]);
      listRef.current?.children[focusIndex + 1].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }

    if (e.key === "ArrowUp") {
      if (focusIndex === -1) return;

      if (focusIndex === 0) {
        setIsShowRelated(false);
        setAutoKeywords("");
        setFocusIndex((index) => index - 1);
        setIsAutoSearch(false);
        return;
      }

      setFocusIndex((index) => index - 1);
      setAutoKeywords(relatedKeywords[focusIndex - 1]);
      listRef.current?.children[focusIndex - 1].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }

    if (e.key === "Escape") {
      setKeywords("");
      setAutoKeywords("");
      setRelatedKeywords([]);
      setFocusIndex(-1);
      setIsAutoSearch(false);
    }
  };

  const onInsertKeyword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const name = e.currentTarget.innerText;

    setKeywords(name);
    setFocusIndex(-1);
    setIsAutoSearch(false);
    inputRef.current?.focus();
  };

  const onCheckedSsesons = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const checkedSeason = e.target.value;

    if (checked) {
      setCheckedList((prev) => [...prev, checkedSeason]);
    } else {
      setCheckedList(checkedList.filter((item) => item !== checkedSeason));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filteredPlayers = players.filter((player) => {
      const keywordCase = player.name
        .toLowerCase()
        .split(" ")
        .join("")
        .includes(
          (isAutoSearch ? autoKeywords : keywords)
            .toLowerCase()
            .split(" ")
            .join("")
        );

      const seasonCase =
        checkedList.length === 0 ||
        checkedList.includes(player.id.toString().substring(0, 3));

      return keywordCase && seasonCase;
    });

    sessionStorage.setItem("SearchedSeasons", JSON.stringify(checkedList));
    sessionStorage.setItem("SearchedKeywords", keywords);
    sessionStorage.setItem("SearchedPlayers", JSON.stringify(filteredPlayers));
    setIsSearch(keywords.length > 0 || checkedList.length > 0);
    setSearchPlayers(filteredPlayers);
    setTotal(filteredPlayers.length);
    setIsShowRelated(false);
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        className=""
        autoComplete="off"
      >
        <fieldset className="flex items-center gap-5">
          <div className="relative w-full">
            <div className="relate flex w-full">
              <label
                htmlFor="name"
                className="hidden"
              >
                선수명
              </label>
              <input
                id="name"
                type="text"
                ref={inputRef}
                value={isAutoSearch ? autoKeywords : keywords}
                onKeyUp={onKeyUp}
                onChange={onKeywordChange}
                className="w-[calc(100%-60px)] px-2 py-2 text-black md:w-[200px]"
                placeholder="선수명"
              />
              <input
                type="submit"
                value="검색"
                className="w-[60px] bg-indigo-600 cursor-pointer"
              />
            </div>
            {isShowRelated && relatedKeywords?.length > 0 && (
              <div className="overflow-hidden overflow-y-auto absolute top-full w-[calc(100%-60px)] max-h-[300px] bg-gray-50 border border-solid border-black z-[1] md:w-[200px]">
                <ul
                  role="list"
                  ref={listRef}
                >
                  {relatedKeywords.map((data, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        ref={focusRef}
                        onClick={onInsertKeyword}
                        className={`block w-full p-[10px] ${
                          focusIndex === index
                            ? "bg-indigo-400 text-white"
                            : "bg-white text-gray-900"
                        } hover:bg-indigo-400 hover:text-white`}
                      >
                        {data
                          .split(new RegExp(`(${keywords})`, "ig"))
                          .map((part) =>
                            part.toLowerCase() ===
                            keywords.toLocaleLowerCase() ? (
                              <span
                                key={part}
                                className="font-bold text-indigo-600"
                              >
                                {part}
                              </span>
                            ) : (
                              part
                            )
                          )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </fieldset>

        <fieldset className="mt-[20px]">
          <div className="flex flex-wrap gap-4">
            {seasons &&
              seasons.map((season, i) => (
                <div
                  key={i}
                  className="relative w-[35px]"
                >
                  <input
                    type="checkbox"
                    id={season.seasonId.toString()}
                    name="season[]"
                    value={season.seasonId}
                    className="hidden peer"
                    onChange={onCheckedSsesons}
                    checked={checkedList.includes(season.seasonId.toString())}
                  />
                  <label
                    htmlFor={season.seasonId.toString()}
                    className="block cursor-pointer opacity-50 peer-checked:opacity-100"
                    title={season.className}
                  >
                    <img
                      src={season.seasonImg}
                      className="w-full"
                    />
                  </label>
                </div>
              ))}
          </div>
        </fieldset>
      </form>

      <div className="flex flex-col flex-wrap mt-10">
        <p className="mb-[20px] text-lg">
          검색 결과:
          <span className="ml-[5px] font-bold">
            {isSearch ? total : players.length}
          </span>
          명
        </p>

        <ul
          role="list"
          className="flex flex-col flex-wrap gap-3"
        >
          {isSearch ? (
            searchPlayers.length ? (
              searchPlayers.slice(offset, offset + limit).map((player) => (
                <Player
                  key={player.id}
                  {...player}
                />
              ))
            ) : (
              <li className="w-full py-20 text-center">
                {`'${keywords}'(으)로 검색된 선수가 없습니다.`}
              </li>
            )
          ) : players.length ? (
            players.slice(offset, offset + limit).map((player) => (
              <Player
                key={player.id}
                {...player}
              />
            ))
          ) : (
            <li className="w-full py-20 text-center">
              {isLoading ? "선수 목록 생성중..." : "등록된 선수가 없습니다."}
            </li>
          )}
        </ul>

        <Pagination
          total={total}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </div>
    </>
  );
}
