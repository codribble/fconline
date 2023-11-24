import { useParams } from "react-router-dom";

export default function PlayerDetails() {
  const { id } = useParams();

  console.log(`Player ID: ${id}`);

  return (
    <>
      <h2>선수 상세</h2>
      <p>선수 ID: {id}</p>
    </>
  );
}
