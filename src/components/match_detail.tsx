import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import Loading from "./loading";
import MatchResult from "./match/match_result";
import VoltaResult from "./match/volta_result";

export interface IMatchData {
  matchId: string;
  matchDate: string;
  matchType: number;
  matchInfo: IMatchInfo[];
}

export interface IMatchInfo {
  ouid: string;
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
  // const ouid = location.state ? location.state.ouid : null;
  const { id } = useParams();
  const { ouid } = useLocation().state;
  const [isLoading, setIsLoading] = useState(true);
  const [matchData, setMatchData] = useState<IMatchData>();
  // const [our, setOur] = useState<IMatchData>();
  // const [other, setOther] = useState<IMatchData>();

  useEffect(() => {
    const headers = {
      "x-nxopen-api-key": import.meta.env.VITE_FCONLINE_API_KEY,
    };

    const fetchMatchData = async () => {
      await fetch(
        `https://open.api.nexon.com/fconline/v1/match-detail?matchid=${id}`,
        { headers }
      )
        .then((res) => res.json())
        .then((data) => {
          setMatchData(data);

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
  }, [id, ouid]);

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
            {matchData &&
              (matchData?.matchType < 200 ? (
                <MatchResult
                  matchData={matchData}
                  ouid={ouid}
                />
              ) : (
                <VoltaResult
                  matchData={matchData}
                  ouid={ouid}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
