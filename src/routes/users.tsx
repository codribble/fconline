import { useEffect, useRef, useState } from "react";
import UserBestTier from "../components/users/user_tier";
import UserMatchList from "../components/users/user_match";
import { useNavigationType } from "react-router-dom";
import UserTrade from "../components/users/user_trade";

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
  const navigationType = useNavigationType();
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [user, setUser] = useState<IUserInfo | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const headers = {
    "x-nxopen-api-key": import.meta.env.VITE_FCONLINE_API_KEY,
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (navigationType === "POP") {
      const userData = sessionStorage.getItem("User");

      if (userData) {
        const userJSON = JSON.parse(userData);

        setUser(userJSON);
        setNickname(userJSON.nickname);
        setIsLoading(false);
      }
    }

    if (navigationType === "PUSH") {
      setUser(null);
      setIsLoading(true);
      sessionStorage.clear();
    }
  }, [navigationType]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch(
      `https://open.api.nexon.com/fconline/v1/id?nickname=${nickname}`,
      {
        headers,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        fetch(
          `https://open.api.nexon.com/fconline/v1/user/basic?ouid=${data.ouid}`,
          {
            headers: headers,
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
            sessionStorage.setItem("User", JSON.stringify(data));
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching user data: ", error);
          });
      });
    // fetchData();
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="flex items-center gap-5"
        autoComplete="off"
      >
        <div className="relative flex w-full">
          <label
            htmlFor="nickname"
            className="hidden"
          >
            감독명
          </label>
          <input
            ref={inputRef}
            id="nickname"
            name="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.trim())}
            className="w-[calc(100%-60px)] px-2 py-2 text-black md:w-[200px]"
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
        {user?.nickname && !isLoading ? (
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

              <div className="w-full mt-[50px]">
                <p className="block mb-[20px]">
                  <strong className="font-bold text-xl">{user.nickname}</strong>
                  님의 매치 기록
                </p>

                <UserMatchList {...user} />
              </div>

              {user.ouid === "cbb7a30a1f99de28ad2ae118fa60eef5" && (
                <div className="w-full mt-[50px]">
                  <p className="block mb-[20px]">
                    <strong className="font-bold text-xl">
                      {user.nickname}
                    </strong>
                    님의 거래 기록
                  </p>

                  <UserTrade {...user} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-[30px] text-center">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </>
  );
}
