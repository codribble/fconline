import { useEffect, useState } from "react";
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
  const [isSearching, setIsSearching] = useState(true);
  const [players, setPlayers] = useState<IPlayerInfo[]>([]);
  const [keywords, setKeywords] = useState("");
  const [nameList, setNameList] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 50;
  const offset = (page - 1) * limit;

  useEffect(() => {
    const fetchPlayer = async () => {
      const playerData = await fetch(
        "https://static.api.nexon.co.kr/fconline/latest/spid.json"
      )
        .then((res) => res.json())
        .then((data) => data);

      const list = keywords
        ? playerData.filter((data: IPlayerInfo) =>
            data.name.split(" ").join().includes(keywords.split(" ").join())
          )
        : playerData;

      setPlayers(list);
      setIsSearching(false);
    };

    fetchPlayer();

    if (keywords) setPage(1);
  }, [keywords]);

  const onKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setKeywords(value);

    const regEx = /^[a-zA-Z0-9가-힣]+$/;
    const searchKeyword = value
      .toString()
      .toLocaleLowerCase()
      .split(" ")
      .join("");
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

    setNameList(uniqueName);
  };

  const onBlur = () => {
    setNameList([]);
  };

  const onInsertKeyword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const name = e.currentTarget.innerText;

    setKeywords(name);
  };

  return (
    <>
      <div className="flex items-center gap-5">
        <div className="w-[100px]">
          <label
            htmlFor="name"
            className="w-full"
          >
            선수명
          </label>
        </div>
        <div className="relative flex w-full">
          <input
            id="name"
            type="text"
            value={keywords}
            onFocus={onKeywordChange}
            onBlur={onBlur}
            onChange={onKeywordChange}
            className="w-[200px] px-2 py-2 text-black"
            placeholder="선수명"
            autoComplete="off"
          />
          {keywords && (
            <div className="overflow-hidden overflow-y-auto absolute top-full w-[200px] max-h-[300px] bg-gray-50 border border-solid border-black z-[1]">
              {nameList?.length > 0 && (
                <ul role="list">
                  {nameList?.map((data) => (
                    <li key={data}>
                      <a
                        href="#"
                        className="block w-full p-[10px] text-gray-900 hover:bg-indigo-400 hover:text-white focus:bg-indigo-400 focus:text-white"
                        onClick={onInsertKeyword}
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
      </div>
      <div className="flex flex-col flex-wrap mt-10">
        <ul
          role="list"
          className="flex flex-col flex-wrap gap-3"
        >
          {!isSearching && players.length > 0 ? (
            players.slice(offset, offset + limit).map((player: IPlayerInfo) => (
              <Player
                key={player.id}
                {...player}
              />
            ))
          ) : (
            <li className="w-full py-10 text-center">
              {isSearching
                ? "검색중..."
                : `${keywords ? "검색된" : "등록된"} 선수가 없습니다.`}
            </li>
          )}
        </ul>

        <Pagination
          total={players.length}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      </div>
    </>
  );
}
