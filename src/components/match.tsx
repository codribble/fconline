import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IMatchData, IMatchInfo } from "./match_detail";
import { IUserInfo } from "../routes/users";
import moment from "moment";

export interface IMatchItem {
  matchId: string;
  ouid: string;
}

export default function MatchItem({ matchId, ouid }: IMatchItem) {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [matchData, setMatchData] = useState<IMatchData>();
  const [myResult, setMyResult] = useState("");

  useEffect(() => {
    const headers = {
      "x-nxopen-api-key": import.meta.env.VITE_FCONLINE_API_KEY,
    };

    const fetchMatchData = async (retryCount = 3) => {
      try {
        const response = await fetch(
          `https://open.api.nexon.com/fconline/v1/match-detail?matchid=${matchId}`,
          { headers }
        );

        if (response.ok) {
          const data = await response.json();
          setMatchData(data);

          data.matchInfo
            .filter((data: IUserInfo) => data.ouid === ouid)
            .map((data: IMatchInfo) =>
              setMyResult(data.matchDetail.matchResult)
            );

          setIsLoaded(true);
        } else {
          if (retryCount > 0) {
            fetchMatchData(retryCount - 1);
          } else {
            console.error(
              `Failed to fetch match data. Status: ${response.status}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };

    fetchMatchData();
  }, [matchId, ouid]);

  // console.log(matchData);
  // console.log(matchData?.matchInfo);

  return matchData && isLoaded ? (
    <li className="w-full">
      <Link
        to={`/match/${matchId}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/match/${matchId}`, {
            state: {
              ouid: ouid,
            },
          });
        }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center justify-between">
          {matchData && matchData?.matchType < 200 ? (
            <div className="flex items-center gap-[30px] w-2/5">
              {matchData?.matchInfo &&
                matchData?.matchInfo
                  .filter((data) => data.ouid === ouid)
                  .map((data, i) => (
                    <div
                      key={i}
                      className="flex gap-[10px]"
                    >
                      <p
                        className={`${
                          data.matchDetail.matchResult === "승"
                            ? "text-indigo-600"
                            : data.matchDetail.matchResult === "무"
                            ? "text-yellow-600"
                            : "text-red-600"
                        } font-bold`}
                      >
                        {data.matchDetail.matchResult}
                      </p>
                      <p>{data.nickname}</p>
                    </div>
                  ))}
              <div className="flex items-center gap-[5px]">
                {matchData.matchInfo &&
                  matchData?.matchInfo
                    .filter((data) => data.ouid === ouid)
                    .map((data, i) => (
                      <p
                        key={i}
                        className="text-xl font-bold"
                      >
                        {data.shoot.goalTotalDisplay}
                      </p>
                    ))}
                <p>vs</p>
                {matchData.matchInfo &&
                  matchData?.matchInfo
                    .filter((data) => data.ouid !== ouid)
                    .map((data, i) => (
                      <p
                        key={i}
                        className="text-xl font-bold"
                      >
                        {data.shoot.goalTotalDisplay}
                      </p>
                    ))}
              </div>
              {matchData?.matchInfo &&
                matchData?.matchInfo
                  .filter((data) => data.ouid !== ouid)
                  .map((data, i) => (
                    <div
                      key={i}
                      className="flex gap-[10px]"
                    >
                      <p>{data.nickname}</p>
                      <p
                        className={`${
                          data.matchDetail.matchResult === "승"
                            ? "text-indigo-600"
                            : data.matchDetail.matchResult === "무"
                            ? "text-yellow-600"
                            : "text-red-600"
                        } font-bold`}
                      >
                        {data.matchDetail.matchResult}
                      </p>
                    </div>
                  ))}
            </div>
          ) : (
            <div className="flex items-center gap-[30px] w-2/5">
              {matchData?.matchInfo &&
                matchData?.matchInfo
                  .filter((data) => data.ouid === ouid)
                  .map((data, i) => (
                    <div
                      key={i}
                      className="flex gap-[10px]"
                    >
                      <p
                        className={`${
                          data.matchDetail.matchResult === "승"
                            ? "text-indigo-600"
                            : data.matchDetail.matchResult === "무"
                            ? "text-yellow-600"
                            : "text-red-600"
                        } font-bold`}
                      >
                        {data.matchDetail.matchResult}
                      </p>
                      <p>우리팀</p>
                    </div>
                  ))}
              <div className="flex items-center gap-[5px]">
                <p className="text-xl font-bold">
                  {matchData?.matchInfo &&
                    matchData?.matchInfo
                      .filter(
                        (data) =>
                          data.ouid === ouid &&
                          (data.matchDetail.matchResult === myResult ||
                            data.matchDetail.matchResult === "무")
                      )
                      .reduce(
                        (a, b) =>
                          a.shoot?.goalTotalDisplay > b.shoot?.goalTotalDisplay
                            ? a
                            : b,
                        {} as IMatchInfo
                      )?.shoot?.goalTotalDisplay}
                </p>
                <p>vs</p>
                <p className="text-xl font-bold">
                  {matchData?.matchInfo &&
                    matchData?.matchInfo
                      .filter(
                        (data) =>
                          data.matchDetail.matchResult !== myResult ||
                          data.matchDetail.matchResult === "무"
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
              {matchData?.matchInfo &&
                matchData?.matchInfo
                  .filter(
                    (info) =>
                      info.matchDetail.matchResult !== myResult ||
                      info.matchDetail.matchResult === "무"
                  )
                  .reduce((a: React.ReactNode[], b, i) => {
                    if (i === 0) {
                      a.push(
                        <div
                          key={i}
                          className="flex gap-[10px]"
                        >
                          <p>상대팀</p>
                          <p
                            className={`${
                              b.matchDetail.matchResult === "승"
                                ? "text-indigo-600"
                                : b.matchDetail.matchResult === "무"
                                ? "text-yellow-600"
                                : "text-red-600"
                            } font-bold`}
                          >
                            {b.matchDetail.matchResult}
                          </p>
                        </div>
                      );
                    }
                    return a;
                  }, [])}
            </div>
          )}
          <p>
            {moment(
              moment.utc(moment.utc(matchData?.matchDate)).toDate()
            ).format("YYYY-MM-DD HH:mm:ss")}
          </p>
        </div>
      </Link>
    </li>
  ) : (
    <li className="w-full text-center">
      <p>매치 데이터 불러오는 중...</p>
    </li>
  );
}
