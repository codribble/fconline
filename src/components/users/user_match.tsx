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
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [matchRecord, setMatchRecord] = useState<string[]>([]);
  // const swiperRef = useRef<SwiperRef>(null);
  // const storageType = sessionStorage.getItem("SelectedMatchType");

  useEffect(() => {
    const storageType = sessionStorage.getItem("SelectedMatchType");

    const fetchMatchTypes = async () => {
      try {
        const headers = {
          "x-nxopen-api-key": import.meta.env.VITE_FCONLINE_API_KEY,
        };

        const matchTypeResponse = await fetch(
          "https://open.api.nexon.com/static/fconline/meta/matchtype.json"
        );

        if (matchTypeResponse.ok) {
          const matchTypeData = await matchTypeResponse.json();

          const updatedMatchType: IMatchType[] = await Promise.all(
            matchTypeData.map(async (type: IMatchType) => {
              const matchDataResponse = await fetch(
                `https://open.api.nexon.com/fconline/v1/user/match?ouid=${ouid}&matchtype=${type.matchtype}`,
                { headers }
              );

              if (matchDataResponse.ok) {
                const matchList = await matchDataResponse.json();
                if (matchList.length > 0) {
                  return {
                    matchtype: type.matchtype,
                    desc: type.desc,
                  };
                }
              } else {
                console.error(
                  `Failed to fetch match data for matchtype ${type.matchtype}`
                );
              }

              return null; // If no match data, return null
            })
          );

          const filteredMatchType = updatedMatchType.filter(
            Boolean
          ) as IMatchType[];

          if (filteredMatchType.length > 0) {
            storageType
              ? setSelectedType(JSON.parse(storageType))
              : setSelectedType(filteredMatchType[0].matchtype);
          }

          setMatchType(filteredMatchType);
        } else {
          console.error(
            "Failed to fetch match types",
            matchTypeResponse.status
          );
        }
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };

    fetchMatchTypes();
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
          // sessionStorage.setItem("MatchRecord", JSON.stringify(data));
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
        className="flex flex-wrap items-center gap-2 mb-5"
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
        <ul className="flex flex-wrap gap-y-[15px] gap-x-[50px]">
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
          <p>매치 기록을 조회중...</p>
        </div>
      )}
    </>
  );
}
