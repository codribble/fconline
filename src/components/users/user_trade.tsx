import { useEffect, useState } from "react";
import { IUserInfo } from "../../routes/users";

export default function UserTrade({ accessId }: IUserInfo) {
  const [trade, setTrade] = useState([]);
  const [tradeType, setTradeType] = useState("buy");

  useEffect(() => {
    fetch(
      `https://public.api.nexon.com/openapi/fconline/v1.0/users/${accessId}/markets?tradetype=${tradeType}`
    )
      .then((res) => res.json())
      .then((data) => setTrade(data));
  }, [accessId, tradeType]);

  return (
    <div className="">
      <div
        id="tradeType"
        role="tablist"
        className="flex items-center gap-2 mb-5"
      >
        <button
          className={`min-w-[50px] p-2 rounded${
            tradeType === "buy"
              ? " bg-indigo-600 text-white font-bold"
              : " bg-gray-600"
          }`}
          onClick={() => setTradeType("buy")}
        >
          Buy
        </button>
        <button
          className={`min-w-[50px] p-2 rounded${
            tradeType === "sell"
              ? " bg-indigo-600 text-white font-bold"
              : " bg-gray-600"
          }`}
          onClick={() => setTradeType("sell")}
        >
          Sell
        </button>
      </div>

      <div className="flex flex-col gap-[5px]">
        {trade && trade.length ? (
          trade.map((data) => (
            <div className="">
              <p>{data}</p>
            </div>
          ))
        ) : (
          <div className="py-[30px] text-center">
            최근 2시간 이내 {tradeType === "buy" ? "구입" : "판매"} 내역이
            없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
