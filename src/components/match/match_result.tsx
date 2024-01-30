import { useEffect, useState } from "react";
import { IMatchData, IMatchInfo } from "../match_detail";
import MatchDataChart from "./match_chart";

export interface IResult {
  matchData: IMatchData;
  ouid: string;
}

export default function MatchResult({ matchData, ouid }: IResult) {
  const [matchPenalty, setMatchPenalty] = useState(false);
  const [myData, setMyData] = useState<IMatchInfo[]>([]);
  const [oppositeData, setOppositeData] = useState<IMatchInfo[]>([]);

  useEffect(() => {
    const hasPenalty = matchData.matchInfo.some(
      (match: IMatchInfo) => match.shoot.shootOutScore > 0
    );
    setMatchPenalty(hasPenalty);
  }, [matchData]);

  useEffect(() => {
    setMyData(matchData.matchInfo.filter((info) => info.ouid === ouid));
    setOppositeData(matchData.matchInfo.filter((info) => info.ouid !== ouid));
  }, [matchData, ouid]);

  return (
    <>
      <div className="flex items-end justify-evenly w-full mx-auto mb-[50px] text-6xl text-center md:justify-between md:w-1/3 md:text-8xl">
        {myData.length &&
          myData.map((data) => (
            <p
              key={data.ouid}
              className="text-gray-200 font-bold"
            >
              {data.shoot.goalTotalDisplay}
            </p>
          ))}
        {matchPenalty &&
          myData.length &&
          myData.map((data) => (
            <p
              key={data.ouid}
              className="self-end text-2xl font-bold"
            >
              {data.shoot.shootOutScore}
            </p>
          ))}
        <div>
          <p className="text-gray-400">-</p>
          {matchPenalty && (
            <p className="-mt-[20px] text-sm font-bold text-gray-400">
              승부차기
            </p>
          )}
        </div>
        {matchPenalty &&
          oppositeData.length &&
          oppositeData.map((data) => (
            <p
              key={data.ouid}
              className="self-end text-2xl font-bold"
            >
              {data.shoot.shootOutScore}
            </p>
          ))}
        {oppositeData.length ? (
          oppositeData.map((data) => (
            <p
              key={data.ouid}
              className="text-gray-200 font-bold"
            >
              {data.shoot.goalTotalDisplay}
            </p>
          ))
        ) : (
          <p className="text-gray-200 font-bold">-</p>
        )}
      </div>

      <div className="flex justify-between">
        {myData.length &&
          myData.map((data) => (
            <div
              key={data.ouid}
              className="hidden items-center justify-center gap-5 w-1/4 text-center md:flex"
            >
              <p className="font-bold text-[25px]">{data.nickname}</p>
            </div>
          ))}
        <div className="flex w-full md:w-1/3">
          <MatchDataChart matchData={myData} />

          <div className="flex flex-col flex-auto w-[110px] text-sm text-gray-400 text-center md:w-auto md:text-base">
            <p className="py-[25px] border-b border-solid border-white/20 md:hidden">
              감독명
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              슛
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              유효슛
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              슛 성공률(%)
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              패스 성공률(%)
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              점유율(%)
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              코너킥
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              태클
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              파울
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              오프사이드
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              경고
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              퇴장
            </p>
            <p className="py-[10px]">부상</p>
          </div>

          <MatchDataChart matchData={oppositeData} />
        </div>
        {oppositeData.length ? (
          oppositeData.map((data) => (
            <div
              key={data.ouid}
              className="hidden items-center justify-center gap-5 w-1/4 text-center md:flex"
            >
              <p className="font-bold text-[25px]">{data.nickname}</p>
            </div>
          ))
        ) : (
          <div className="hidden items-center justify-center gap-5 w-1/4 text-center md:flex">
            <p className="font-bold text-[25px]">-</p>
          </div>
        )}
      </div>
    </>
  );
}
