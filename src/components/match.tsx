import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMatchData } from "./match_detail";
import moment from "moment";

interface IMatchId {
  matchId: string;
  userId: string;
}

export default function MatchItem({ matchId, userId }: IMatchId) {
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

  return (
    <li className="w-[calc((100%-50px)/2)]">
      <Link
        to={`/match/${matchId}`}
        className="flex flex-col gap-2"
      >
        <div className="flex justify-between">
          {matchData?.matchType &&
            matchData?.matchType < 200 &&
            matchData?.matchInfo
              .filter((data) => data.accessId !== userId)
              .map((data, i) => <p key={i}>vs {data.nickname}</p>)}
          <p>{moment(matchData?.matchDate).format("YYYY-MM-DD HH:mm:ss")}</p>
        </div>
      </Link>
    </li>
  );
}
