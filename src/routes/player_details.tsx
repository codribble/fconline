import { ReactEventHandler, useEffect, useState } from "react";
import { Link, /* useLocation, */ useParams } from "react-router-dom";
import { IPlayerInfo, ISeasonInfo } from "./players";
// import axios from "axios";
// import * as cheerio from "cheerio";

export interface IPosition {
  spposition: number;
  desc: string;
}

export default function PlayerDetails() {
  /* const { id, seasonId, name, thumbs, seasonImg, seasonClass } =
    useLocation().state; */
  const { id } = useParams();
  const pId = Number(id?.toString().substring(3));
  const seasonId = Number(id?.toString().substring(0, 3));
  const [name, setName] = useState("");
  const [thumbs, setThumbs] = useState("");
  const [players, setPlayers] = useState<IPlayerInfo[]>([]);
  const [seasons, setSeasons] = useState<ISeasonInfo[]>([]);
  const [otherSeason, setOtherSeason] = useState<ISeasonInfo[]>([]);
  const [otherSeasonPlayers, setOtherSeasonPlayers] = useState<IPlayerInfo[]>(
    []
  );

  useEffect(() => {
    fetch("https://open.api.nexon.com/static/fconline/meta/spid.json")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((error) => {
        console.error("Error fetching player data: ", error);
      });

    fetch("https://open.api.nexon.com/static/fconline/meta/seasonid.json")
      .then((res) => res.json())
      .then((data) => setSeasons(data))
      .catch((error) => console.error("Error fetching season data", error));
  }, []);

  /* useEffect(() => {
    const playerData = async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`https://fconline.com/DataCenter/PlayerInfo?spid=${id}`);
      const content = await page.content();

      const $ = cheerio.load(content);

      const position = $(".position .txt").text();

      console.log(position);
    };

    playerData();
  }, [id]); */

  useEffect(() => {
    players.map((data) => {
      if (data.id.toString() === id) setName(data.name);
    });

    setOtherSeason([]);

    const samePlayer = players.filter((data) => data.name === name);

    samePlayer.forEach((data) => {
      const season = data.id.toString().substring(0, 3);

      seasons
        .filter((data) => data.seasonId.toString() === season)
        .forEach((data) => setOtherSeason((prev) => [...prev, data]));
    });

    setOtherSeasonPlayers(samePlayer);
    setThumbs(
      `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${id}.png`
    );
  }, [id, name, players, seasons]);

  const onError: ReactEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();

    switch (thumbs) {
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${id}.png`:
        setThumbs(
          `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${pId}.png`
        );
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${pId}.png`:
        setThumbs(
          `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${id}.png`
        );
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${id}.png`:
        setThumbs(
          `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pId}.png`
        );
        break;
      case `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pId}.png`:
        setThumbs(`${import.meta.env.BASE_URL}assets/images/no_thumbs.png`);
        break;
    }
  };

  return (
    <section className="">
      <div className="flex gap-[10px]">
        <div>
          {thumbs ? (
            <img
              src={thumbs}
              alt={name}
              onError={onError}
            />
          ) : (
            <p>이미지를 불러올 수 없습니다.</p>
          )}
        </div>
        <h2 className="flex items-center gap-[5px] text-2xl font-bold">
          {seasons
            .filter((data) => data.seasonId === seasonId)
            .map((data) => (
              <img
                key={data.seasonId}
                src={data.seasonImg}
                alt={data.className}
              />
            ))}
          {name}
        </h2>
      </div>

      <div className="mt-[20px]">
        <div className="flex flex-wrap items-center gap-2">
          {otherSeasonPlayers.map((player) =>
            otherSeason
              .filter(
                (season) =>
                  player.id.toString().substring(0, 3) ===
                  season.seasonId.toString()
              )
              .map((season) => (
                <div
                  key={`${player.id}-${season.seasonId}-${season.className}`}
                  className={
                    season.seasonId === seasonId ? "opacity-100" : "opacity-50"
                  }
                >
                  <Link to={`/players/${player.id}`}>
                    <img
                      src={season.seasonImg}
                      alt={season.className}
                    />
                  </Link>
                </div>
              ))
          )}
        </div>
      </div>
    </section>
  );
}
