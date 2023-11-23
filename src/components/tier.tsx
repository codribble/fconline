import moment from "moment";
import { IBestTier } from "../routes/users";

export default function Tier({ desc, tier, achievementDate }: IBestTier) {
  return (
    <li className="flex flex-col gap-[10px] relative w-[calc(50%-10px)] p-5 border border-white border-solid rounded-2xl transition-all hover:shadow-md hover:shadow-white">
      <p className="font-semibold text-xl">
        {desc?.includes("모드") ? desc : desc + " 모드"}
      </p>
      <div className="flex justify-between">
        <p>{tier}</p>
        <time>{moment(achievementDate).format("YYYY년 MM월 DD일")}</time>
      </div>
    </li>
  );
}