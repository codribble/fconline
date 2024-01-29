import { useEffect, useState } from "react";
import { ITrade } from "./users/user_trade";
import { IPlayerInfo, ISeasonInfo } from "../routes/players";
// import PlayerThumbs from "./players/player_thumbs";
import StrongLevel from "./players/player_grade";
import { momentDate } from "../utils/dateformat";

export default function Trade({ tradeDate, spid, grade, value }: ITrade) {
  const seasonId = spid.toString().substring(0, 3);
  const [isLoading, setIsLoading] = useState(true);
  const [allPlayer, setAllPlayer] = useState<IPlayerInfo[]>([]);
  const [allSeason, setAllSeason] = useState<ISeasonInfo[]>([]);
  const [player, setPlayer] = useState<IPlayerInfo>();
  const [season, setSeason] = useState<ISeasonInfo>();

  useEffect(() => {
    fetch("https://open.api.nexon.com/static/fconline/meta/spid.json")
      .then((res) => res.json())
      .then((data) => setAllPlayer(data))
      .catch((error) => console.error("Error fetching players data", error));

    fetch("https://open.api.nexon.com/static/fconline/meta/seasonid.json")
      .then((res) => res.json())
      .then((data) => setAllSeason(data))
      .catch((error) => console.error("Error fetching season data", error));
  }, []);

  useEffect(() => {
    allSeason.map((data) => {
      if (data.seasonId.toString() === seasonId.toString()) setSeason(data);
    });
  }, [allSeason, seasonId]);

  useEffect(() => {
    allPlayer
      .filter((p) => p.id.toString() === spid.toString())
      .map((data) => setPlayer(data));
  }, [allPlayer, spid]);

  useEffect(() => {
    if (player && season) setIsLoading(false);
  }, [player, season]);
  // console.log(player);

  return isLoading ? (
    <li>데이터 불러오는 중...</li>
  ) : (
    <li className="flex items-center justify-between py-[5px]">
      <div className="flex items-center gap-[10px] w-1/2">
        <div className="flex gap-[5px]">
          <img
            src={season?.seasonImg}
            alt={season?.className}
            width="20px"
          />
          <p>{player?.name}</p>
        </div>
        <StrongLevel level={grade} />
      </div>
      <p>{value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
      <p>{momentDate(tradeDate, "YYYY.MM.DD HH:mm")}</p>
    </li>
  );
}
