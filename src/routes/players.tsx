import { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "../components/loading";
import Player from "../components/player";
import useFetch from "../hooks/useFetch";
import Pagination from "../components/pagination";

export interface PlayerInfo {
  id: number;
  name: string;
  thumbs?: string;
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
  const [players, setPlayers] = useState([]);
  const [season] = useFetch(
    "https://static.api.nexon.co.kr/fconline/latest/seasonid.json"
  );
  const [page, setPage] = useState(1);
  const limit = 50;
  const offset = (page - 1) * limit;

  useEffect(() => {
    fetch("https://static.api.nexon.co.kr/fconline/latest/spid.json")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setIsLoading(false);
      });

    /* fetch("https://static.api.nexon.co.kr/fconline/latest/seasonid.json")
      .then((res) => res.json())
      .then((data) => setSeason(data)); */
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (!value) return;
  };

  // console.log(players);

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
            {players.slice(offset, offset + limit).map((player) => (
              <Player
                key={player.id}
                season={season}
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
