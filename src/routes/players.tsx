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
  const [isSearch, setIsSearch] = useState(false);
  const [isAutoSearch, setIsAutoSearch] = useState(false);
  const [isShowRelated, setIsShowRelated] = useState(false);
  const [players, setPlayers] = useState<IPlayerInfo[]>([]);
  const [searchPlayers, setSearchPlayers] = useState<IPlayerInfo[]>([]);
  const [keywords, setKeywords] = useState("");
  const [autoKeywords, setAutoKeywords] = useState("");
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [focusIndex, setFocusIndex] = useState(-1);
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

    inputRef.current?.focus();
  }, []);

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

    if (e.key === "ArrowDown") {
      if (relatedKeywords.length === 0) return;

      if (!isShowRelated) setIsShowRelated(true);

      if (listRef.current?.childElementCount === focusIndex + 1) {
        setFocusIndex(() => 0);
        return;
      }

      if (focusIndex === -1) setIsAutoSearch(true);

      setFocusIndex((index) => index + 1);
      setAutoKeywords(relatedKeywords[focusIndex + 1]);
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filteredPlayers = players.filter((player) =>
      player.name
        .toLowerCase()
        .split(" ")
        .join("")
        .includes(
          (isAutoSearch ? autoKeywords : keywords)
            .toLowerCase()
            .split(" ")
            .join("")
        )
    );

    setIsSearch(keywords.length > 0);
    setSearchPlayers(filteredPlayers);
    setIsShowRelated(false);
  };

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
              ref={inputRef}
              value={isAutoSearch ? autoKeywords : keywords}
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
          {isShowRelated && relatedKeywords?.length > 0 && (
            <div className="overflow-hidden overflow-y-auto absolute top-full w-[200px] max-h-[300px] bg-gray-50 border border-solid border-black z-[1]">
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
      </form>

      <div className="flex flex-col flex-wrap mt-10">
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
              <li className="w-full py-10 text-center">
                {`'${keywords}'로 검색된 선수가 없습니다.`}
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
            <li className="w-full py-10 text-center">
              {isLoading ? "선수 목록 생성중..." : "등록된 선수가 없습니다."}
            </li>
          )}
        </ul>

        <Pagination
          total={searchPlayers.length ? searchPlayers.length : players.length}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </div>
    </>
  );
}
