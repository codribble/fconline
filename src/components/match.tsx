import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IMatchData } from "./match_detail";
import moment from "moment";

interface IMatchId {
  matchId: string;
  userId: string;
}

export default function MatchItem({ matchId, userId }: IMatchId) {
  const navigate = useNavigate();
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

  // console.log(matchDetail);
  // console.log(matchData?.matchInfo);

  return (
    <li className="w-full">
      <Link
        to={`/match/${matchId}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/match/${matchId}`, {
            state: {
              userId: userId,
            },
          });
        }}
        className="flex flex-col gap-2"
      >
        <div className="flex justify-between">
          {matchData?.matchType && matchData?.matchType < 200 && (
            <div className="flex items-center justify-between w-2/5">
              {matchData?.matchInfo
                .filter((data) => data.accessId === userId)
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
              <div className="flex gap-[5px]">
                {matchData?.matchInfo
                  .filter((data) => data.accessId === userId)
                  .map((data, i) => (
                    <p key={i}>{data.shoot.goalTotalDisplay}</p>
                  ))}
                <p>vs</p>
                {matchData?.matchInfo
                  .filter((data) => data.accessId !== userId)
                  .map((data, i) => (
                    <p key={i}>{data.shoot.goalTotalDisplay}</p>
                  ))}
              </div>
              {matchData?.matchInfo
                .filter((data) => data.accessId !== userId)
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
          )}
          <p>{moment(matchData?.matchDate).format("YYYY-MM-DD HH:mm:ss")}</p>
          {/* matchData?.matchInfo.map(
            (data) =>
              data.accessId === userId && (
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
              )
          ) */}
        </div>
      </Link>
    </li>
  );
}
