import { useEffect, /* useRef, */ useState } from "react";
import { IUserInfo } from "../../routes/users";
// import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
// import { EffectFade, Pagination, A11y } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/effect-fade";
// import "swiper/css/pagination";
import MatchItem from "../match";

export interface IMatchType {
  matchtype: number;
  desc: string;
}

export interface IMatchList {
  matchId: string;
}

export default function MatchList({ ouid }: IUserInfo) {
  const [isLoadedMatch, setIsLoadedMatch] = useState(false);
  const [matchType, setMatchType] = useState<IMatchType[]>([]); // 모든 매치 데이터
  const [selectedType, setSelectedType] = useState(0);
  const [matchRecord, setMatchRecord] = useState<IMatchList[]>([]);
  // const swiperRef = useRef<SwiperRef>(null);

  useEffect(() => {
    fetch("https://open.api.nexon.com/static/fconline/meta/matchtype.json")
      .then((res) => res.json())
      .then((data) => {
        data.map((match: IMatchType, i: number) => {
          if (i === 0) setSelectedType(match.matchtype);
        });
        setMatchType(data);
      });
  }, []);

  useEffect(() => {
    const headers = {
      "x-nxopen-api-key": import.meta.env.VITE_FCONLINE_API_KEY,
    };

    fetch(
      `https://open.api.nexon.com/fconline/v1/user/match?ouid=${ouid}&matchtype=${selectedType}`,
      { headers }
    )
      .then((res) => res.json())
      .then((data) => setMatchRecord(data))
      .catch((error) =>
        console.error("매치 데이터를 불러오는 중 오류가 발생했습니다.", error)
      );

    setIsLoadedMatch(true);
  }, [ouid, selectedType]);

  return (
    <>
      <div
        id="matchCategory"
        role="tablist"
        className="flex items-center gap-2 mb-5"
      >
        {matchType &&
          matchType.map((match, i) => (
            <button
              key={match.matchtype}
              onClick={() => {
                setSelectedType(match.matchtype);
              }}
              data-type={`${i} = ${match.matchtype}`}
              className={`w-auto h-auto p-2 ${
                selectedType === match.matchtype
                  ? "bg-indigo-600 font-bold"
                  : "bg-gray-600"
              } rounded cursor-pointer`}
            >
              {match.desc}
            </button>
          ))}
      </div>

      {matchRecord.length > 0 && isLoadedMatch ? (
        <ul className="flex flex-wrap gap-[15px]">
          {matchRecord.map((id, i) => (
            <MatchItem
              key={i}
              matchId={id}
              ouid={ouid}
            />
          ))}
        </ul>
      ) : (
        <div className="py-[30px] text-center">매치 기록이 없습니다.</div>
      )}
    </>
  );
}