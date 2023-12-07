import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMatchData } from "./match_detail";
import moment from "moment";

interface IMatchId {
  matchId: string;
  userId: string;
}

export default function MatchItem({ matchId }: IMatchId) {
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
    <li className="w-[calc((100%-50px)/2)]">
      <Link
        to={`/match/${matchId}`}
        className="flex flex-col gap-2"
      >
        <div className="flex justify-between">
          {matchData?.matchType && matchData?.matchType < 200 && (
            <div className="flex items-center justify-between w-[calc(100%-200px)]">
              {matchData?.matchInfo
                // .filter((data) => data.accessId !== userId)
                .map((data, i) =>
                  i % 2 === 0 ? (
                    <>
                      <p
                        key={i}
                        className="flex gap-[10px]"
                      >
                        <span
                          className={`${
                            data.matchDetail.matchResult === "승"
                              ? "text-indigo-600"
                              : data.matchDetail.matchResult === "무"
                              ? "text-yellow-600"
                              : "text-red-600"
                          } font-bold`}
                        >
                          {data.matchDetail.matchResult}
                        </span>
                        <span>{data.nickname}</span>
                      </p>
                      <span>vs</span>
                    </>
                  ) : (
                    <p
                      key={i}
                      className="flex gap-[10px]"
                    >
                      <span>{data.nickname}</span>
                      <span
                        className={`${
                          data.matchDetail.matchResult === "승"
                            ? "text-indigo-600"
                            : data.matchDetail.matchResult === "무"
                            ? "text-yellow-600"
                            : "text-red-600"
                        } font-bold`}
                      >
                        {data.matchDetail.matchResult}
                      </span>
                    </p>
                  )
                )}
            </div>
          )}
          <p>{moment(matchData?.matchDate).format("YYYY-MM-DD HH:mm:ss")}</p>
        </div>
      </Link>
    </li>
  );
}
