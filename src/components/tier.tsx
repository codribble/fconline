import { momentDate } from "../utils/dateformat";
import { IBestTier } from "./users/user_tier";

export default function Tier({ desc, tier, achievementDate }: IBestTier) {
  return (
    <li className="flex flex-col gap-[10px] relative w-full p-5 border border-white border-solid rounded-2xl hover:border-indigo-600 md:w-[calc(50%-10px)]">
      <p className="font-semibold text-xl">{desc}</p>
      <div className="flex justify-between">
        <p>{tier}</p>
        <time>{momentDate(achievementDate, "YYYY년 MM월 DD일")}</time>
      </div>
    </li>
  );
}
