import { useEffect, useState } from "react";
import { IUserInfo } from "../../routes/users";
import Tier from "../tier";

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

export default function UserBestTier({ accessId }: IUserInfo) {
  const [bestTier, setBestTier] = useState<IBestTier[]>([]); // 유저의 역대 최고 등급 달성 데이터
  const [matchType, setMatchType] = useState<IMatchType[]>([]); // 모든 매치 데이터
  const [divisionType, setDivisionType] = useState<IDivisionType[]>([]); // 모든 등급 데이터
  const [voltaDivisionType, setVoltaDivisionType] = useState<IDivisionType[]>(
    []
  ); // 볼타 등급 데이터

  useEffect(() => {
    fetch("https://static.api.nexon.co.kr/fconline/latest/matchtype.json")
      .then((res) => res.json())
      .then((data) => setMatchType(data))
      .catch((error) => {
        console.error("Error fetching match type data: ", error);
      });

    fetch("https://static.api.nexon.co.kr/fconline/latest/division.json")
      .then((res) => res.json())
      .then((data) => setDivisionType(data))
      .catch((error) => {
        console.error("Error fetching division data: ", error);
      });

    fetch("https://static.api.nexon.co.kr/fconline/latest/division_volta.json")
      .then((res) => res.json())
      .then((data) => setVoltaDivisionType(data))
      .catch((error) => {
        console.error("Error fetching volta division data: ", error);
      });

    // const storageTier = sessionStorage.getItem("BestTier");

    // if (storageTier) {
    //   setBestTier(JSON.parse(storageTier));
    // }
  }, [accessId]);

  useEffect(() => {
    if (accessId) {
      const headers = {
        Authorization: import.meta.env.VITE_FCONLINE_API_KEY,
      };

      fetch(
        `https://public.api.nexon.com/openapi/fconline/v1.0/users/${accessId}/maxdivision`,
        { headers }
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
          sessionStorage.setItem("BestTier", JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error fetching tier data: ", error);
        });
    }

    /* const matchData = matchType.filter((match: IMatchType) =>
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
    sessionStorage.setItem("BestTier", JSON.stringify(maxDivisionData)); */
  }, [accessId, divisionType, matchType, voltaDivisionType]);

  console.log(bestTier);

  return (
    <>
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
    </>
  );
}
