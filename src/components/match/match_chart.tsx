import { IMatchInfo } from "../match_detail";

export interface IMatchChart {
  matchData: IMatchInfo[];
  order: number;
}

export default function MatchDataChart({ matchData, order }: IMatchChart) {
  return (
    <>
      {matchData.map((data) => {
        const matchError = data.matchDetail.matchEndType > 0;
        const matchResult = ["승", "무", "패"].includes(
          data.matchDetail.matchResult
        );

        return (
          <div
            key={data.ouid}
            className={`flex flex-col order-${
              order + 1
            } w-[calc((100%-110px)/2)] text-sm text-center md:order-${
              order * 2
            } md:w-[50px] md:text-base`}
          >
            <p className="py-[25px] border-b border-solid border-white/20 font-bold md:hidden">
              {data.nickname}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError && data.shoot.shootTotal === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.shoot.shootTotal}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError && data.shoot.effectiveShootTotal === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.shoot.effectiveShootTotal}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError &&
              data.shoot.goalTotal === null &&
              data.shoot.shootTotal === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.shoot.goalTotal !== 0 && data.shoot.shootTotal !== 0
                ? Math.floor(
                    (data.shoot.goalTotal / data.shoot.shootTotal) * 100
                  )
                : "0" + "%"}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError &&
              data.pass.passSuccess === null &&
              data.pass.passTry === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : Math.floor(
                    (data.pass.passSuccess / data.pass.passTry) * 100
                  ) + "%"}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError && data.matchDetail.possession === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.matchDetail.possession + "%"}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError && data.matchDetail.cornerKick === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.matchDetail.cornerKick}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError && data.defence.tackleSuccess === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.defence.tackleSuccess}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError && data.matchDetail.foul === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.matchDetail.foul}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError && data.matchDetail.offsideCount === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.matchDetail.offsideCount}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError && data.matchDetail.yellowCards === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.matchDetail.yellowCards}
            </p>
            <p className="py-[15px] border-b border-solid border-white/20">
              {matchError && data.matchDetail.redCards === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.matchDetail.redCards}
            </p>
            <p className="py-[15px]">
              {matchError && data.matchDetail.injury === null
                ? matchResult
                  ? "몰수" + data.matchDetail.matchResult
                  : "오류"
                : data.matchDetail.injury}
            </p>
          </div>
        );
      })}
    </>
  );
}
