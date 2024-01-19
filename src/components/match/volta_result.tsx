import { useEffect, useState } from "react";
import { IPlayerInfo, ISeasonInfo } from "../../routes/players";
import { IPosition } from "../../routes/player_details";
import { IMatchInfo } from "../match_detail";
import { IResult } from "./match_result";

export default function VoltaResult({ matchData, ouid }: IResult) {
  const [allPlayers, setAllPlayers] = useState<IPlayerInfo[]>([]);
  const [allSeason, setAllSeason] = useState<ISeasonInfo[]>([]);
  const [allPosition, setAllPosition] = useState<IPosition[]>([]);
  const [myResult, setMyResult] = useState("");

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

    fetch("https://open.api.nexon.com/static/fconline/meta/spposition.json")
      .then((res) => res.json())
      .then((data) => setAllPosition(data))
      .catch((error) => {
        console.error("Error fetching position data: ", error);
      });
  }, []);

  // console.log(allPlayers);

  useEffect(() => {
    matchData.matchInfo
      .filter((info: IMatchInfo) => info.ouid === ouid)
      .map((data: IMatchInfo) => setMyResult(data.matchDetail.matchResult));
  }, [matchData, ouid]);

  const onThumbsError = (e: React.SyntheticEvent) => {
    if (!(e.target instanceof HTMLImageElement)) return;

    const spId = e.target.dataset.spid;
    const pId = Number(spId?.substr(3, 6));

    switch (e.target.src) {
      default:
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${spId}.png`:
        e.target.src = `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${pId}.png`;
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${pId}.png`:
        e.target.src = `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${spId}.png`;
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${spId}.png`:
        e.target.src = `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pId}.png`;
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pId}.png`:
        e.target.src = `${import.meta.env.BASE_URL}assets/images/no_thumbs.png`;
        break;
    }
  };

  return (
    <>
      <div className="flex w-full">
        <div className="flex flex-col gap-[30px] w-[250px] pt-[36px] pr-[50px]">
          <div className="flex items-center justify-end h-1/2">
            <div className="relative leading-none">
              <span className="absolute top-0 right-0 text-[40px] font-bold -translate-y-1/2 opacity-30 -skew-x-6">
                OUR
              </span>
              <p className="text-[100px] font-bold -skew-x-6">
                {matchData.matchInfo &&
                  matchData.matchInfo
                    .filter(
                      (info) =>
                        info.matchDetail.matchResult === myResult ||
                        info.matchDetail.matchResult === "무"
                    )
                    .reduce(
                      (a, b) =>
                        a.shoot?.goalTotalDisplay > b.shoot?.goalTotalDisplay
                          ? a
                          : b,
                      {} as IMatchInfo
                    )?.shoot?.goalTotalDisplay}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end h-1/2">
            <div className="relative leading-none">
              <span className="absolute top-0 right-0 text-[40px] font-bold -translate-y-1/2 opacity-30 -skew-x-6">
                OTHER
              </span>
              <p className="text-[100px] font-bold -skew-x-6">
                {matchData.matchInfo &&
                  matchData.matchInfo
                    .filter(
                      (info) =>
                        info.matchDetail.matchResult !== myResult ||
                        info.matchDetail.matchResult === "무"
                    )
                    .reduce(
                      (a, b) =>
                        a.shoot?.goalTotalDisplay > b.shoot?.goalTotalDisplay
                          ? a
                          : b,
                      {} as IMatchInfo
                    )?.shoot?.goalTotalDisplay}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-[calc(100%-250px)]">
          <div className="w-full">
            <div className="flex justify-end">
              <div className="flex py-[10px] text-[#aaa]">
                <div className="w-[120px] mr-[5px] text-center">평점</div>
                <div className="w-[70px] text-center">골</div>
                <div className="w-[70px] text-center">유효 슛</div>
                <div className="w-[70px] text-center">도움</div>
                <div className="w-[70px] text-center">패스</div>
                <div className="w-[70px] text-center">드리블</div>
                <div className="w-[70px] text-center">태클</div>
                <div className="w-[70px] text-center">차단</div>
              </div>
            </div>
            <div className="flex flex-col gap-[30px]">
              <div className="flex flex-col gap-[5px]">
                {matchData.matchInfo &&
                  matchData.matchInfo
                    .filter((info) => info.matchDetail.matchResult === myResult)
                    .sort((a, b) => {
                      const bRating = b.player[0]?.status?.spRating;
                      const aRating = a.player[0]?.status?.spRating;

                      return (
                        bRating - aRating ||
                        a.matchDetail.matchEndType - b.matchDetail.matchEndType
                      );
                    })
                    .map((data) => (
                      <div
                        key={data.ouid}
                        className="flex justify-between gap-[5px] min-h-[80px] group"
                      >
                        <div
                          className={`flex-auto pl-[25px] pr-[15px]${data.player.map(
                            (p) =>
                              p.spPosition > 0
                                ? p.spPosition >= 1 && p.spPosition < 9
                                  ? " bg-[#1a338d]"
                                  : p.spPosition >= 9 && p.spPosition < 20
                                  ? " bg-[#5aaa71]"
                                  : p.spPosition >= 20 && p.spPosition < 28
                                  ? " bg-[#ee0045]"
                                  : ""
                                : ""
                          )}${
                            data.matchDetail.matchEndType > 1
                              ? " opacity-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between h-full">
                            <div className="flex flex-col gap-[5px]">
                              <p className="text-2xl font-semibold">
                                {data.nickname}
                              </p>
                              {data.player.map((p) => (
                                <div
                                  key={p.spId}
                                  className="flex items-center gap-[5px]"
                                >
                                  {allSeason
                                    .filter(
                                      (data) =>
                                        data.seasonId.toString() ===
                                        p.spId.toString().substr(0, 3)
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
                                      <img
                                        data-spid={data.id}
                                        src={`https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${data.id}.png`}
                                        onError={onThumbsError}
                                        width="80px"
                                      />
                                    </div>
                                  ))
                              )}
                              {data.player.map((p) => (
                                <div
                                  key={p.spId}
                                  className="flex flex-col items-center gap-[10px]"
                                >
                                  {allPosition
                                    .filter(
                                      (pos) => pos.spposition === p.spPosition
                                    )
                                    .map((data, i) => (
                                      <p
                                        key={i}
                                        className="text-lg font-bold"
                                      >
                                        {data.spposition > 0
                                          ? data.spposition >= 1 &&
                                            data.spposition < 9
                                            ? "DF"
                                            : data.spposition >= 9 &&
                                              data.spposition < 20
                                            ? "MF"
                                            : "FW"
                                          : "GK"}
                                      </p>
                                    ))}
                                  <p className="text-center">
                                    <span
                                      className={`${
                                        p.spGrade > 1
                                          ? p.spGrade > 4
                                            ? p.spGrade > 7
                                              ? "bg-[#f3cf3e] text-[#634e00]"
                                              : "bg-[#d3d6dc] text-[#5c626c]"
                                            : "bg-[#d38763] text-[#733c2a]"
                                          : "bg-[#4d5055] text-[#c6c6c6]"
                                      } px-[10px] font-bold`}
                                    >
                                      {p.spGrade}
                                    </span>
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
                              className={`flex w-[120px] mr-[5px] text-xl font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {(
                                  Math.floor(p.status.spRating * 10) / 10
                                ).toFixed(1)}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.goal}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.effectiveShoot}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.assist}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.passSuccess}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.dribbleSuccess}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.tackle}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.blockTry}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
              </div>
              <div className="flex flex-col gap-[5px]">
                {matchData.matchInfo &&
                  matchData.matchInfo
                    .filter((info) => info.matchDetail.matchResult !== myResult)
                    .sort((a, b) => {
                      const bRating = b.player[0]?.status?.spRating;
                      const aRating = a.player[0]?.status?.spRating;

                      return (
                        bRating - aRating ||
                        a.matchDetail.matchEndType - b.matchDetail.matchEndType
                      );
                    })
                    .map((data) => (
                      <div
                        key={data.ouid}
                        className="flex justify-between gap-[5px] min-h-[80px] group"
                      >
                        <div
                          className={`flex-auto pl-[25px] pr-[15px]${data.player.map(
                            (p) =>
                              p.spPosition > 0
                                ? p.spPosition >= 1 && p.spPosition < 9
                                  ? " bg-[#1a338d]"
                                  : p.spPosition >= 9 && p.spPosition < 20
                                  ? " bg-[#5aaa71]"
                                  : p.spPosition >= 20 && p.spPosition < 28
                                  ? " bg-[#ee0045]"
                                  : ""
                                : ""
                          )}${
                            data.matchDetail.matchEndType > 1
                              ? " opacity-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between h-full">
                            <div className="flex flex-col gap-[5px]">
                              <p className="text-2xl font-semibold">
                                {data.nickname}
                              </p>
                              {data.player.map((p) => (
                                <div
                                  key={p.spId}
                                  className="flex items-center gap-[5px]"
                                >
                                  {allSeason
                                    .filter(
                                      (data) =>
                                        data.seasonId.toString() ===
                                        p.spId.toString().substr(0, 3)
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
                                      <img
                                        data-spid={data.id}
                                        src={`https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${data.id}.png`}
                                        onError={onThumbsError}
                                        width="80px"
                                      />
                                    </div>
                                  ))
                              )}
                              {data.player.map((p) => (
                                <div
                                  key={p.spId}
                                  className="flex flex-col items-center gap-[10px]"
                                >
                                  {allPosition
                                    .filter(
                                      (pos) => pos.spposition === p.spPosition
                                    )
                                    .map((data, i) => (
                                      <p
                                        key={i}
                                        className="text-lg font-bold"
                                      >
                                        {data.spposition > 0
                                          ? data.spposition >= 1 &&
                                            data.spposition < 9
                                            ? "DF"
                                            : data.spposition >= 9 &&
                                              data.spposition < 20
                                            ? "MF"
                                            : "FW"
                                          : "GK"}
                                      </p>
                                    ))}
                                  <p className="text-center">
                                    <span
                                      className={`${
                                        p.spGrade > 1
                                          ? p.spGrade > 4
                                            ? p.spGrade > 7
                                              ? "bg-[#f3cf3e] text-[#634e00]"
                                              : "bg-[#d3d6dc] text-[#5c626c]"
                                            : "bg-[#d38763] text-[#733c2a]"
                                          : "bg-[#4d5055] text-[#c6c6c6]"
                                      } px-[10px] font-bold`}
                                    >
                                      {p.spGrade}
                                    </span>
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
                              className={`flex w-[120px] mr-[5px] text-xl font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {(
                                  Math.floor(p.status.spRating * 10) / 10
                                ).toFixed(1)}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.goal}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.effectiveShoot}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.assist}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.passSuccess}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.dribbleSuccess}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.tackle}
                              </div>
                            </div>
                            <div
                              className={`flex w-[70px] font-bold text-center${
                                data.ouid === ouid
                                  ? " bg-[#eff134] text-black"
                                  : " bg-white/10 group-hover:bg-[#d4d0dd] group-hover:text-black"
                              }`}
                            >
                              <div className="flex items-center justify-center w-full h-full">
                                {p.status.blockTry}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
