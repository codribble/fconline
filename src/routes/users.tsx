import { useCallback, useEffect, useRef, useState } from "react";
import MatchItem from "../components/match";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { useLocation, useNavigate } from "react-router-dom";
// import UserTrade from "../components/users/user_trade";
import UserBestTier from "../components/users/user_tier";

export interface IUserInfo {
  ouid: string;
  nickname: string;
  level: number;
}

export interface IMatchType {
  matchtype: number;
  desc: string;
  type?: number;
  list?: string[];
}

export default function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadedMatch, setIsLoadedMatch] = useState(false);
  const [nickname, setNickname] = useState("");
  const [user, setUser] = useState<IUserInfo | null>(null);
  const [matchType, setMatchType] = useState([]); // 모든 매치 데이터
  const [matchRecord, setMatchRecord] = useState<IMatchType[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const swiperRef = useRef<SwiperRef>(null);

  useEffect(() => {
    inputRef.current?.focus();

    fetch("https://open.api.nexon.com/static/fconline/meta/matchtype.json")
      .then((res) => res.json())
      .then((data) => setMatchType(data));
  }, []);

  const fetchData = useCallback(async () => {
    if (nickname) {
      const headers = {
        "x-nxopen-api-key": import.meta.env.VITE_FCONLINE_API_KEY,
      };

      try {
        const userData = await fetch(
          `https://open.api.nexon.com/fconline/v1/id?nickname=${nickname}`,
          { headers }
        ).then((res) => res.json());

        await fetch(
          `https://open.api.nexon.com/fconline/v1/user/basic?ouid=${userData.ouid}`,
          { headers }
        )
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
            sessionStorage.setItem("User", JSON.stringify(data));
          })
          .catch((error) => {
            console.error("Error fetching user data: ", error);
          });

        // 각 매치 타입에 대한 매치 레코드를 가져와서 배열에 추가
        const matchRecordData = await Promise.all(
          matchType.map(async (match: IMatchType) => {
            const matches = await fetch(
              `https://open.api.nexon.com/fconline/v1/user/match?ouid=${userData?.ouid}&matchtype=${match.matchtype}`,
              { headers }
            ).then((res) => res.json());

            return { ...match, list: matches };
          })
        );

        // 세션스토리지에 이전 매치 레코드를 불러와서 새로운 매치 레코드를 추가하여 저장
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
  }, [nickname, matchType]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value.trim());
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 검색 시 URL에 검색어 추가
    navigate(`?q=${nickname}`);

    fetchData();
  };

  console.log(matchRecord);

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

  /* useEffect(() => {
    const storageUser = sessionStorage.getItem("User");
    const storageMatch = sessionStorage.getItem("MatchRecord");

    if (storageUser) {
      setUser(JSON.parse(storageUser));
    }

    if (storageMatch) {
      setMatchRecord(JSON.parse(storageMatch));
    }
  }, []); */

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

            <div className="mt-[30px]">
              <div className="">
                <p className="block mb-[20px]">
                  <strong className="font-bold text-xl">{user.nickname}</strong>
                  님의 역대 최고 등급
                </p>

                <UserBestTier {...user} />
              </div>

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
                        className="flex items-center gap-2 mb-5"
                      ></div>

                      <Swiper
                        key={matchRecord.length}
                        ref={swiperRef}
                        modules={[EffectFade, Pagination, A11y]}
                        spaceBetween={50}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        autoHeight
                        observer
                        observeParents
                        watchSlidesProgress
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
                          bulletClass:
                            "w-auto h-auto p-2 bg-gray-600 rounded cursor-pointer",
                          bulletActiveClass:
                            "!bg-indigo-600 text-white font-bold",
                        }}
                        onInit={() => {
                          swiperRef.current?.swiper.update();
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
                                        ouid={user.ouid}
                                      />
                                    ))}
                                  </ul>
                                </SwiperSlide>
                              )
                          )}
                      </Swiper>
                    </div>
                  ) : (
                    <div className="py-[30px] text-center">
                      매치 기록 불러오는중...
                    </div>
                  )}
                  {/* matchRecord
                    .filter((record) => record.list && record.list?.length <= 0)
                    .reduce((a: React.ReactNode[], _b, i) => {
                      if (i === 0) {
                        a.push(
                          <div
                            key={i}
                            className="py-[30px] text-center"
                          >
                            최근 1개월간 기록이 없습니다.
                          </div>
                        );
                      }

                      return a;
                    }, []) */}
                </div>
              )}

              {/* <div className="w-full mt-[50px]">
                <p className="block mb-[20px]">
                  <strong className="font-bold text-xl">{user.nickname}</strong>
                  님의 거래 기록
                </p>

                <UserTrade {...user} />
              </div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
