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

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex items-center gap-5">
            <label
              htmlFor="name"
              className="w-[100px]"
            >
              선수명
            </label>
            <input
              id="name"
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-2 py-2 text-black"
              placeholder="선수명"
            />
          </div>
          <div className="flex flex-col flex-wrap mt-10">
            <ul
              role="list"
              className="flex flex-col flex-wrap gap-3"
            >
              {players
                .slice(offset, offset + limit)
                .map((player: IPlayerInfo) => (
                  <Player
                    key={player.id}
                    {...player}
                  />
                ))}
            </ul>

            <Pagination
              total={players.length}
              limit={limit}
              page={page}
              setPage={setPage}
            />
          </div>
        </div>
      )}
    </>
  );
}
