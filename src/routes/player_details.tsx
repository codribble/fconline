import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface IPlayerDetails {
  id: number;
  name: string;
  thumbs: string;
  seasonImg: string;
  seasonClass: string;
}

export default function PlayerDetails() {
  const location = useLocation();
  const [info, setInfo] = useState<IPlayerDetails>();

  useEffect(() => {
    setInfo(location.state);
  }, [location.state]);

  return (
    <>
      <h2>{info?.name}</h2>
      <img src={info?.thumbs} />
    </>
  );
}
