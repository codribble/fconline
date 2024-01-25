import { useEffect, useState } from "react";
import { IMatchInfo } from "../match_detail";
import { IResult } from "./match_result";
import VoltaPlayer from "./volta_player";

export default function VoltaResult({ matchData, ouid }: IResult) {
  const [myResult, setMyResult] = useState("");

  // console.log(allPlayers);

  useEffect(() => {
    matchData.matchInfo
      .filter((info: IMatchInfo) => info.ouid === ouid)
      .map((data: IMatchInfo) => setMyResult(data.matchDetail.matchResult));
  }, [matchData, ouid]);

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
                      <VoltaPlayer
                        key={data.ouid}
                        data={data}
                        ouid={ouid}
                      />
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
                      <VoltaPlayer
                        key={data.ouid}
                        data={data}
                        ouid={ouid}
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
