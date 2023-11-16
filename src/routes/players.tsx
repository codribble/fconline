import { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "../components/loading";
import Player from "../components/player";
import Pagination from "../components/pagination";

export interface IPlayerInfo {
  id: number;
  name: string;
}

const Wrapper = styled.div`
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
`;

export default function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<IPlayerInfo[]>([]);
  const [page, setPage] = useState(1);
  const limit = 50;
  const offset = (page - 1) * limit;

  useEffect(() => {
    const playerData = async () => {
      const data = await fetch(
        "https://static.api.nexon.co.kr/fconline/latest/spid.json"
      )
        .then((res) => res.json())
        .then((data) => data);

      setPlayers(data);
    };
    playerData();

    setIsLoading(false);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (!value) return;
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Wrapper>
          <Label htmlFor="name">선수명</Label>
          <Input
            id="name"
            onChange={onChange}
          />

          <List>
            {players
              .slice(offset, offset + limit)
              .map((player: IPlayerInfo) => (
                <Player
                  key={player.id}
                  {...player}
                />
              ))}
          </List>

          <Pagination
            total={players.length}
            limit={limit}
            page={page}
            setPage={setPage}
          />
        </Wrapper>
      )}
    </>
  );
}
