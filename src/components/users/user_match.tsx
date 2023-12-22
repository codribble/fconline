import { useEffect, /* useRef, */ useState } from "react";
import { IUserInfo } from "../../routes/users";
import MatchItem from "../match";
// import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
// import { EffectFade, Pagination, A11y } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/effect-fade";
// import "swiper/css/pagination";

export interface IMatchType {
  matchtype: number;
  desc: string;
}

export default function UserMatchList({ ouid }: IUserInfo) {
  const [isLoadedMatch, setIsLoadedMatch] = useState(false);
  const [matchType, setMatchType] = useState<IMatchType[]>([]); // 모든 매치 데이터
  const [selectedType, setSelectedType] = useState<number>();
  const [matchRecord, setMatchRecord] = useState([]);
  // const swiperRef = useRef<SwiperRef>(null);

  useEffect(() => {
    const storageType = sessionStorage.getItem("SelectedMatchType");

    fetch("https://open.api.nexon.com/static/fconline/meta/matchtype.json")
      .then((res) => res.json())
      .then((data) => {
        data.map((match: IMatchType, i: number) => {
          storageType
            ? setSelectedType(JSON.parse(storageType))
            : i === 0 && setSelectedType(Number(match.matchtype));
        });
        setMatchType(data);
      });
  }, [ouid]);

  useEffect(() => {
    const headers = {
      "x-nxopen-api-key": import.meta.env.VITE_FCONLINE_API_KEY,
    };

    const matchRecordData = async () => {
      await fetch(
        `https://open.api.nexon.com/fconline/v1/user/match?ouid=${ouid}&matchtype=${selectedType}`,
        { headers }
      )
        .then((res) => res.json())
        .then((data) => {
          setMatchRecord(data);
          sessionStorage.setItem("MatchRecord", JSON.stringify(data));
        })
        .catch((error) =>
          console.error("매치 데이터를 불러오는 중 오류가 발생했습니다.", error)
        );
    };

    matchRecordData();
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
          matchType.map((match) => (
            <button
              key={match.matchtype}
              onClick={() => {
                setSelectedType(match.matchtype);
                sessionStorage.setItem(
                  "SelectedMatchType",
                  match.matchtype.toString()
                );
              }}
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
        <div className="py-[30px] text-center">
          <p>매치 기록이 없습니다.</p>
        </div>
      )}
    </>
  );
}
