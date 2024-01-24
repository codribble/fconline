import { useEffect, useState } from "react";
import { IMatchType, IUserInfo } from "../../routes/users";
import Tier from "../tier";

export interface IBestTier {
  matchType: number;
  division: number;
  achievementDate: string;
  desc: string;
  tier: string;
}

export interface IDivisionType {
  divisionId: number;
  divisionName: string;
}

export default function UserBestTier({ ouid }: IUserInfo) {
  const [bestTier, setBestTier] = useState<IBestTier[]>([]); // 유저의 역대 최고 등급 달성 데이터
  const [matchType, setMatchType] = useState<IMatchType[]>([]); // 모든 매치 데이터
  const [divisionType, setDivisionType] = useState<IDivisionType[]>([]); // 모든 등급 데이터
  const [voltaDivisionType, setVoltaDivisionType] = useState<IDivisionType[]>(
    []
  ); // 볼타 등급 데이터

  useEffect(() => {
    fetch("https://open.api.nexon.com/static/fconline/meta/matchtype.json")
      .then((res) => res.json())
      .then((data) => setMatchType(data))
      .catch((error) => {
        console.error("Error fetching match type data: ", error);
      });

    fetch("https://open.api.nexon.com/static/fconline/meta/division.json")
      .then((res) => res.json())
      .then((data) => setDivisionType(data))
      .catch((error) => {
        console.error("Error fetching division data: ", error);
      });

    fetch("https://open.api.nexon.com/static/fconline/meta/division-volta.json")
      .then((res) => res.json())
      .then((data) => setVoltaDivisionType(data))
      .catch((error) => {
        console.error("Error fetching volta division data: ", error);
      });
  }, [ouid]);

  useEffect(() => {
    if (ouid) {
      const headers = {
        "x-nxopen-api-key": import.meta.env.VITE_FCONLINE_API_KEY,
      };

      fetch(
        `https://open.api.nexon.com/fconline/v1/user/maxdivision?ouid=${ouid}`,
        { headers: headers }
      )
        .then((res) => res.json())
        .then((data) => {
          matchType
            .filter((match) =>
              data.some((tier: IBestTier) => match.matchtype === tier.matchType)
            )
            .forEach((item, idx) => {
              data[idx].desc = item.desc;
            });

          divisionType
            .filter((division) =>
              data.some(
                (tier: IBestTier) => division.divisionId === tier.division
              )
            )
            .forEach((item) => {
              data.filter((d: IBestTier, idx: number) => {
                if (d.division === item.divisionId)
                  data[idx].tier = item.divisionName;
              });
            });

          voltaDivisionType
            .filter((division) =>
              data.some(
                (tier: IBestTier) => division.divisionId === tier.division
              )
            )
            .forEach((item) => {
              data.filter((d: IBestTier, idx: number) => {
                if (d.matchType > 200 && d.division === item.divisionId)
                  data[idx].tier = item.divisionName;
              });
            });

          setBestTier(data);
          // sessionStorage.setItem("BestTier", JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error fetching tier data: ", error);
        });
    }
  }, [ouid, divisionType, matchType, voltaDivisionType]);

  return (
    <>
      <ul
        role="list"
        className="flex flex-wrap gap-[20px] w-full"
      >
        {bestTier &&
          bestTier.map((data) => (
            <Tier
              key={data.matchType}
              {...data}
            />
          ))}
      </ul>
    </>
  );
}
