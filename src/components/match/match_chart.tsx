import { useEffect, useState } from "react";
import { IMatchInfo } from "../match_detail";

export interface IMatchChart {
  matchData: IMatchInfo[];
}

export default function MatchDataChart({ matchData }: IMatchChart) {
  const [validateMatchEnd, setValidateMatchEnd] = useState(false); // 매치종료 타입 (0 정상종료, 1 몰수승, 2 몰수패)
  const [validateMatchResult, setValidateMatchResult] = useState(true); // 매치 결과 (“승”, “무”, “패”)

  useEffect(() => {
    matchData.map((data: IMatchInfo) => {
      setValidateMatchEnd([0].includes(data.matchDetail.matchEndType));
      setValidateMatchResult(
        ["승", "무", "패"].includes(data.matchDetail.matchResult)
      );
    });
  }, [matchData]);

  return (
    <>
      {matchData.length ? (
        matchData.map((data) => (
          <div
            key={data.ouid}
            className="flex flex-col w-[calc((100%-110px)/2)] text-sm text-center md:w-[50px] md:text-base"
          >
            <p className="py-[25px] border-b border-solid border-white/20 font-bold md:hidden">
              {data.nickname}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.shoot.shootTotal !== null
                ? Number(data.shoot.shootTotal)
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.shoot.effectiveShootTotal !== null
                ? Number(data.shoot.effectiveShootTotal)
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.shoot.goalTotal !== null && data.shoot.shootTotal !== null
                ? data.shoot.shootTotal !== 0
                  ? Math.floor(
                      (data.shoot.goalTotal / data.shoot.shootTotal) * 100
                    ) + "%"
                  : "0%"
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.pass.passSuccess !== null && data.pass.passTry !== null
                ? data.pass.passTry !== 0
                  ? Math.floor(
                      (data.pass.passSuccess / data.pass.passTry) * 100
                    ) + "%"
                  : "0%"
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.matchDetail.possession !== null
                ? Number(data.matchDetail.possession) + "%"
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.matchDetail.cornerKick !== null
                ? Number(data.matchDetail.cornerKick)
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.defence.tackleSuccess !== null
                ? Number(data.defence.tackleSuccess)
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.matchDetail.foul !== null
                ? Number(data.matchDetail.foul)
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.matchDetail.offsideCount !== null
                ? Number(data.matchDetail.offsideCount)
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.matchDetail.yellowCards !== null
                ? Number(data.matchDetail.yellowCards)
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px] border-b border-solid border-white/20">
              {data.matchDetail.redCards !== null
                ? Number(data.matchDetail.redCards)
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
            <p className="py-[10px]">
              {data.matchDetail.injury !== null
                ? Number(data.matchDetail.injury)
                : validateMatchResult
                ? validateMatchEnd
                  ? "오류"
                  : "몰수" + data.matchDetail.matchResult
                : data.matchDetail.matchResult}
            </p>
          </div>
        ))
      ) : (
        <div className="flex flex-col w-[calc((100%-110px)/2)] text-sm text-center md:w-[50px] md:text-base">
          <p className="py-[25px] border-b border-solid border-white/20 font-bold md:hidden">
            -
          </p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px] border-b border-solid border-white/20">-</p>
          <p className="py-[10px]">-</p>
        </div>
      )}
    </>
  );
}
