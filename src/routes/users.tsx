import { useCallback, useEffect, useRef, useState } from "react";
import Tier from "../components/tier";
import MatchItem from "../components/match";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { useLocation, useNavigate } from "react-router-dom";

export interface IUserInfo {
  accessId: string;
  nickname: string;
  level: number;
}

export interface IBestTier {
  matchType: number;
  division: number;
  achievementDate: string;
  desc: string;
  tier: string;
}

export interface IMatchType {
  matchtype: number;
  desc: string;
  type?: number;
  list?: string[];
}

export interface IDivisionType {
  divisionId: number;
  divisionName: string;
}

export default function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadedMatch, setIsLoadedMatch] = useState(false);
  const [nickname, setNickname] = useState("");
  const [user, setUser] = useState<IUserInfo | null>(null);
  const [bestTier, setBestTier] = useState<IBestTier[]>([]); // 유저의 역대 최고 등급 달성 데이터
  const [matchType, setMatchType] = useState([]); // 모든 매치 데이터
  // const [matchCategory, setMatchCategory] = useState([]); // 기록이 있는 매치 데이터
  const [divisionType, setDivisionType] = useState([]); // 모든 등급 데이터
  const [voltaDivisionType, setVoltaDivisionType] = useState([]); // 볼타 등급 데이터
  const [matchRecord, setMatchRecord] = useState<IMatchType[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<SwiperRef>(null);

  useEffect(() => {
    inputRef.current?.focus();

    fetch("https://static.api.nexon.co.kr/fconline/latest/matchtype.json")
      .then((res) => res.json())
      .then((data) => setMatchType(data));

    fetch("https://static.api.nexon.co.kr/fconline/latest/division.json")
      .then((res) => res.json())
      .then((data) => setDivisionType(data));

    fetch("https://static.api.nexon.co.kr/fconline/latest/division_volta.json")
      .then((res) => res.json())
      .then((data) => setVoltaDivisionType(data));
  }, []);

  const fetchData = useCallback(async () => {
    if (nickname) {
      const headers = {
        Authorization: import.meta.env.VITE_FCONLINE_API_KEY,
      };

      try {
        const userData = await fetch(
          `https://public.api.nexon.com/openapi/fconline/v1.0/users?nickname=${nickname}`,
          { headers }
        ).then((res) => res.json());

        setUser(userData);
        sessionStorage.setItem("User", JSON.stringify(userData));

        const maxDivisionData = await fetch(
          `https://public.api.nexon.com/openapi/fconline/v1.0/users/${userData?.accessId}/maxdivision`,
          { headers }
        ).then((res) => res.json());

        const matchData = matchType.filter((match: IMatchType) =>
          maxDivisionData.some(
            (tier: IBestTier) => match.matchtype === tier.matchType
          )
        );

        matchData.forEach((item: IMatchType, idx) => {
          maxDivisionData[idx].desc = item.desc;
        });

        const divisionData = divisionType.filter((division: IDivisionType) =>
          maxDivisionData.some(
            (tier: IBestTier) => division.divisionId === tier.division
          )
        );

        divisionData.forEach((item: IDivisionType) => {
          maxDivisionData.filter((d: IBestTier, idx: number) => {
            if (d.division === item.divisionId)
              maxDivisionData[idx].tier = item.divisionName;
          });
        });

        const voltaDivisionData = voltaDivisionType.filter(
          (division: IDivisionType) =>
            maxDivisionData.some(
              (tier: IBestTier) => division.divisionId === tier.division
            )
        );

        voltaDivisionData.forEach((item: IDivisionType) => {
          maxDivisionData.filter((d: IBestTier, idx: number) => {
            if (d.matchType > 200 && d.division === item.divisionId)
              maxDivisionData[idx].tier = item.divisionName;
          });
        });

        setBestTier(maxDivisionData);
        sessionStorage.setItem("BestTier", JSON.stringify(maxDivisionData));

        // 매치 기록도 가져오는 부분을 추가
        const matchRecordData = await Promise.all(
          matchType.map(async (match: IMatchType) => {
            const matches = await fetch(
              `https://public.api.nexon.com/openapi/fconline/v1.0/users/${userData?.accessId}/matches?matchtype=${match.matchtype}`,
              { headers }
            ).then((res) => res.json());

            return { ...match, list: matches };
          })
        );

        setMatchRecord([...matchRecordData]);
        sessionStorage.setItem(
          "MatchRecord",
          JSON.stringify([...matchRecordData])
        );
        setIsLoadedMatch(true);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) console.log(error.message);
      }
    }
  }, [divisionType, matchType, nickname, voltaDivisionType]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value.trim());
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 검색 시 URL에 검색어 추가
    navigate(`?q=${nickname}`);

    fetchData();
  };

  useEffect(() => {
    // 새로고침 시 검색 결과를 다시 불러오는 로직 추가
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("q");

    if (searchQuery) {
      fetchData();
    }
  }, [fetchData, location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("q");

    if (searchQuery) {
      setNickname(searchQuery);
    }
  }, [location.search]);

  useEffect(() => {
    const storageUser = sessionStorage.getItem("User");
    const storageTier = sessionStorage.getItem("BestTier");
    const storageMatch = sessionStorage.getItem("MatchRecord");

    if (storageUser) {
      setUser(JSON.parse(storageUser));
    }

    if (storageTier) {
      setBestTier(JSON.parse(storageTier));
    }

    if (storageMatch) {
      setMatchRecord(JSON.parse(storageMatch));
    }
  }, []);

  return (
    <>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="flex items-center gap-5"
        autoComplete="off"
      >
        <div className="w-[100px]">
          <label
            htmlFor="nickname"
            className="w-full"
          >
            감독명
          </label>
        </div>
        <div className="relative flex w-full">
          <input
            ref={inputRef}
            id="nickname"
            name="nickname"
            type="text"
            value={nickname}
            onChange={onChange}
            className="w-[200px] px-2 py-2 text-black"
            placeholder="감독명"
          />
          <input
            type="submit"
            value="검색"
            className="w-[60px] bg-indigo-600 cursor-pointer"
          />
        </div>
      </form>

      <div className="flex flex-col flex-wrap mt-10">
        {user && !isLoading && (
          <div className="w-full">
            <h2 className="font-bold text-[30px] text-center">
              Lv.{user.level} {user.nickname}
            </h2>

            <div className="">
              {bestTier && (
                <div className="w-full mt-[30px]">
                  <p className="block mb-[20px]">
                    <strong className="font-bold text-xl">
                      {user.nickname}
                    </strong>
                    님의 역대 최고 등급
                  </p>

                  <ul
                    role="list"
                    className="flex flex-wrap gap-[20px] w-full"
                  >
                    {bestTier.map((data: IBestTier) => (
                      <Tier
                        key={data.matchType}
                        {...data}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {matchRecord && (
                <div className="w-full mt-[50px]">
                  <p className="block mb-[20px]">
                    <strong className="font-bold text-xl">
                      {user.nickname}
                    </strong>
                    님의 매치 기록
                  </p>

                  {isLoadedMatch ? (
                    <div>
                      <div
                        id="matchCategory"
                        role="tablist"
                        className="flex items-center gap-5 mb-5"
                      ></div>

                      <Swiper
                        ref={swiperRef}
                        modules={[EffectFade, Pagination, A11y]}
                        spaceBetween={50}
                        pagination={{
                          renderBullet: (_index, _class) => {
                            const category = matchRecord.filter(
                              (match: IMatchType) =>
                                match.list && match.list?.length > 0
                                  ? match.desc
                                  : ""
                            );
                            const desc =
                              category.length > _index
                                ? category[_index]?.desc
                                : "";

                            return `<span class="${_class}">${desc}</span>`;
                          },
                          el: "#matchCategory",
                          clickable: true,
                          bulletClass: "w-auto h-auto p-2 cursor-pointer",
                          bulletActiveClass:
                            "bg-indigo-600 text-white font-bold rounded",
                        }}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        autoHeight
                        watchSlidesProgress
                        onInit={() => {
                          setTimeout(() => {
                            swiperRef.current?.swiper.update();
                          }, 1000);
                        }}
                      >
                        {matchRecord.length > 0 &&
                          matchRecord.map(
                            (match: IMatchType) =>
                              match.list &&
                              match.list?.length > 0 && (
                                <SwiperSlide key={match.matchtype}>
                                  <ul className="flex flex-wrap gap-[15px]">
                                    {match.list?.map((id) => (
                                      <MatchItem
                                        key={id}
                                        matchId={id}
                                        userId={user.accessId}
                                      />
                                    ))}
                                  </ul>
                                </SwiperSlide>
                              )
                          )}
                      </Swiper>
                    </div>
                  ) : (
                    <div className="">매치 기록 불러오는중...</div>
                  )}
                </div>
              )}

              <div className="w-full mt-[50px]">
                <p className="block mb-[20px]">
                  <strong className="font-bold text-xl">{user.nickname}</strong>
                  님의 거래 기록
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
