import { useEffect, useState } from "react";

export interface IUserInfo {
  accessId: string;
  nickname: string;
  level: number;
}

export interface IBestTier {
  matchType: number;
  division: number;
  achievementDate: string;
  desc?: string;
  tier?: string;
}

export interface IMatchType {
  matchtype: number;
  desc: string;
}

export interface IDivisionType {
  divisionId: number;
  divisionName: string;
}

export default function Users() {
  const [isSearching, setIsSearching] = useState(true);
  const [nickname, setNickname] = useState("");
  const [user, setUser] = useState<IUserInfo>();
  const [bestTier, setBestTier] = useState<IBestTier[]>([]);
  const [matchType, setMatchType] = useState([]);
  const [divisionType, setDivisionType] = useState([]);
  const headers = {
    Authorization: import.meta.env.VITE_FCONLINE_API_KEY,
  };

  useEffect(() => {
    fetch("https://static.api.nexon.co.kr/fconline/latest/matchtype.json")
      .then((res) => res.json())
      .then((data) => setMatchType(data));

    fetch("https://static.api.nexon.co.kr/fconline/latest/division.json")
      .then((res) => res.json())
      .then((data) => setDivisionType(data));
  }, []);

  const onKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setIsSearching(true);
    setNickname(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nickname) {
      try {
        await fetch(
          `https://public.api.nexon.com/openapi/fconline/v1.0/users?nickname=${nickname}`,
          { headers }
        )
          .then((res) => res.json())
          .then((data) => {
            setUser(data);

            fetch(
              `https://public.api.nexon.com/openapi/fconline/v1.0/users/${data.accessId}/maxdivision`,
              { headers }
            )
              .then((res) => res.json())
              .then((data) => {
                const matchData = matchType.filter((match: IMatchType) =>
                  data.some(
                    (tier: IBestTier) => match.matchtype === tier.matchType
                  )
                );
                matchData.forEach(
                  (item: IMatchType, idx) => (data[idx].desc = item.desc)
                );

                const divisionData = divisionType.filter(
                  (division: IDivisionType) =>
                    data.some(
                      (tier: IBestTier) => division.divisionId === tier.division
                    )
                );
                divisionData.forEach((item: IDivisionType) => {
                  data.filter((d: IBestTier, idx: string | number) => {
                    if (d.division === item.divisionId)
                      data[idx].tier = item.divisionName;
                  });
                });

                // console.log(matchData);
                // console.log(divisionData);

                setBestTier(data);
              });
          });
      } catch (error) {
        console.log(error);
      }
    }

    setIsSearching(false);
  };

  return (
    <>
      <form
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
            id="nickname"
            name="nickname"
            type="text"
            value={nickname}
            onChange={onKeywordChange}
            className="w-[200px] px-2 py-2 text-black"
            placeholder="감독명"
          />
          <input
            type="submit"
            value="검색"
          />
        </div>
      </form>

      {!isSearching && (
        <div className="flex flex-col flex-wrap mt-10">
          {user && (
            <div className="w-full">
              <h2 className="">
                Lv.{user.level} {user.nickname}
              </h2>

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
                    className="flex flex-col gap-[20px] w-full"
                  >
                    {bestTier.map((data: IBestTier) => (
                      <li
                        key={data.matchType}
                        className="flex flex-col gap-[10px] p-5 border border-white border-solid rounded-2xl"
                      >
                        <p>
                          {data.desc?.includes("모드")
                            ? data.desc
                            : data.desc + " 모드"}
                        </p>
                        <p>{data.tier}</p>
                        <p>{data.achievementDate}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
