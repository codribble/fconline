import { Link /* , useNavigate */ } from "react-router-dom";
import { IPlayerInfo, ISeasonInfo } from "../routes/players";
import { useEffect, useState } from "react";
import PlayerThumbs from "./players/player_thumbs";

export default function Player({ id, name }: IPlayerInfo) {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
  }, [seasonId, seasons]);

  // console.log(seasons);

  return (
    <>
      {isLoading && (
        <li className="flex items-center gap-5 py-2 px-4 first:border-t border-b border-solid border-gray-300 border-opacity-50">
          <div className="flex flex-col gap-3">
            <div className={`relative w-[80px]`}>
              <PlayerThumbs
                key={id}
                spId={id}
                name={name}
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
