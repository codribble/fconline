import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ISeasonInfo } from "./player";
import { IPlayerInfo } from "../routes/players";
import { IPosition } from "../routes/player_details";
import { IUserInfo } from "../routes/users";
import moment from "moment";
import Loading from "./loading";

export interface IMatchData {
  matchId: string;
  matchDate: string;
  matchType: number;
  matchInfo: IMatchInfo[];
}

export interface IMatchInfo {
  accessId: string;
  nickname: string;
  shoot: IShoot;
  shootDetail: IShootDetail[];
  matchDetail: IMatchDetail;
  pass: IPass;
  defence: IDefence;
  player: IPlayer[];
}

export interface IMatchDetail {
  seasonId: number;
  matchResult: string;
  matchEndType: number;
  systemPause: number;
  foul: number;
  injury: number;
  redCards: number;
  yellowCards: number;
  dribble: number;
  cornerKick: number;
  possession: number;
  offsideCount: number;
  averageRating: number;
  controller: string;
}

export interface IShoot {
  shootTotal: number;
  effectiveShootTotal: number;
  shootOutScore: number;
  goalTotal: number;
  goalTotalDisplay: number;
  ownGoal: number;
  shootHeading: number;
  goalHeading: number;
  shootFreekick: number;
  goalFreekick: number;
  shootInPenalty: number;
  goalInPenalty: number;
  shootOutPenalty: number;
  goalOutPenalty: number;
  shootPenaltyKick: number;
  goalPenaltyKick: number;
}

export interface IShootDetail {
  goalTime: number;
  x: number;
  y: number;
  type: number;
  result: number;
  spId: number;
  spGrade: number;
  spLevel: number;
  spIdType: boolean;
  assist: boolean;
  assistSpId: number;
  assistX: number;
  assistY: number;
  hitPost: boolean;
  inPenalty: boolean;
}

export interface IPass {
  passTry: number;
  passSuccess: number;
  shortPassTry: number;
  shortPassSuccess: number;
  longPassTry: number;
  longPassSuccess: number;
  bouncingLobPassTry: number;
  bouncingLobPassSuccess: number;
  drivenGroundPassTry: number;
  drivenGroundPassSuccess: number;
  throughPassTry: number;
  throughPassSuccess: number;
  lobbedThroughPassTry: number;
  lobbedThroughPassSuccess: number;
}

export interface IDefence {
  blockTry: number;
  blockSuccess: number;
  tackleTry: number;
  tackleSuccess: number;
}

export interface IPlayer {
  spId: number;
  spPosition: number;
  spGrade: number;
  status: IStatus;
}

export interface IStatus {
  shoot: number;
  effectiveShoot: number;
  assist: number;
  goal: number;
  dribble: number;
  intercept: number;
  defending: number;
  passTry: number;
  passSuccess: number;
  dribbleTry: number;
  dribbleSuccess: number;
  ballPossesionTry: number;
  ballPossesionSuccess: number;
  aerialTry: number;
  aerialSuccess: number;
  blockTry: number;
  block: number;
  tackleTry: number;
  tackle: number;
  yellowCards: number;
  redCards: number;
  spRating: number;
}

export default function MatchDetail() {
  // const location = useLocation();
  // const userId = location.state ? location.state.userId : null;
  const { id } = useParams();
  const { userId } = useLocation().state;
  const [isLoading, setIsLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState<IPlayerInfo[]>([]);
  const [allSeason, setAllSeason] = useState<ISeasonInfo[]>([]);
  const [allPosition, setAllPosition] = useState<IPosition[]>([]);
  const [matchData, setMatchData] = useState<IMatchData>();
  const [matchPenalty, setMatchPenalty] = useState(false);
  const [myResult, setMyResult] = useState("");
  // const [our, setOur] = useState<IMatchData>();
  // const [other, setOther] = useState<IMatchData>();

  useEffect(() => {
    fetch("https://static.api.nexon.co.kr/fconline/latest/spid.json")
      .then((res) => res.json())
      .then((data) => setAllPlayers(data))
      .catch((error) => {
        console.error("Error fetching player data: ", error);
      });

    fetch("https://static.api.nexon.co.kr/fconline/latest/seasonid.json")
      .then((res) => res.json())
      .then((data) => setAllSeason(data))
      .catch((error) => {
        console.error("Error fetching season data: ", error);
      });

    fetch("https://static.api.nexon.co.kr/fconline/latest/spposition.json")
      .then((res) => res.json())
      .then((data) => setAllPosition(data))
      .catch((error) => {
        console.error("Error fetching position data: ", error);
      });
  }, []);

  useEffect(() => {
    console.log("userId in useEffect:", userId);
    console.log("id in useEffect:", id);

    const headers = {
      Authorization: import.meta.env.VITE_FCONLINE_API_KEY,
    };

    const fetchMatchData = async () => {
      await fetch(
        `https://public.api.nexon.com/openapi/fconline/v1.0/matches/${id}`,
        { headers }
      )
        .then((res) => res.json())
        .then((data) => {
          setMatchData(data);

          const hasPenalty = data.matchInfo.some(
            (match: IMatchInfo) => match.shoot.shootOutScore > 0
          );
          setMatchPenalty(hasPenalty);

          data?.matchInfo
            .filter((info: IUserInfo) => info.accessId === userId)
            .map((data: IMatchInfo) =>
              setMyResult(data.matchDetail.matchResult)
            );

          /* if (data.matchType > 200) {
            const myTeam = data.matchInfo.filter(
              (info: IMatchInfo) => info.matchDetail.matchResult === myResult
            );
            console.log(myTeam);

            setOur(myTeam);
          } */
        });
    };

    fetchMatchData();
    setIsLoading(false);
  }, [id, userId]);

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
    <div>
      <h2 className="mb-[20px] text-[30px] font-bold text-center">
        경기 상세 기록
      </h2>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className="text-center">
            {moment(matchData?.matchDate).format("YYYY년 MM월 DD일 HH시 mm분")}
          </p>

          <div className="mt-[20px]">
            {matchData && matchData?.matchType < 200 ? (
              <>
                <div className="flex justify-between">
                  {matchData?.matchInfo
                    .filter((info) => info.accessId === userId)
                    .map((data) => (
                      <div
                        key={data.accessId}
                        className="flex flex-col gap-5 w-1/3 text-center"
                      >
                        <p>{data.nickname}</p>
                      </div>
                    ))}

                  <div className="flex items-center justify-center gap-5 w-1/3 text-center">
                    {matchData?.matchInfo
                      .filter((info) => info.accessId === userId)
                      .map((data) => (
                        <p key={data.accessId}>{data.shoot.goalTotalDisplay}</p>
                      ))}
                    -
                    {matchData?.matchInfo
                      .filter((info) => info.accessId !== userId)
                      .map((data) => (
                        <p key={data.accessId}>{data.shoot.goalTotalDisplay}</p>
                      ))}
                  </div>

                  {matchData?.matchInfo
                    .filter((info) => info.accessId !== userId)
                    .map((data) => (
                      <div
                        key={data.accessId}
                        className="flex flex-col gap-5 w-1/3 text-center"
                      >
                        <p>{data.nickname}</p>
                      </div>
                    ))}
                </div>

                {matchPenalty && (
                  <div className="flex justify-center mt-[10px]">
                    <div className="flex items-center gap-[15px]">
                      {matchData?.matchInfo
                        .filter((info) => info.accessId === userId)
                        .map((data) => (
                          <p key={data.accessId}>{data.shoot.shootOutScore}</p>
                        ))}
                      <p>승부차기</p>
                      {matchData?.matchInfo
                        .filter((info) => info.accessId !== userId)
                        .map((data) => (
                          <p key={data.accessId}>{data.shoot.shootOutScore}</p>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex mt-[30px]">
                  {matchData?.matchInfo
                    .filter((info) => info.accessId === userId)
                    .map((data) => (
                      <div
                        key={data.accessId}
                        className="flex flex-col gap-5 w-1/3 text-center"
                      >
                        <p>{data.shoot.shootTotal}</p>
                        <p>{data.shoot.effectiveShootTotal}</p>
                        <p>
                          {data.shoot.goalTotalDisplay &&
                            data.shoot.shootTotal &&
                            Math.floor(
                              (data.shoot.goalTotalDisplay /
                                data.shoot.shootTotal) *
                                100
                            )}
                          %
                        </p>
                        <p>
                          {Math.floor(
                            (data.pass.passSuccess / data.pass.passTry) * 100
                          )}
                          %
                        </p>
                        <p>{data.matchDetail.possession}%</p>
                        <p>{data.matchDetail.cornerKick}</p>
                        <p>{data.defence.tackleSuccess}</p>
                        <p>{data.matchDetail.foul}</p>
                        <p>{data.matchDetail.offsideCount}</p>
                        <p>{data.matchDetail.yellowCards}</p>
                        <p>{data.matchDetail.redCards}</p>
                        <p>{data.matchDetail.injury}</p>
                      </div>
                    ))}

                  <div className="flex flex-col gap-5 w-1/3 text-center">
                    <p>슛</p>
                    <p>유효슛</p>
                    <p>슛 성공률(%)</p>
                    <p>패스 성공률(%)</p>
                    <p>점유율(%)</p>
                    <p>코너킥</p>
                    <p>태클</p>
                    <p>파울</p>
                    <p>오프사이드</p>
                    <p>경고</p>
                    <p>퇴장</p>
                    <p>부상</p>
                  </div>

                  {matchData?.matchInfo
                    .filter((info) => info.accessId !== userId)
                    .map((data) => (
                      <div
                        key={data.accessId}
                        className="flex flex-col gap-5 w-1/3 text-center"
                      >
                        <p>{data.shoot.shootTotal}</p>
                        <p>{data.shoot.effectiveShootTotal}</p>
                        <p>
                          {data.shoot.goalTotalDisplay &&
                            data.shoot.shootTotal &&
                            Math.floor(
                              (data.shoot.goalTotalDisplay /
                                data.shoot.shootTotal) *
                                100
                            )}
                          %
                        </p>
                        <p>
                          {Math.floor(
                            (data.pass.passSuccess / data.pass.passTry) * 100
                          )}
                          %
                        </p>
                        <p>{data.matchDetail.possession}%</p>
                        <p>{data.matchDetail.cornerKick}</p>
                        <p>{data.defence.tackleSuccess}</p>
                        <p>{data.matchDetail.foul}</p>
                        <p>{data.matchDetail.offsideCount}</p>
                        <p>{data.matchDetail.yellowCards}</p>
                        <p>{data.matchDetail.redCards}</p>
                        <p>{data.matchDetail.injury}</p>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex w-full">
                  <div className="flex flex-col w-[250px] pr-[50px]">
                    <div className="flex items-center justify-end h-1/2">
                      <div className="relative leading-none">
                        <span className="absolute top-0 right-0 text-[40px] font-bold -translate-y-1/2 opacity-30 -skew-x-6">
                          OUR
                        </span>
                        <p className="text-[100px] font-bold -skew-x-6">
                          {
                            matchData?.matchInfo
                              .filter(
                                (info) =>
                                  info.matchDetail.matchResult === myResult ||
                                  info.matchDetail.matchResult === "무"
                              )
                              .reduce(
                                (a, b) =>
                                  a.shoot?.goalTotalDisplay >
                                  b.shoot?.goalTotalDisplay
                                    ? a
                                    : b,
                                {} as IMatchInfo
                              )?.shoot?.goalTotalDisplay
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end h-1/2">
                      <div className="relative leading-none">
                        <span className="absolute top-0 right-0 text-[40px] font-bold -translate-y-1/2 opacity-30 -skew-x-6">
                          OTHER
                        </span>
                        <p className="text-[100px] font-bold -skew-x-6">
                          {
                            matchData?.matchInfo
                              .filter(
                                (info) =>
                                  info.matchDetail.matchResult !== myResult ||
                                  info.matchDetail.matchResult === "무"
                              )
                              .reduce(
                                (a, b) =>
                                  a.shoot?.goalTotalDisplay >
                                  b.shoot?.goalTotalDisplay
                                    ? a
                                    : b,
                                {} as IMatchInfo
                              )?.shoot?.goalTotalDisplay
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-[calc(100%-250px)]">
                    <div className="w-full">
                      <div className="flex justify-end">
                        <div className="flex py-[10px] text-[#aaa]">
                          <div className="w-[120px] mr-[5px] text-center">
                            평점
                          </div>
                          <div className="w-[70px] text-center">골</div>
                          <div className="w-[70px] text-center">유효 슛</div>
                          <div className="w-[70px] text-center">도움</div>
                          <div className="w-[70px] text-center">패스</div>
                          <div className="w-[70px] text-center">드리블</div>
                          <div className="w-[70px] text-center">태클</div>
                          <div className="w-[70px] text-center">차단</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-[5px]">
                        {matchData?.matchInfo
                          /* .sort(
                            (a, b) =>
                              a.matchDetail.matchEndType -
                                b.matchDetail.matchEndType ||
                              b.matchDetail.averageRating -
                                a.matchDetail.averageRating
                          )
                          .filter(
                            (info) => info.matchDetail.matchResult === myResult
                          ) */
                          .map((data) => (
                            <div
                              key={data.accessId}
                              className="flex justify-between gap-[5px] group"
                            >
                              <div
                                className={`flex-auto pl-[25px] pr-[15px]${data.player.map(
                                  (p) =>
                                    p.spPosition > 0
                                      ? p.spPosition >= 1 && p.spPosition < 9
                                        ? " bg-[#1a338d]"
                                        : p.spPosition >= 9 && p.spPosition < 20
                                        ? " bg-[#5aaa71]"
                                        : p.spPosition >= 20 &&
                                          p.spPosition < 28
                                        ? " bg-[#ee0045]"
                                        : ""
                                      : ""
                                )}${
                                  data.matchDetail.matchEndType > 1
                                    ? " opacity-50"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center justify-between">
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
                                        className="flex flex-col items-center gap-[15px]"
                                      >
                                        {allPosition
                                          .filter(
                                            (pos) =>
                                              pos.spposition === p.spPosition
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
                                                    ? "bg-amber-400 text-zinc-800"
                                                    : "bg-gray-300 text-gray-600"
                                                  : "bg-yellow-700 text-zinc-900"
                                                : "bg-zinc-700 text-white"
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
                                  <div className="flex w-[120px] mr-[5px] bg-white/10 text-xl font-bold text-center group-hover:bg-[#eff134] group-hover:text-black">
                                    <div className="flex items-center justify-center w-full h-full">
                                      {(
                                        Math.floor(p.status.spRating * 10) / 10
                                      ).toFixed(1)}
                                    </div>
                                  </div>
                                  <div className="flex w-[70px] bg-white/10 font-bold text-center group-hover:bg-[#eff134] group-hover:text-black">
                                    <div className="flex items-center justify-center w-full h-full">
                                      {p.status.goal}
                                    </div>
                                  </div>
                                  <div className="flex w-[70px] bg-white/10 font-bold text-center group-hover:bg-[#eff134] group-hover:text-black">
                                    <div className="flex items-center justify-center w-full h-full">
                                      {p.status.effectiveShoot}
                                    </div>
                                  </div>
                                  <div className="flex w-[70px] bg-white/10 font-bold text-center group-hover:bg-[#eff134] group-hover:text-black">
                                    <div className="flex items-center justify-center w-full h-full">
                                      {p.status.assist}
                                    </div>
                                  </div>
                                  <div className="flex w-[70px] bg-white/10 font-bold text-center group-hover:bg-[#eff134] group-hover:text-black">
                                    <div className="flex items-center justify-center w-full h-full">
                                      {p.status.passSuccess}
                                    </div>
                                  </div>
                                  <div className="flex w-[70px] bg-white/10 font-bold text-center group-hover:bg-[#eff134] group-hover:text-black">
                                    <div className="flex items-center justify-center w-full h-full">
                                      {p.status.dribbleSuccess}
                                    </div>
                                  </div>
                                  <div className="flex w-[70px] bg-white/10 font-bold text-center group-hover:bg-[#eff134] group-hover:text-black">
                                    <div className="flex items-center justify-center w-full h-full">
                                      {p.status.tackle}
                                    </div>
                                  </div>
                                  <div className="flex w-[70px] bg-white/10 font-bold text-center group-hover:bg-[#eff134] group-hover:text-black">
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
