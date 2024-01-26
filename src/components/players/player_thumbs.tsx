import { ReactEventHandler, useState } from "react";

export interface IPlayerThumbs {
  spId: number;
  name: string;
  width?: string;
}

export default function PlayerThumbs({ spId, name, width }: IPlayerThumbs) {
  const [thumbs, setThumbs] = useState(
    `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${spId}.png`
  );
  const pId = Number(spId.toString().substring(3));

  const onError: ReactEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();

    switch (thumbs) {
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${spId}.png`:
        setThumbs(
          `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${pId}.png`
        );
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${pId}.png`:
        setThumbs(
          `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${spId}.png`
        );
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${spId}.png`:
        setThumbs(
          `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pId}.png`
        );
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pId}.png`:
        setThumbs(`${import.meta.env.BASE_URL}assets/images/no_thumbs.png`);
        break;
    }
  };

  return (
    <>
      {thumbs && (
        <img
          src={thumbs}
          alt={name}
          onError={onError}
          className={width ? width : "max-w-full"}
        />
      )}
    </>
  );
}
