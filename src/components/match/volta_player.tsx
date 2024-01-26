import { useEffect, useState } from "react";
import { IMatchInfo } from "../match_detail";
import { IPlayerInfo, ISeasonInfo } from "../../routes/players";
// import { IPosition } from "../../routes/player_details";
import PlayerThumbs from "../players/player_thumbs";
import StrongLevel from "../players/player_grade";

interface IVoltaPlayer {
  data: IMatchInfo;
  ouid: string;
}

export default function VoltaPlayer({ data, ouid }: IVoltaPlayer) {
  const [allPlayers, setAllPlayers] = useState<IPlayerInfo[]>([]);
  const [allSeason, setAllSeason] = useState<ISeasonInfo[]>([]);
  // const [allPosition, setAllPosition] = useState<IPosition[]>([]);
  const [position, setPosition] = useState("");

  useEffect(() => {
    fetch("https://open.api.nexon.com/static/fconline/meta/spid.json")
      .then((res) => res.json())
      .then((data) => setAllPlayers(data))
      .catch((error) => {
        console.error("Error fetching player data: ", error);
      });

    fetch("https://open.api.nexon.com/static/fconline/meta/seasonid.json")
      .then((res) => res.json())
      .then((data) => setAllSeason(data))
      .catch((error) => {
        console.error("Error fetching season data: ", error);
      });

    /* fetch("https://open.api.nexon.com/static/fconline/meta/spposition.json")
      .then((res) => res.json())
      .then((data) => setAllPosition(data))
      .catch((error) => {
        console.error("Error fetching position data: ", error);
      }); */
  }, []);

  useEffect(() => {
    data.player.map((player) => {
      if (player.spPosition > 19) setPosition("fw");
      else if (player.spPosition > 8) setPosition("mf");
      else if (player.spPosition > 0) setPosition("df");
      else setPosition("");

      /* setPosition(
        player.spPosition > 0
          ? player.spPosition >= 1 && player.spPosition < 9
            ? "df"
            : player.spPosition >= 9 && player.spPosition < 20
            ? "mf"
            : player.spPosition >= 20 && player.spPosition < 28
            ? "fw"
            : ""
          : ""
      ); */
    });
  }, [data]);

  return (
    <div className="flex justify-between gap-[5px] min-h-[80px] group">
      <div
        className={`flex-auto pl-[25px] pr-[15px] bg-position-${position} ${
          data.matchDetail.matchEndType > 1 ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex flex-col gap-[5px]">
            <p className="text-2xl font-semibold">{data.nickname}</p>
            {data.player.map((p) => (
              <div
                key={p.spId}
                className="flex items-center gap-[5px]"
              >
                {allSeason
                  .filter(
                    (data) =>
                      data.seasonId.toString() ===
                      p.spId.toString().substring(0, 3)
                  )
                  .map((data, i) => (
                    <img
                      key={i}
                      src={data.seasonImg}
                      width="25px"
                    />
                  ))}
                {allPlayers
                  .filter((data) => data.id === p.spId)
                  .map((data) => (
                    <p
                      key={data.id}
                      className="text-[#bbb] font-bold"
                    >
                      {data.name}
                    </p>
                  ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-[20px]">
            {data.player.map((p) =>
              allPlayers
                .filter((data) => data.id === p.spId)
                .map((data) => (
                  <div key={data.id}>
                    <PlayerThumbs
                      spId={data.id}
                      name={data.name}
                      width="w-[80px]"
                    />
                  </div>
                ))
            )}
            {data.player.map((p) => (
              <div
                key={p.spId}
                className="flex flex-col items-center gap-[10px]"
              >
                <p className="text-lg font-bold">{position.toUpperCase()}</p>
                <p className="text-center">
                  <StrongLevel level={p.spGrade} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {data.player.map((p) => (
        <div
          key={p.spId}
          className="flex"
        >
          <div
            className={`flex w-[120px] mr-[5px] text-xl font-bold text-center ${
              data.ouid === ouid
                ? "bg-[#eff134] text-black"
                : "bg-white/10 group-hover:bg-white/70 group-hover:text-black"
            }`}
          >
            <div className="flex items-center justify-center w-full h-full">
              {(Math.floor(p.status.spRating * 10) / 10).toFixed(1)}
            </div>
          </div>
          <div
            className={`flex w-[70px] font-bold text-center ${
              data.ouid === ouid
                ? "bg-[#eff134] text-black"
                : "bg-white/10 group-hover:bg-white/70 group-hover:text-black"
            }`}
          >
            <div className="flex items-center justify-center w-full h-full">
              {p.status.goal}
            </div>
          </div>
          <div
            className={`flex w-[70px] font-bold text-center ${
              data.ouid === ouid
                ? "bg-[#eff134] text-black"
                : "bg-white/10 group-hover:bg-white/70 group-hover:text-black"
            }`}
          >
            <div className="flex items-center justify-center w-full h-full">
              {p.status.effectiveShoot}
            </div>
          </div>
          <div
            className={`flex w-[70px] font-bold text-center ${
              data.ouid === ouid
                ? "bg-[#eff134] text-black"
                : "bg-white/10 group-hover:bg-white/70 group-hover:text-black"
            }`}
          >
            <div className="flex items-center justify-center w-full h-full">
              {p.status.assist}
            </div>
          </div>
          <div
            className={`flex w-[70px] font-bold text-center ${
              data.ouid === ouid
                ? "bg-[#eff134] text-black"
                : "bg-white/10 group-hover:bg-white/70 group-hover:text-black"
            }`}
          >
            <div className="flex items-center justify-center w-full h-full">
              {p.status.passSuccess}
            </div>
          </div>
          <div
            className={`flex w-[70px] font-bold text-center ${
              data.ouid === ouid
                ? "bg-[#eff134] text-black"
                : "bg-white/10 group-hover:bg-white/70 group-hover:text-black"
            }`}
          >
            <div className="flex items-center justify-center w-full h-full">
              {p.status.dribbleSuccess}
            </div>
          </div>
          <div
            className={`flex w-[70px] font-bold text-center ${
              data.ouid === ouid
                ? "bg-[#eff134] text-black"
                : "bg-white/10 group-hover:bg-white/70 group-hover:text-black"
            }`}
          >
            <div className="flex items-center justify-center w-full h-full">
              {p.status.tackle}
            </div>
          </div>
          <div
            className={`flex w-[70px] font-bold text-center ${
              data.ouid === ouid
                ? "bg-[#eff134] text-black"
                : "bg-white/10 group-hover:bg-white/70 group-hover:text-black"
            }`}
          >
            <div className="flex items-center justify-center w-full h-full">
              {p.status.blockTry}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
