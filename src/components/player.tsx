import styled from "styled-components";
import { PlayerInfo } from "../routes/players";
import { ReactEventHandler, useEffect, useState } from "react";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid rgb(255 255 255 / 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  &:last-child:not(:first-child) {
    align-items: center;
  }
`;

const Thumbs = styled.div``;

const SeasonImg = styled.div``;

const Name = styled.p`
  font-weight: 600;
  font-size: 20px;
`;

export default function Player({ id, name, season }: PlayerInfo) {
  const [imgError, setImgError] = useState(false);
  const [imgUrl, setImgUrl] = useState(
    `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${id}.png`
  );
  const pId = Number(id.toString().substr(3, 6));
  const sId = Number(id.toString().substr(0, 3));
  const [playerSeason, setPlayerSeason] = useState([]);

  useEffect(() => {
    season.map((data) => {
      if (data.seasonId === sId) setPlayerSeason(data);
    });
  }, []);

  const onError: ReactEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();

    console.log(e);

    if (!imgError) {
      setImgError(true);
      setImgUrl(
        `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pId}.png`
      );
    }
  };

  return (
    <Wrapper>
      <Column>
        <Thumbs>
          <img
            src={imgUrl}
            onError={onError}
            loading="lazy"
          />
        </Thumbs>
      </Column>
      <Column>
        {id}
        <SeasonImg>
          <img
            src={playerSeason.seasonImg}
            alt={name}
          />
        </SeasonImg>
        <Name>{name}</Name>
      </Column>
    </Wrapper>
  );
}
