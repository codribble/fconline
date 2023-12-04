import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";

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
  const params = useParams();
  const matchId = params.id;
  const [matchData, setMatchData] = useState<IMatchData>();

  useEffect(() => {
    const headers = {
      Authorization: import.meta.env.VITE_FCONLINE_API_KEY,
    };

    const fetchMatchData = async () => {
      fetch(
        `https://public.api.nexon.com/openapi/fconline/v1.0/matches/${matchId}`,
        { headers }
      )
        .then((res) => res.json())
        .then((data) => setMatchData(data));
    };
    fetchMatchData();
  }, [matchId]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <div>
          {matchData?.matchInfo.map((data) => (
            <p>{data.nickname}</p>
          ))}
        </div>
        <p className="text-center">
          {moment(matchData?.matchDate).format("YYYY년 MM월 DD일 HH시 mm분")}
        </p>
      </div>
      <div className="flex gap-5"></div>
    </div>
  );
}
