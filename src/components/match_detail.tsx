import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { useQuery } from "react-query";
import { IUserInfo } from "../routes/users";

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
  player: IPlayers;
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

export interface IPlayers {
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
  const { id } = useParams();
  const { userId } = useLocation().state;
  const [matchPenalty, setMatchPenalty] = useState(false);

  // react-query의 useQuery를 사용하여 데이터를 가져오고 캐시
  const { data: matchData } = useQuery(["matchData", id], async () => {
    const headers = {
      Authorization: import.meta.env.VITE_FCONLINE_API_KEY,
    };

    const response = await fetch(
      `https://public.api.nexon.com/openapi/fconline/v1.0/matches/${id}`,
      { headers }
    );
    const data = await response.json();

    return data;
  });

  useEffect(() => {
    // matchData가 변경될 때 실행
    if (matchData) {
      matchData.matchInfo?.forEach((data: IMatchInfo) => {
        if (data.shoot.shootOutScore) {
          setMatchPenalty(true);
        }
      });
    }
  }, [matchData]);

  /* useEffect(() => {
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

          data.matchInfo?.map((data: IMatchInfo) => {
            data.shoot.shootOutScore && setMatchPenalty(true);
          });
        });
    };
    fetchMatchData();
  }, [id]); */

  return (
    <div>
      <h2 className="mb-[20px] text-[30px] font-bold text-center">
        경기 상세 기록
      </h2>
      <p className="text-center">
        {moment(matchData?.matchDate).format("YYYY년 MM월 DD일 HH시 mm분")}
      </p>

      <div className="mt-[20px]">
        <div className="flex justify-between">
          {matchData?.matchInfo
            .filter((data: IUserInfo) => data.accessId === userId)
            .map((data: IMatchInfo) => (
              <div
                key={data.accessId}
                className="flex flex-col gap-5 w-1/3 text-center"
              >
                <p>{data.nickname}</p>
                {/* <p>
                    {data.matchDetail.matchEndType === 0
                      ? data.matchDetail.matchResult
                      : data.matchDetail.matchEndType === 1
                      ? "몰수승"
                      : "몰수패"}
                  </p> */}
              </div>
            ))}

          <div className="flex items-center justify-center gap-5 w-1/3 text-center">
            {matchData?.matchInfo
              .filter((data: IUserInfo) => data.accessId === userId)
              .map((data: IMatchInfo) => (
                <p key={data.accessId}>
                  {data.shoot.goalTotalDisplay}
                  {matchPenalty && " (" + data.shoot.shootOutScore + ")"}
                </p>
              ))}
            -
            {matchData?.matchInfo
              .filter((data: IUserInfo) => data.accessId !== userId)
              .map((data: IMatchInfo) => (
                <p key={data.accessId}>
                  {matchPenalty && "(" + data.shoot.shootOutScore + ") "}
                  {data.shoot.goalTotalDisplay}
                </p>
              ))}
          </div>

          {matchData?.matchInfo
            .filter((data: IUserInfo) => data.accessId !== userId)
            .map((data: IMatchInfo) => (
              <div
                key={data.accessId}
                className="flex flex-col gap-5 w-1/3 text-center"
              >
                <p>{data.nickname}</p>
                {/* <p>
                    {data.matchDetail.matchEndType === 0
                      ? data.matchDetail.matchResult
                      : data.matchDetail.matchEndType === 1
                      ? "몰수승"
                      : "몰수패"}
                  </p> */}
              </div>
            ))}
        </div>

        <div className="flex mt-[30px]">
          {matchData?.matchInfo
            .filter((data: IUserInfo) => data.accessId === userId)
            .map((data: IMatchInfo) => (
              <div
                key={data.accessId}
                className="flex flex-col gap-5 w-1/3 text-center"
              >
                <p>{data.shoot.shootTotal}</p>
                <p>{data.shoot.effectiveShootTotal}</p>
                <p>
                  {data.shoot.goalTotalDisplay &&
                    data.shoot.effectiveShootTotal &&
                    Math.round(
                      (data.shoot.goalTotalDisplay /
                        data.shoot.effectiveShootTotal) *
                        100
                    )}
                </p>
                <p>
                  {Math.round(
                    (data.pass.passSuccess / data.pass.passTry) * 100
                  )}
                </p>
                <p>{data.matchDetail.possession}</p>
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
            .filter((data: IUserInfo) => data.accessId !== userId)
            .map((data: IMatchInfo) => (
              <div
                key={data.accessId}
                className="flex flex-col gap-5 w-1/3 text-center"
              >
                <p>{data.shoot.shootTotal}</p>
                <p>{data.shoot.effectiveShootTotal}</p>
                <p>
                  {data.shoot.goalTotalDisplay &&
                    data.shoot.effectiveShootTotal &&
                    Math.round(
                      (data.shoot.goalTotalDisplay /
                        data.shoot.effectiveShootTotal) *
                        100
                    )}
                </p>
                <p>
                  {Math.round(
                    (data.pass.passSuccess / data.pass.passTry) * 100
                  )}
                </p>
                <p>{data.matchDetail.possession}</p>
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
      </div>
    </div>
  );
}
