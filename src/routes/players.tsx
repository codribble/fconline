import { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import Loading from "../components/loading";
import Player from "../components/player";
import Pagination from "../components/pagination";

export interface IPlayerInfo {
  id: number;
  name: string;
}

/* const Wrapper = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
`;

const Label = styled.label``;

const Input = styled.input`
  background-color: white;
  border: 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`; */

export default function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isAutoSearch, setIsAutoSearch] = useState(false);
  const [searchType, setSearchType] = useState<
    "all" | "keywords" | "autoKeywords"
  >("all");
  const [isShow, setIsShow] = useState(false);
  const [players, setPlayers] = useState<IPlayerInfo[]>([]);
  const [searchPlayers, setSearchPlayers] = useState<IPlayerInfo[]>([]);
  const [keywords, setKeywords] = useState("");
  const [autoKeywords, setAutoKeywords] = useState("");
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const limit = 50;
  const offset = (page - 1) * limit;
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const focusRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    fetch("https://static.api.nexon.co.kr/fconline/latest/spid.json")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching player data: ", error);
      });
  }, []);

  const onKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const regEx = /^[a-zA-Z0-9가-힣]+$/;
    const searchKeyword = value
      .toString()
      .toLocaleLowerCase()
      .split(" ")
      .join("");

    if (isAutoSearch) {
      const enteredValue =
        e.nativeEvent.inputType === "deleteContentBackward"
          ? ""
          : e.nativeEvent.data;
      focusIndex >= 0 && setKeywords(autoKeywords + enteredValue);
      setIsAutoSearch(false);
      setFocusIndex(-1);
      return;
    }

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

    setIsShow(value.length > 1);
    setKeywords(value);
  };

  const onFocus = () => {
    setIsShow(true);
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.key === "ArrowDown") {
      if (relatedKeywords.length === 0) return;

      if (listRef.current?.childElementCount === focusIndex + 1) {
        setFocusIndex(() => 0);
        return;
      }

      if (focusIndex === -1) {
        setIsAutoSearch(true);
      }

      setFocusIndex((index) => index + 1);
      setAutoKeywords(relatedKeywords[focusIndex + 1]);
    }

    if (e.key === "ArrowUp") {
      if (focusIndex === -1) return;

      if (focusIndex === 0) {
        setAutoKeywords("");
        setFocusIndex((index) => index - 1);
        setIsAutoSearch(false);
        return;
      }

      setFocusIndex((index) => index - 1);
      setAutoKeywords(relatedKeywords[focusIndex - 1]);
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

    setAutoKeywords(name);
    setKeywords(name);
    setIsAutoSearch(true);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let searchResult: IPlayerInfo[] = [];

    if (searchType === "all") {
      searchResult = players;
    } else if (searchType === "keywords") {
      searchResult = players.filter((data: IPlayerInfo) =>
        data.name
          .toLowerCase()
          .split(" ")
          .join()
          .includes(keywords.toLowerCase().split(" ").join())
      );
    } else if (searchType === "autoKeywords") {
      searchResult = players.filter((data: IPlayerInfo) =>
        data.name
          .toLowerCase()
          .split(" ")
          .join()
          .includes(autoKeywords.toLowerCase().split(" ").join())
      );
    }

    setPage(1);
    setSearchPlayers([...new Set(searchResult)]);
    setIsSearching(true);
    setIsShow(false);
  };

  useEffect(() => {
    setSearchType(
      keywords ? "keywords" : autoKeywords ? "autoKeywords" : "all"
    );
  }, [keywords, autoKeywords]);

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }, [focusIndex]);

  console.log(
    `searchType: ${searchType}, autoKeywords: ${autoKeywords}, keywords: ${keywords}`
  );

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-5"
        autoComplete="off"
      >
        <div className="w-[100px]">
          <label
            htmlFor="name"
            className="w-full"
          >
            선수명
          </label>
        </div>
        <div className="relative flex w-full">
          <div className="relate flex">
            <input
              id="name"
              type="text"
              value={isAutoSearch ? autoKeywords : keywords}
              onFocus={onFocus}
              onKeyUp={onKeyUp}
              onChange={onKeywordChange}
              className="w-[200px] px-2 py-2 text-black"
              placeholder="선수명"
            />
            <input
              type="submit"
              value="검색"
              className="w-[60px] bg-indigo-600 cursor-pointer"
            />
          </div>
          {isShow && (
            <div
              ref={scrollRef}
              className="overflow-hidden overflow-y-auto absolute top-full w-[200px] max-h-[300px] bg-gray-50 border border-solid border-black z-[1]"
            >
              {relatedKeywords?.length > 0 && (
                <ul
                  role="list"
                  ref={listRef}
                >
                  {relatedKeywords.map((data, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        onClick={onInsertKeyword}
                        className={`block w-full p-[10px] ${
                          index === focusIndex
                            ? "bg-indigo-400 text-white"
                            : "bg-white text-gray-900"
                        } hover:bg-indigo-400 hover:text-white`}
                        ref={index === focusIndex ? focusRef : undefined}
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
              )}
            </div>
          )}
        </div>
      </form>

      <div className="flex flex-col flex-wrap mt-10">
        <ul
          role="list"
          className="flex flex-col flex-wrap gap-3"
        >
          {isSearching ? (
            searchPlayers.length > 0 ? (
              searchPlayers
                .slice(offset, offset + limit)
                .map((player: IPlayerInfo) => (
                  <Player
                    key={player.id}
                    {...player}
                  />
                ))
            ) : (
              <li className="w-full py-10 text-center">
                검색된 선수가 없습니다.
              </li>
            )
          ) : players.length > 0 ? (
            players.slice(offset, offset + limit).map((player: IPlayerInfo) => (
              <Player
                key={player.id}
                {...player}
              />
            ))
          ) : (
            <li className="w-full py-10 text-center">
              {isLoading
                ? "선수 목록 구성중..."
                : `${keywords ? "검색된" : "등록된"} 선수가 없습니다.`}
            </li>
          )}
        </ul>

        <Pagination
          total={isSearching ? searchPlayers.length : players.length}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </div>
    </>
  );
}
