import { useEffect, useState } from "react";
// import styled from "styled-components";
import Loading from "../components/loading";
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
    };

    fetchPlayer();

    setIsLoading(false);
  }, [keywords]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const regEx = /^[a-zA-Z0-9가-힣]+$/;

    const uniqueName = [...new Set(players.map((data) => data.name))]
      .sort()
      .filter((data) => {
        return (
          regEx.test(value.toString().split(" ").join()) &&
          data
            .toString()
            .split(" ")
            .join()
            .includes(value.toString().split(" ").join())
        );
      });

    setNameList(uniqueName);

    setKeywords(value);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
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
            <div className="relative w-full">
              <input
                id="name"
                type="text"
                value={keywords}
                onChange={onChange}
                className="w-full px-2 py-2 text-black"
                placeholder="선수명"
                autoComplete="off"
              />
              <div className="absolute top-full w-full bg-gray-50 border border-solid border-black z-[1]">
                <ul role="list">
                  {keywords &&
                    nameList.map((data) => (
                      <li>
                        <a
                          href="#"
                          className="block w-full p-[10px] text-gray-900 hover:bg-gray-600 hover:text-white focus:bg-gray-600 focus:text-white"
                        >
                          {data}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-wrap mt-10">
            <ul
              role="list"
              className="flex flex-col flex-wrap gap-3"
            >
              {players.length ? (
                players
                  .slice(offset, offset + limit)
                  .map((player: IPlayerInfo) => (
                    <Player
                      key={player.id}
                      {...player}
                    />
                  ))
              ) : (
                <li className="w-full py-10 text-center">
                  {keywords ? "검색된" : "등록된"} 선수가 없습니다.
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
      )}
    </>
  );
}
