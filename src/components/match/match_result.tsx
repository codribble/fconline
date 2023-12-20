import { useEffect, useState } from "react";
import { IMatchData, IMatchInfo } from "../match_detail";

export interface IResult {
  matchData: IMatchData;
  ouid: string;
}

export default function MatchResult({ matchData, ouid }: IResult) {
  const [matchPenalty, setMatchPenalty] = useState(false);

  useEffect(() => {
    const hasPenalty = matchData?.matchInfo?.some(
      (match: IMatchInfo) => match.shoot.shootOutScore > 0
    );
    setMatchPenalty(hasPenalty);
  }, [matchData]);

  return (
    <>
      <div className="flex items-center justify-between w-1/3 mx-auto mb-[50px] text-[100px] text-center">
        {matchData.matchInfo &&
          matchData.matchInfo
            .filter((info) => info.ouid === ouid)
            .map((data) => (
              <p
                key={data.ouid}
                className="text-gray-200 font-bold"
              >
                {data.shoot.goalTotalDisplay}
              </p>
            ))}
        <p className="text-gray-400">-</p>
        {matchData.matchInfo &&
          matchData.matchInfo
            .filter((info) => info.ouid !== ouid)
            .map((data) => (
              <p
                key={data.ouid}
                className="text-gray-200 font-bold"
              >
                {data.shoot.goalTotalDisplay}
              </p>
            ))}
      </div>

      {matchPenalty && (
        <div className="flex justify-center mt-[10px]">
          <div className="flex items-center gap-[15px]">
            {matchData.matchInfo &&
              matchData.matchInfo
                .filter((info) => info.ouid === ouid)
                .map((data) => (
                  <p key={data.ouid}>{data.shoot.shootOutScore}</p>
                ))}
            <p>승부차기</p>
            {matchData.matchInfo &&
              matchData.matchInfo
                .filter((info) => info.ouid !== ouid)
                .map((data) => (
                  <p key={data.ouid}>{data.shoot.shootOutScore}</p>
                ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        {matchData.matchInfo &&
          matchData.matchInfo
            .filter((info) => info.ouid === ouid)
            .map((data) => (
              <div
                key={data.ouid}
                className="flex items-center justify-center gap-5 w-1/4 text-center"
              >
                <p className="text-[30px] font-bold">{data.nickname}</p>
              </div>
            ))}
        <div className="flex w-1/3">
          {matchData.matchInfo &&
            matchData.matchInfo
              .filter((info) => info.ouid === ouid)
              .map((data) => (
                <div
                  key={data.ouid}
                  className="flex flex-col w-[50px] text-center"
                >
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.shoot.shootTotal}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.shoot.effectiveShootTotal}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.shoot.goalTotalDisplay &&
                      data.shoot.shootTotal &&
                      Math.floor(
                        (data.shoot.goalTotalDisplay / data.shoot.shootTotal) *
                          100
                      )}
                    %
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {Math.floor(
                      (data.pass.passSuccess / data.pass.passTry) * 100
                    )}
                    %
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.possession}%
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.cornerKick}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.defence.tackleSuccess}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.foul}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.offsideCount}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.yellowCards}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.redCards}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.injury}
                  </p>
                </div>
              ))}

          <div className="flex flex-col flex-auto text-center">
            <p className="py-[15px] border-b border-solid border-white/20">
              슛
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              유효슛
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              슛 성공률(%)
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              패스 성공률(%)
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              점유율(%)
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              코너킥
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              태클
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              파울
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              오프사이드
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              경고
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              퇴장
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              부상
            </p>
          </div>

          {matchData.matchInfo &&
            matchData.matchInfo
              .filter((info) => info.ouid !== ouid)
              .map((data) => (
                <div
                  key={data.ouid}
                  className="flex flex-col w-[50px] text-center"
                >
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.shoot.shootTotal}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.shoot.effectiveShootTotal}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.shoot.goalTotalDisplay &&
                      data.shoot.shootTotal &&
                      Math.floor(
                        (data.shoot.goalTotalDisplay / data.shoot.shootTotal) *
                          100
                      )}
                    %
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {Math.floor(
                      (data.pass.passSuccess / data.pass.passTry) * 100
                    )}
                    %
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.possession}%
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.cornerKick}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.defence.tackleSuccess}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.foul}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.offsideCount}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.yellowCards}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.redCards}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {data.matchDetail.injury}
                  </p>
                </div>
              ))}
        </div>
        {matchData.matchInfo &&
          matchData.matchInfo
            .filter((info) => info.ouid !== ouid)
            .map((data) => (
              <div
                key={data.ouid}
                className="flex items-center justify-center gap-5 w-1/4 text-center"
              >
                <p className="text-[30px] font-bold">{data.nickname}</p>
              </div>
            ))}
      </div>
    </>
  );
}
