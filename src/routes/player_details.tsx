// import axios from "axios";
import { useLocation } from "react-router-dom";

export interface IPosition {
  spposition: number;
  desc: string;
}

export default function PlayerDetails() {
  const { name, thumbs, seasonImg, seasonClass } = useLocation().state;

  return (
    <>
      <div>
        <img src={thumbs} />
      </div>
      <h2 className="flex items-center gap-[5px]">
        <img
          src={seasonImg}
          alt={seasonClass}
        />
        {name}
      </h2>
    </>
  );
}
