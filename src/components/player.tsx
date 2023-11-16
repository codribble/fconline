// import styled from "styled-components";
import { IPlayerInfo } from "../routes/players";
import { ReactEventHandler, useEffect, useState } from "react";

export interface ISeasonInfo {
  seasonId: number;
  seasonImg: string;
  className: string;
}

/* const Wrapper = styled.div`
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

const Row = styled.div`
  display: flex;
  align-self: flex-start;
  align-items: center;
  gap: 10px;
`;

const Thumbs = styled.div``;

const SeasonImg = styled.div``;

const Name = styled.p`
  font-weight: 600;
  font-size: 20px;
`; */

export default function Player({ id, name }: IPlayerInfo) {
  const [imgError, setImgError] = useState(false);
  const [imgUrl, setImgUrl] = useState(
    `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${id}.png`
  );
  const pId = Number(id.toString().substr(3, 6));
  const sId = Number(id.toString().substr(0, 3));
  const [seasons, setSeasons] = useState<ISeasonInfo[]>([]);
  const [season, setSeason] = useState<ISeasonInfo | null>(null);

  useEffect(() => {
    const seasonData = async () => {
      const data = await fetch(
        "https://static.api.nexon.co.kr/fconline/latest/seasonid.json"
      )
        .then((res) => res.json())
        .then((data) => data);

      setSeasons(data);
    };

    seasonData();
  }, []);

  useEffect(() => {
    seasons.map((data: ISeasonInfo) => {
      if (data.seasonId.toString() === sId.toString()) setSeason(data);
    });
  }, [sId, seasons]);

  const onError: ReactEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();

    if (!imgError) {
      setImgError(true);
      setImgUrl(
        `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pId}.png`
      );
    }
  };

  return (
    <li className="flex items-center gap-5 p-5 first:border-t border-b border-solid border-gray-300 border-opacity-50">
      <div className="flex flex-col gap-3">
        <div className={`relative w-[100px]`}>
          <img
            src={imgUrl}
            alt={name}
            onError={onError}
            className="w-full h-auto"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {/* <Row>{id}</Row> */}
        <div className="flex self-start items-center gap-2">
          {season && (
            <div className="w-[30px]">
              <img
                src={season?.seasonImg}
                alt={name}
                className="w-full h-auto"
              />
            </div>
          )}
          <strong className="font-semibold text-xl">{name}</strong>
        </div>
      </div>
    </li>
  );
}
