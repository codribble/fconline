import { useEffect, useState } from "react";
import { IMatchData, IMatchInfo } from "../match_detail";

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
      <div className="flex items-end justify-between w-1/3 mx-auto mb-[50px] text-6xl text-center md:text-8xl">
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
          {myData.length &&
            myData.map((data) => (
              <div
                key={data.ouid}
                className="flex flex-col order-1 w-[calc((100%-150px)/2)] text-center md:order-0 md:w-[50px]"
              >
                <p className="py-[25px] border-b border-solid border-white/20 font-bold md:hidden">
                  {data.nickname}
                </p>
                <p className="py-[15px] border-b border-solid border-white/20">
                  {data.shoot.shootTotal}
                </p>
                <p className="py-[15px] border-b border-solid border-white/20">
                  {data.shoot.effectiveShootTotal}
                </p>
                <p className="py-[15px] border-b border-solid border-white/20">
                  {data.shoot.goalTotal !== 0 && data.shoot.shootTotal !== 0
                    ? Math.floor(
                        (data.shoot.goalTotal / data.shoot.shootTotal) * 100
                      ) + "%"
                    : "0%"}
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
                <p className="py-[15px]">{data.matchDetail.injury}</p>
              </div>
            ))}

          <div className="flex flex-col flex-auto order-0 w-[150px] text-gray-400 text-center md:order-1 md:w-auto">
            <p className="py-[25px] border-b border-solid border-white/20 md:hidden">
              감독명
            </p>
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
            <p className="py-[15px]">부상</p>
          </div>

          {oppositeData.length ? (
            oppositeData.map((data) => {
              const matchError = !["승", "무", "패"].includes(
                data.matchDetail.matchResult
              );

              return (
                <div
                  key={data.ouid}
                  className="flex flex-col order-2 w-[calc((100%-150px)/2)] text-center md:order-2 md:w-[50px]"
                >
                  <p className="py-[25px] border-b border-solid border-white/20 font-bold md:hidden">
                    {data.nickname}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : data.shoot.shootTotal}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : data.shoot.effectiveShootTotal}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : Math.floor(
                          (data.shoot.goalTotal / data.shoot.shootTotal) * 100
                        ) + "%"}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : Math.floor(
                          (data.pass.passSuccess / data.pass.passTry) * 100
                        ) + "%"}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : data.matchDetail.possession + "%"}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : data.matchDetail.cornerKick}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : data.defence.tackleSuccess}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : data.matchDetail.foul}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : data.matchDetail.offsideCount}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : data.matchDetail.yellowCards}
                  </p>
                  <p className="py-[15px] border-b border-solid border-white/20">
                    {matchError
                      ? data.matchDetail.matchResult
                      : data.matchDetail.redCards}
                  </p>
                  <p className="py-[15px]">
                    {matchError
                      ? data.matchDetail.matchResult
                      : data.matchDetail.injury}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col order-2 w-[calc((100%-150px)/2)] text-center md:order-2 md:w-[50px]">
              <p className="py-[25px] border-b border-solid border-white/20 font-bold md:hidden">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px] border-b border-solid border-white/20">
                -
              </p>
              <p className="py-[15px]">-</p>
            </div>
          )}
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
          <div className="flex items-center justify-center gap-5 w-1/4 text-center">
            <p className="font-bold text-[25px]">-</p>
          </div>
        )}
      </div>

      {oppositeData.length ? (
        oppositeData.map((data) => {
          if (data.matchDetail.matchResult === "오류") {
            return (
              <div className="mt-[30px]">
                <p className="text-center">데이터 오류</p>
              </div>
            );
          }
        })
      ) : (
        <div className="mt-[30px]">
          <p className="text-center">데이터가 없습니다.</p>
        </div>
      )}
    </>
  );
}
