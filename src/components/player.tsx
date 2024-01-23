import { Link /* , useNavigate */ } from "react-router-dom";
import { IPlayerInfo, ISeasonInfo } from "../routes/players";
import { ReactEventHandler, useEffect, useState } from "react";

export default function Player({ id, name }: IPlayerInfo) {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [thumbs, setThumbs] = useState(
    `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${id}.png`
  );
  const pId = Number(id.toString().substring(3));
  const seasonId = Number(id.toString().substring(0, 3));
  const [seasons, setSeasons] = useState<ISeasonInfo[]>([]);
  const [season, setSeason] = useState<ISeasonInfo | null>(null);
  /* const headers = {
    Authorization: import.meta.env.VITE_FCONLINE_API_KEY,
  }; */

  useEffect(() => {
    fetch("https://open.api.nexon.com/static/fconline/meta/seasonid.json")
      .then((res) => res.json())
      .then((data) => setSeasons(data))
      .catch((error) => console.error("Error fetching season data", error));
  }, []);

  useEffect(() => {
    seasons.map((data) => {
      if (data.seasonId.toString() === seasonId.toString()) setSeason(data);
    });
  }, [seasonId, seasons]);

  // console.log(seasons);

  const onError: ReactEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();

    switch (thumbs) {
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${id}.png`:
        setThumbs(
          `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${pId}.png`
        );
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${pId}.png`:
        setThumbs(
          `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${id}.png`
        );
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${id}.png`:
        setThumbs(
          `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pId}.png`
        );
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pId}.png`:
        /* setThumbs(
                "https://ssl.nexon.com/s2/game/fc/mobile/squadMaker/default/d_player.png"
                ); */
        setThumbs(`${import.meta.env.BASE_URL}assets/images/no_thumbs.png`);
        break;
      default:
        setIsLoading(false);
        break;
    }
  };

  return (
    <>
      {isLoading && (
        <li className="flex items-center gap-5 py-2 px-4 first:border-t border-b border-solid border-gray-300 border-opacity-50">
          <div className="flex flex-col gap-3">
            <div className={`relative w-[80px]`}>
              <img
                src={thumbs}
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
                    alt={season?.className}
                    className="w-full h-auto"
                  />
                </div>
              )}
              <Link
                to={`/players/${id}`}
                /* onClick={(e) => {
                  e.preventDefault();
                  navigate(`/players/${id}`, {
                    state: {
                      id: id,
                      seasonId: seasonId,
                      name: name,
                      thumbs: thumbs,
                      seasonImg: season?.seasonImg,
                      seasonClass: season?.className,
                    },
                  });
                }} */
                className="font-semibold text-xl"
              >
                {name}
              </Link>
            </div>
          </div>
        </li>
      )}
    </>
  );
}
